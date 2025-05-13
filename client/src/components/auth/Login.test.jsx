import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "./Login";
import { AuthContext } from "../../context/AuthContext";
import { MemoryRouter } from "react-router-dom";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("Login Component", () => {
  it("logs in successfully", async () => {
    const login = vi.fn().mockResolvedValue({ email: "test@example.com" });
    render(
      <AuthContext.Provider value={{ login }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@example.com", "123456");
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error on failed login", async () => {
    const login = vi.fn().mockRejectedValue(new Error("Invalid credentials"));
    render(
      <AuthContext.Provider value={{ login }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
