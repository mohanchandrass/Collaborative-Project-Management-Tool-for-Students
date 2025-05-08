import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Dictionary from "./Dictionary";
import { MemoryRouter } from "react-router-dom";

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([{
        meanings: [{
          definitions: [{ definition: "test definition 1" }, {
            definition: "test definition 2",
          }],
        }],
      }]),
  })
);

describe("Dictionary", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Dictionary />
      </MemoryRouter>,
    );
    expect(screen.getByText("📖 Dictionary")).toBeInTheDocument();
  });

  it("allows entering a word", () => {
    render(
      <MemoryRouter>
        <Dictionary />
      </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText("Enter a word");
    fireEvent.change(input, { target: { value: "test" } });
    expect(input.value).toBe("test");
  });

  it("shows error when empty word is searched", async () => {
    render(
      <MemoryRouter>
        <Dictionary />
      </MemoryRouter>,
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Search"));
    });

    expect(screen.getByText("Please enter a word to search."))
      .toBeInTheDocument();
  });

  it("fetches definition on search", async () => {
    render(
      <MemoryRouter>
        <Dictionary />
      </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText("Enter a word");
    fireEvent.change(input, { target: { value: "test" } });

    await act(async () => {
      fireEvent.click(screen.getByText("Search"));
    });

    expect(await screen.findByText(/test definition/)).toBeInTheDocument();
  });
});
