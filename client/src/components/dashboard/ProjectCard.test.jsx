import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ProjectCard from "./ProjectCard";

describe("ProjectCard", () => {
  const mockProject = {
    name: "Test Project",
    description: "Test Description",
    status: "In Progress",
  };

  const mockOnClick = vi.fn();
  const mockOnDelete = vi.fn();

  it("renders without crashing", () => {
    render(
      <ProjectCard
        project={mockProject}
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />,
    );
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    render(
      <ProjectCard
        project={mockProject}
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />,
    );
    fireEvent.click(screen.getByText("Test Project"));
    expect(mockOnClick).toHaveBeenCalledWith(mockProject);
  });

  it("calls onDelete when delete button clicked", () => {
    render(
      <ProjectCard
        project={mockProject}
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />,
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnDelete).toHaveBeenCalled();
  });
});
