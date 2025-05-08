import React from "react";
import { render } from "@testing-library/react";
import TaskStatusPreview from "./TaskStatusPreview";

test("renders TaskStatusPreview component", () => {
  render(<TaskStatusPreview groupId="group1" />);
});
