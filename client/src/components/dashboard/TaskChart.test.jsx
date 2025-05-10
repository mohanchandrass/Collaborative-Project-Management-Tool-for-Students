import React from "react";
import { render, screen } from "@testing-library/react";
import TaskChart from "./TaskChart";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock chart component
jest.mock("react-chartjs-2", () => ({
  Pie: () => <div>Pie Chart Mock</div>,
}));

// Mock Firebase
jest.mock("../../firebase", () => ({
  firestore: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn((ref, callback) => {
    callback({
      forEach: jest.fn(),
    });
    return jest.fn(); // mock unsubscribe
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
