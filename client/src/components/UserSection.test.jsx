import React from "react";
import { render } from "@testing-library/react";
import UserSection from "./UserSection";
import { MemoryRouter } from "react-router-dom";

test("renders UserSection", () => {
  render(
    <MemoryRouter>
      <UserSection />
    </MemoryRouter>,
  );
});
