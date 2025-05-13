import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskChart from "./TaskChart";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock chart component
vi.mock("react-chartjs-2", () => ({
  Pie: () => <div>Pie Chart Mock</div>,
}));

// Mock Firebase
vi.mock("../../firebase", () => ({
  firestore: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn((ref, callback) => {
    callback({
      forEach: vi.fn(),
    });
    return vi.fn(); // mock unsubscribe
  }),
}));

describe("TaskChart", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/groups/test-group"]}>
        <Routes>
          <Route path="/groups/:groupId" element={<TaskChart />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("Task Status Overview")).toBeInTheDocument();
  });

  it("displays the pie chart", () => {
    render(
      <MemoryRouter initialEntries={["/groups/test-group"]}>
        <Routes>
          <Route path="/groups/:groupId" element={<TaskChart />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("Pie Chart Mock")).toBeInTheDocument();
  });

  it("has a back button", () => {
    render(
      <MemoryRouter initialEntries={["/groups/test-group"]}>
        <Routes>
          <Route path="/groups/:groupId" element={<TaskChart />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("Back to Dashboard")).toBeInTheDocument();
  });
});
