import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import MyProjects from "./MyProjects";

// Mock Firebase with proper unsubscribe
vi.mock("../../firebase", () => ({
  firestore: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn((ref, callback) => {
    callback({
      docs: [],
    });
    return vi.fn(); // mock unsubscribe
  }),
  doc: vi.fn(),
  deleteDoc: vi.fn(),
  updateDoc: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ forEach: vi.fn() })),
}));

vi.mock("react-chartjs-2", () => ({
  Line: () => <div>Line Chart Mock</div>,
}));

describe("MyProjects", () => {
  const mockGroupId = "test-group";

  it("renders without crashing", () => {
    render(<MyProjects groupId={mockGroupId} />);
    expect(screen.getByText("My Projects")).toBeInTheDocument();
  });

  it("allows toggling sort type", () => {
    render(<MyProjects groupId={mockGroupId} />);
    const sortButton = screen.getByText(/Sort by:/);
    fireEvent.click(sortButton);
    expect(sortButton.textContent).toMatch(/Least Time/);
  });

  it("shows add project button", () => {
    render(<MyProjects groupId={mockGroupId} />);
    expect(screen.getByText("Add Project")).toBeInTheDocument();
  });
});
