import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import GroupChat from "./GroupChat";
import { MemoryRouter } from "react-router-dom";

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock Firebase
vi.mock("../../firebase", () => ({
  firestore: vi.fn(),
  auth: {
    currentUser: {
      uid: "test-user",
      displayName: "Test User",
    },
  },
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn((q, callback) => {
    callback({
      docs: [],
    });
    return vi.fn(); // mock unsubscribe
  }),
  addDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(),
}));

describe("GroupChat", () => {
  const mockGroupId = "test-group";

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <GroupChat groupId={mockGroupId} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Group Chat")).toBeInTheDocument();
  });

  it("allows typing a message", () => {
    render(
      <MemoryRouter>
        <GroupChat groupId={mockGroupId} />
      </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input.value).toBe("Hello");
  });

  it("sends message on enter", async () => {
    render(
      <MemoryRouter>
        <GroupChat groupId={mockGroupId} />
      </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText("Type a message...");

    await act(async () => {
      fireEvent.change(input, { target: { value: "Hello" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(input.value).toBe("");
  });
});
