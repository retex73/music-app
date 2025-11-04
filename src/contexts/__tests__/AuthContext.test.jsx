import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";

// Mock Firebase
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  deleteUser: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("../../config/firebase", () => ({
  __esModule: true,
  default: {},
}));

describe("AuthContext", () => {
  const mockAuth = {
    currentUser: null,
  };

  const mockUser = {
    uid: "test-user-123",
    email: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getAuth.mockReturnValue(mockAuth);
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  describe("Initial State", () => {
    it("should start with loading state true", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Trigger auth state change to complete loading
      await act(async () => {
        authCallback(null);
      });

      expect(result.current.currentUser).toBeNull();
    });

    it("should render children after loading completes", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Trigger auth state change
      await act(async () => {
        authCallback(null);
      });

      await waitFor(() => {
        expect(result.current.currentUser).toBeNull();
      });
    });
  });

  describe("onAuthStateChanged", () => {
    it("should update user when auth state changes", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Trigger auth state change with user
      await act(async () => {
        authCallback(mockUser);
      });

      await waitFor(() => {
        expect(result.current.currentUser).toEqual(mockUser);
      });
    });

    it("should handle user logout", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // First login
      await act(async () => {
        authCallback(mockUser);
      });
      await waitFor(() => {
        expect(result.current.currentUser).toEqual(mockUser);
      });

      // Then logout
      await act(async () => {
        authCallback(null);
      });
      await waitFor(() => {
        expect(result.current.currentUser).toBeNull();
      });
    });

    it("should return unsubscribe function on unmount", async () => {
      const unsubscribe = jest.fn();
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return unsubscribe;
      });

      const { unmount } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        authCallback(null);
      });

      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  describe("signup", () => {
    it("should call createUserWithEmailAndPassword with correct arguments", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      createUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        authCallback(null);
      });

      const email = "newuser@example.com";
      const password = "password123";

      await act(async () => {
        await result.current.signup(email, password);
      });

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        email,
        password
      );
    });

    it("should handle signup errors", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      const error = new Error("Email already in use");
      createUserWithEmailAndPassword.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        authCallback(null);
      });

      await expect(
        result.current.signup("test@example.com", "password")
      ).rejects.toThrow("Email already in use");
    });
  });

  describe("login", () => {
    it("should call signInWithEmailAndPassword with correct arguments", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        authCallback(null);
      });

      const email = "test@example.com";
      const password = "password123";

      await act(async () => {
        await result.current.login(email, password);
      });

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        email,
        password
      );
    });

    it("should handle login errors", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      const error = new Error("Invalid credentials");
      signInWithEmailAndPassword.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        authCallback(null);
      });

      await expect(
        result.current.login("test@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("logout", () => {
    it("should call signOut", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      signOut.mockResolvedValue();

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        authCallback(mockUser);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(signOut).toHaveBeenCalledWith(mockAuth);
    });

    it("should handle logout errors", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      const error = new Error("Logout failed");
      signOut.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        authCallback(mockUser);
      });

      await expect(result.current.logout()).rejects.toThrow("Logout failed");
    });
  });

  describe("resetPassword", () => {
    it("should call sendPasswordResetEmail with correct email", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      sendPasswordResetEmail.mockResolvedValue();

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        authCallback(null);
      });

      const email = "test@example.com";

      await act(async () => {
        await result.current.resetPassword(email);
      });

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockAuth, email);
    });

    it("should handle resetPassword errors", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      const error = new Error("Email not found");
      sendPasswordResetEmail.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        authCallback(null);
      });

      await expect(
        result.current.resetPassword("invalid@example.com")
      ).rejects.toThrow("Email not found");
    });
  });

  describe("deleteAccount", () => {
    it("should call deleteUser with current user", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      mockAuth.currentUser = mockUser;
      deleteUser.mockResolvedValue();

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        authCallback(mockUser);
      });

      await act(async () => {
        await result.current.deleteAccount();
      });

      expect(deleteUser).toHaveBeenCalledWith(mockUser);
    });

    it("should handle deleteAccount errors", async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        return jest.fn();
      });

      mockAuth.currentUser = mockUser;
      const error = new Error("Delete failed");
      deleteUser.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        authCallback(mockUser);
      });

      await expect(result.current.deleteAccount()).rejects.toThrow(
        "Delete failed"
      );
    });
  });
});
