import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import UserProfile from "./UserProfile";

test("renders UserProfile when show is true", () => {
  render(<UserProfile show={true} onClose={() => {}} />);
});
