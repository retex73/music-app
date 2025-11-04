import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountMenu from "../AccountMenu";
import { useAuth } from "../../contexts/AuthContext";

// Mock AuthContext
jest.mock("../../contexts/AuthContext");

describe("AccountMenu", () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();
  const mockSignup = jest.fn();
  const mockResetPassword = jest.fn();
  const mockDeleteAccount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when user is not logged in", () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        currentUser: null,
        login: mockLogin,
        logout: mockLogout,
        signup: mockSignup,
        resetPassword: mockResetPassword,
        deleteAccount: mockDeleteAccount,
      });
    });

    it("renders menu button", () => {
      render(<AccountMenu />);
      const menuButton = screen.getByRole("button");
      expect(menuButton).toBeInTheDocument();
    });

    it("shows Login and Sign Up options when menu is opened", () => {
      render(<AccountMenu />);

      const menuButton = screen.getByRole("button");
      fireEvent.click(menuButton);

      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    it("opens login dialog when Login is clicked", () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByText("Login"));

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Login", { selector: "h2" })).toBeInTheDocument();
    });

    it("opens signup dialog when Sign Up is clicked", () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByText("Sign Up"));

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Sign Up", { selector: "h2" })).toBeInTheDocument();
    });

    it("dialog contains email and password fields for login", async () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByText("Login"));

      expect(await screen.findByLabelText(/Email/i)).toBeInTheDocument();
      expect(await screen.findByLabelText(/Password/i)).toBeInTheDocument();
    });

    it("dialog contains submit button for login", () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByText("Login"));

      expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });
  });

  describe("when user is logged in", () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        currentUser: { email: "user@example.com" },
        login: mockLogin,
        logout: mockLogout,
        signup: mockSignup,
        resetPassword: mockResetPassword,
        deleteAccount: mockDeleteAccount,
      });
    });

    it("shows user email when menu is opened", () => {
      render(<AccountMenu />);

      const menuButton = screen.getByRole("button");
      fireEvent.click(menuButton);

      expect(screen.getByText("user@example.com")).toBeInTheDocument();
    });

    it("shows logout option", () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("shows Reset Password option", () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByText("Reset Password")).toBeInTheDocument();
    });

    it("shows Delete Account option", () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByText("Delete Account")).toBeInTheDocument();
    });

    it("calls logout function when Logout is clicked", () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByText("Logout"));

      expect(mockLogout).toHaveBeenCalled();
    });

    it("opens reset password dialog", () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByText("Reset Password"));

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Reset Password", { selector: "h2" })).toBeInTheDocument();
    });

    it("opens delete account dialog with warning message", () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByText("Delete Account"));

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete your account/)).toBeInTheDocument();
    });
  });

  describe("dialog interactions", () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        currentUser: null,
        login: mockLogin,
        logout: mockLogout,
        signup: mockSignup,
        resetPassword: mockResetPassword,
        deleteAccount: mockDeleteAccount,
      });
    });

    it("closes dialog when Cancel is clicked", async () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByText("Login"));

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    it("menu closes when dialog is opened", () => {
      render(<AccountMenu />);

      fireEvent.click(screen.getByRole("button"));
      const loginMenuItem = screen.getByText("Login");
      expect(loginMenuItem).toBeVisible();

      fireEvent.click(loginMenuItem);

      // Menu should be closed when dialog opens
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});
