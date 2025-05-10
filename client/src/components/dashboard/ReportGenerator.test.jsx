import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ReportGenerator from "./ReportGenerator";

// Mock jsPDF
jest.mock("jspdf", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    setFont: jest.fn(),
    setFontSize: jest.fn(),
    text: jest.fn(),
    line: jest.fn(),
    setLineWidth: jest.fn(),
    save: jest.fn(),
    splitTextToSize: jest.fn().mockReturnValue([]),
    internal: {
      getNumberOfPages: jest.fn().mockReturnValue(1),
    },
  })),
}));

describe("ReportGenerator", () => {
  it("renders without crashing", () => {
    render(<ReportGenerator />);
    expect(screen.getByText("📝 Project Report Generator")).toBeInTheDocument();
  });

  it("allows input in form fields", () => {
    render(<ReportGenerator />);
    const subjectInput = screen.getByPlaceholderText("Project Subject");
    fireEvent.change(subjectInput, { target: { value: "Test Project" } });
    expect(subjectInput.value).toBe("Test Project");
  });

  it("generates AI summary", () => {
    render(<ReportGenerator />);
    fireEvent.click(screen.getByText("🧠 Generate AI Summary"));
    expect(screen.getByText(/AI-Generated Summary/)).toBeInTheDocument();
  });
});
