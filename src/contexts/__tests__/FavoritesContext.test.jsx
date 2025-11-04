import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { FavoritesProvider, useFavorites } from "../FavoritesContext";
import { useAuth } from "../AuthContext";
import { favouritesService } from "../../services/favouritesService";

// Mock AuthContext
jest.mock("../AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock favouritesService
jest.mock("../../services/favouritesService", () => ({
  favouritesService: {
    getFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
  },
}));

describe("FavoritesContext", () => {
  const mockUser = {
    uid: "test-user-123",
    email: "test@example.com",
  };

  const mockHataoFavorites = ["tune1", "tune2", "tune3"];
  const mockSessionFavorites = ["session1", "session2"];

  beforeEach(() => {
    jest.clearAllMocks();
    // Default to logged out state
    useAuth.mockReturnValue({ currentUser: null });
    favouritesService.getFavorites.mockResolvedValue([]);
  });

  const wrapper = ({ children }) => (
    <FavoritesProvider>{children}</FavoritesProvider>
  );

  describe("Initial State", () => {
    it("should initialize with empty favorites when user is not logged in", async () => {
      useAuth.mockReturnValue({ currentUser: null });
      favouritesService.getFavorites.mockResolvedValue([]);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hataoFavorites).toEqual([]);
      expect(result.current.sessionFavorites).toEqual([]);
    });

    it("should load favorites when user is logged in", async () => {
      useAuth.mockReturnValue({ currentUser: mockUser });
      favouritesService.getFavorites
        .mockResolvedValueOnce(mockHataoFavorites)
        .mockResolvedValueOnce(mockSessionFavorites);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(favouritesService.getFavorites).toHaveBeenCalledWith(
        mockUser.uid,
        "hatao"
      );
      expect(favouritesService.getFavorites).toHaveBeenCalledWith(
        mockUser.uid,
        "session"
      );
      expect(result.current.hataoFavorites).toEqual(mockHataoFavorites);
      expect(result.current.sessionFavorites).toEqual(mockSessionFavorites);
    });
  });

  describe("toggleFavorite - Hatao", () => {
    it("should add favorite when not already favorited", async () => {
      useAuth.mockReturnValue({ currentUser: mockUser });
      favouritesService.getFavorites
        .mockResolvedValueOnce(["tune1"])
        .mockResolvedValueOnce([]);
      favouritesService.addFavorite.mockResolvedValue(true);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleFavorite("tune2", "hatao");
      });

      expect(favouritesService.addFavorite).toHaveBeenCalledWith(
        mockUser.uid,
        "tune2",
        "hatao"
      );

      await waitFor(() => {
        expect(result.current.hataoFavorites).toContain("tune2");
      });
    });

    it("should remove favorite when already favorited", async () => {
      useAuth.mockReturnValue({ currentUser: mockUser });
      favouritesService.getFavorites
        .mockResolvedValueOnce(["tune1", "tune2"])
        .mockResolvedValueOnce([]);
      favouritesService.removeFavorite.mockResolvedValue(true);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleFavorite("tune2", "hatao");
      });

      expect(favouritesService.removeFavorite).toHaveBeenCalledWith(
        mockUser.uid,
        "tune2",
        "hatao"
      );

      await waitFor(() => {
        expect(result.current.hataoFavorites).not.toContain("tune2");
      });
    });

    it("should not update state if service call fails", async () => {
      useAuth.mockReturnValue({ currentUser: mockUser });
      favouritesService.getFavorites
        .mockResolvedValueOnce(["tune1"])
        .mockResolvedValueOnce([]);
      favouritesService.addFavorite.mockResolvedValue(false);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialFavorites = [...result.current.hataoFavorites];

      await act(async () => {
        await result.current.toggleFavorite("tune2", "hatao");
      });

      await waitFor(() => {
        expect(result.current.hataoFavorites).toEqual(initialFavorites);
      });
    });

    it("should do nothing if user is not logged in", async () => {
      useAuth.mockReturnValue({ currentUser: null });
      favouritesService.getFavorites.mockResolvedValue([]);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleFavorite("tune1", "hatao");
      });

      expect(favouritesService.addFavorite).not.toHaveBeenCalled();
      expect(favouritesService.removeFavorite).not.toHaveBeenCalled();
    });
  });

  describe("toggleFavorite - Session", () => {
    it("should add session favorite when not already favorited", async () => {
      useAuth.mockReturnValue({ currentUser: mockUser });
      favouritesService.getFavorites
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(["session1"]);
      favouritesService.addFavorite.mockResolvedValue(true);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleFavorite("session2", "session");
      });

      expect(favouritesService.addFavorite).toHaveBeenCalledWith(
        mockUser.uid,
        "session2",
        "session"
      );

      await waitFor(() => {
        expect(result.current.sessionFavorites).toContain("session2");
      });
    });

    it("should remove session favorite when already favorited", async () => {
      useAuth.mockReturnValue({ currentUser: mockUser });
      favouritesService.getFavorites
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(["session1", "session2"]);
      favouritesService.removeFavorite.mockResolvedValue(true);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleFavorite("session2", "session");
      });

      expect(favouritesService.removeFavorite).toHaveBeenCalledWith(
        mockUser.uid,
        "session2",
        "session"
      );

      await waitFor(() => {
        expect(result.current.sessionFavorites).not.toContain("session2");
      });
    });

    it("should default to hatao type when type not specified", async () => {
      useAuth.mockReturnValue({ currentUser: mockUser });
      favouritesService.getFavorites
        .mockResolvedValueOnce(["tune1"])
        .mockResolvedValueOnce([]);
      favouritesService.addFavorite.mockResolvedValue(true);

      const { result } = renderHook(() => useFavorites(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleFavorite("tune2");
      });

      expect(favouritesService.addFavorite).toHaveBeenCalledWith(
        mockUser.uid,
        "tune2",
        "hatao"
      );
    });
  });

  describe("User State Changes", () => {
    it("should reset favorites when user logs out", async () => {
      // Create a custom wrapper that we can control
      let currentUserValue = mockUser;

      const CustomWrapper = ({ children }) => {
        useAuth.mockReturnValue({ currentUser: currentUserValue });
        return <FavoritesProvider>{children}</FavoritesProvider>;
      };

      // Start logged in
      favouritesService.getFavorites
        .mockResolvedValueOnce(mockHataoFavorites)
        .mockResolvedValueOnce(mockSessionFavorites);

      const { result, rerender } = renderHook(() => useFavorites(), {
        wrapper: CustomWrapper,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hataoFavorites).toEqual(mockHataoFavorites);
      expect(result.current.sessionFavorites).toEqual(mockSessionFavorites);

      // Now log out
      currentUserValue = null;
      useAuth.mockReturnValue({ currentUser: null });
      favouritesService.getFavorites.mockResolvedValue([]);

      rerender();

      await waitFor(() => {
        expect(result.current.hataoFavorites).toEqual([]);
        expect(result.current.sessionFavorites).toEqual([]);
      });
    });

    it("should load favorites when user logs in", async () => {
      // Create a custom wrapper that we can control
      let currentUserValue = null;

      const CustomWrapper = ({ children }) => {
        useAuth.mockReturnValue({ currentUser: currentUserValue });
        return <FavoritesProvider>{children}</FavoritesProvider>;
      };

      // Start logged out
      favouritesService.getFavorites.mockResolvedValue([]);

      const { result, rerender } = renderHook(() => useFavorites(), {
        wrapper: CustomWrapper,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hataoFavorites).toEqual([]);
      expect(result.current.sessionFavorites).toEqual([]);

      // Now log in
      currentUserValue = mockUser;
      useAuth.mockReturnValue({ currentUser: mockUser });
      favouritesService.getFavorites
        .mockResolvedValueOnce(mockHataoFavorites)
        .mockResolvedValueOnce(mockSessionFavorites);

      rerender();

      await waitFor(() => {
        expect(result.current.hataoFavorites).toEqual(mockHataoFavorites);
        expect(result.current.sessionFavorites).toEqual(mockSessionFavorites);
      });
    });
  });
});
