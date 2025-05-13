import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import TaskStatusPreview from "./TaskStatusPreview";

test("renders TaskStatusPreview component", () => {
  render(<TaskStatusPreview groupId="group1" />);
});
