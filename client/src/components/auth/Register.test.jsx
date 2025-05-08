import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Register from "./Register.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Register Component", () => {
  it("registers successfully", async () => {
    const signup = jest.fn().mockResolvedValue({
      email: "newuser@example.com",
      username: "newuser",
    });

    render(
      <AuthContext.Provider value={{ signup }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith(
        "newuser",
        "newuser@example.com",
        "password123",
      );
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error on failed registration", async () => {
    const signup = jest.fn().mockRejectedValue(
      new Error("Email already in use"),
    );

    render(
      <AuthContext.Provider value={{ signup }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "existinguser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "existinguser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already in use/i)).toBeInTheDocument();
    });
  });
});
