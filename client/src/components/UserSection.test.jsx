import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import UserSection from "./UserSection";
import { MemoryRouter } from "react-router-dom";

describe("UserSection", () => {
  it("renders UserSection", () => {
    render(
      <MemoryRouter>
        <UserSection />
      </MemoryRouter>,
    );
  });
});
