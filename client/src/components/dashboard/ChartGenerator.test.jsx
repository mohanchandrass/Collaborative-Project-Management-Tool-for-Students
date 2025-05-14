import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ChartGenerator from "./ChartGenerator";
import { MemoryRouter } from "react-router-dom";

// Mock chart components
vi.mock("react-chartjs-2", () => ({
  Pie: () => <div>Pie Chart Mock</div>,
  Bar: () => <div>Bar Chart Mock</div>,
  Line: () => <div>Line Chart Mock</div>,
  Doughnut: () => <div>Doughnut Chart Mock</div>,
  Radar: () => <div>Radar Chart Mock</div>,
}));

describe("ChartGenerator", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <ChartGenerator />
      </MemoryRouter>,
    );
    expect(screen.getByText("Chart Generator")).toBeInTheDocument();
  });

  it("allows changing chart type", () => {
    render(
      <MemoryRouter>
        <ChartGenerator />
      </MemoryRouter>,
    );
    const select = screen.getByLabelText("Chart Type:");
    fireEvent.change(select, { target: { value: "bar" } });
    expect(select.value).toBe("bar");
  });

  it("allows entering labels and values", () => {
    render(
      <MemoryRouter>
        <ChartGenerator />
      </MemoryRouter>,
    );
    const labelsInput = screen.getByPlaceholderText(
      "e.g., Apple, Banana, Orange",
    );
    fireEvent.change(labelsInput, { target: { value: "A,B,C" } });
    expect(labelsInput.value).toBe("A,B,C");
  });

  it("generates chart on button click", () => {
    render(
      <MemoryRouter>
        <ChartGenerator />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText("🚀 Generate Chart"));
    expect(screen.getByText(/Chart Mock/)).toBeInTheDocument();
  });
});
