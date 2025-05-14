import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ReportGenerator from "./ReportGenerator";

// Mock jsPDF
vi.mock("jspdf", () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({
    setFont: vi.fn(),
    setFontSize: vi.fn(),
    text: vi.fn(),
    line: vi.fn(),
    setLineWidth: vi.fn(),
    save: vi.fn(),
    splitTextToSize: vi.fn().mockReturnValue([]),
    internal: {
      getNumberOfPages: vi.fn().mockReturnValue(1),
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
