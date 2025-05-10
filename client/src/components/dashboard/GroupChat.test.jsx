import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import GroupChat from "./GroupChat";
import { MemoryRouter } from "react-router-dom";

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock Firebase
jest.mock("../../firebase", () => ({
  firestore: jest.fn(),
  auth: {
    currentUser: {
      uid: "test-user",
      displayName: "Test User",
    },
  },
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn((q, callback) => {
    callback({
      docs: [],
    });
    return jest.fn(); // mock unsubscribe
  }),
  addDoc: jest.fn(() => Promise.resolve()),
  serverTimestamp: jest.fn(),
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
