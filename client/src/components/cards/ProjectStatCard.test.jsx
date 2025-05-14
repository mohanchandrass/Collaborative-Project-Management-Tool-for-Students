import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import ProjectStatCard from "./ProjectStatCard";

test("renders without crashing", () => {
  expect(() => render(<ProjectStatCard />)).not.toThrow();
});
