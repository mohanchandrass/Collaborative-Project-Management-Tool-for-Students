import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import MyProjects from "./MyProjects";

// Mock Firebase with proper unsubscribe
jest.mock("../../firebase", () => ({
  firestore: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn((ref, callback) => {
    callback({
      docs: [],
    });
    return jest.fn(); // mock unsubscribe
  }),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ forEach: jest.fn() })),
}));

jest.mock("react-chartjs-2", () => ({
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
