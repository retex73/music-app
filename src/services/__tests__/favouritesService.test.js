import { favouritesService } from "../favouritesService";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

// Mock Firebase
jest.mock("firebase/firestore");
jest.mock("../../config/firebase", () => ({
  __esModule: true,
  default: {},
}));

describe("favouritesService", () => {
  const mockUserId = "user123";
  const mockTuneId = "tune456";
  const mockDb = {};

  beforeEach(() => {
    jest.clearAllMocks();
    getFirestore.mockReturnValue(mockDb);
  });

  describe("getFavorites", () => {
    it("should return favorites for existing user", async () => {
      const mockFavorites = ["tune1", "tune2", "tune3"];
      const mockDocSnap = {
        exists: () => true,
        data: () => ({ hatao: mockFavorites }),
      };

      doc.mockReturnValue({ id: mockUserId });
      getDoc.mockResolvedValue(mockDocSnap);

      const result = await favouritesService.getFavorites(mockUserId, "hatao");

      expect(doc).toHaveBeenCalledWith(mockDb, "favorites", mockUserId);
      expect(getDoc).toHaveBeenCalled();
      expect(result).toEqual(mockFavorites);
    });

    it("should return empty array and initialize for new user", async () => {
      const mockDocSnap = {
        exists: () => false,
      };

      doc.mockReturnValue({ id: mockUserId });
      getDoc.mockResolvedValue(mockDocSnap);
      setDoc.mockResolvedValue(undefined);

      const result = await favouritesService.getFavorites(mockUserId, "hatao");

      expect(setDoc).toHaveBeenCalledWith(
        { id: mockUserId },
        { hatao: [] },
        { merge: true }
      );
      expect(result).toEqual([]);
    });

    it("should return session favorites when type is session", async () => {
      const mockSessionFavorites = ["session1", "session2"];
      const mockDocSnap = {
        exists: () => true,
        data: () => ({ thesession: mockSessionFavorites }),
      };

      doc.mockReturnValue({ id: mockUserId });
      getDoc.mockResolvedValue(mockDocSnap);

      const result = await favouritesService.getFavorites(
        mockUserId,
        "thesession"
      );

      expect(result).toEqual(mockSessionFavorites);
    });

    it("should return empty array if type not found in document", async () => {
      const mockDocSnap = {
        exists: () => true,
        data: () => ({ hatao: ["tune1"] }),
      };

      doc.mockReturnValue({ id: mockUserId });
      getDoc.mockResolvedValue(mockDocSnap);

      const result = await favouritesService.getFavorites(
        mockUserId,
        "thesession"
      );

      expect(result).toEqual([]);
    });

    it("should handle errors and return empty array", async () => {
      doc.mockReturnValue({ id: mockUserId });
      getDoc.mockRejectedValue(new Error("Firestore error"));

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await favouritesService.getFavorites(mockUserId, "hatao");

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting favorites:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("should default to hatao type if not specified", async () => {
      const mockFavorites = ["tune1"];
      const mockDocSnap = {
        exists: () => true,
        data: () => ({ hatao: mockFavorites }),
      };

      doc.mockReturnValue({ id: mockUserId });
      getDoc.mockResolvedValue(mockDocSnap);

      const result = await favouritesService.getFavorites(mockUserId);

      expect(result).toEqual(mockFavorites);
    });
  });

  describe("addFavorite", () => {
    it("should add favorite successfully", async () => {
      doc.mockReturnValue({ id: mockUserId });
      setDoc.mockResolvedValue(undefined);

      const result = await favouritesService.addFavorite(
        mockUserId,
        mockTuneId,
        "hatao"
      );

      expect(doc).toHaveBeenCalledWith(mockDb, "favorites", mockUserId);
      expect(setDoc).toHaveBeenCalledWith(
        { id: mockUserId },
        {
          hatao: expect.any(Object), // arrayUnion
        },
        { merge: true }
      );
      expect(result).toBe(true);
    });

    it("should handle errors and return false", async () => {
      doc.mockReturnValue({ id: mockUserId });
      setDoc.mockRejectedValue(new Error("Firestore error"));

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await favouritesService.addFavorite(
        mockUserId,
        mockTuneId,
        "hatao"
      );

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error adding favorite:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("should default to hatao type if not specified", async () => {
      doc.mockReturnValue({ id: mockUserId });
      setDoc.mockResolvedValue(undefined);

      await favouritesService.addFavorite(mockUserId, mockTuneId);

      expect(setDoc).toHaveBeenCalledWith(
        { id: mockUserId },
        expect.objectContaining({ hatao: expect.any(Object) }),
        { merge: true }
      );
    });
  });

  describe("removeFavorite", () => {
    it("should remove favorite successfully", async () => {
      doc.mockReturnValue({ id: mockUserId });
      setDoc.mockResolvedValue(undefined);

      const result = await favouritesService.removeFavorite(
        mockUserId,
        mockTuneId,
        "hatao"
      );

      expect(doc).toHaveBeenCalledWith(mockDb, "favorites", mockUserId);
      expect(setDoc).toHaveBeenCalledWith(
        { id: mockUserId },
        {
          hatao: expect.any(Object), // arrayRemove
        },
        { merge: true }
      );
      expect(result).toBe(true);
    });

    it("should handle errors and return false", async () => {
      doc.mockReturnValue({ id: mockUserId });
      setDoc.mockRejectedValue(new Error("Firestore error"));

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await favouritesService.removeFavorite(
        mockUserId,
        mockTuneId,
        "hatao"
      );

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error removing favorite:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("should default to hatao type if not specified", async () => {
      doc.mockReturnValue({ id: mockUserId });
      setDoc.mockResolvedValue(undefined);

      await favouritesService.removeFavorite(mockUserId, mockTuneId);

      expect(setDoc).toHaveBeenCalledWith(
        { id: mockUserId },
        expect.objectContaining({ hatao: expect.any(Object) }),
        { merge: true }
      );
    });
  });
});
