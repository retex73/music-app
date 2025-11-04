// Mock Firebase before importing anything
jest.mock("firebase/firestore", () => {
  const mockDb = {};
  return {
    getFirestore: jest.fn(() => mockDb),
    doc: jest.fn(),
    setDoc: jest.fn(),
    getDoc: jest.fn(),
    arrayUnion: jest.fn(),
    arrayRemove: jest.fn(),
  };
});

jest.mock("../../config/firebase", () => ({
  __esModule: true,
  default: {},
}));

import { favouritesService } from "../favouritesService";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

describe("favouritesService", () => {
  const mockUserId = "user123";
  const mockTuneId = "tune456";
  const mockDb = getFirestore(); // Get reference to the mocked db

  beforeEach(() => {
    jest.clearAllMocks();
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
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("addFavorite", () => {
    it("should add favorite successfully", async () => {
      const mockDocRef = { id: mockUserId };
      doc.mockReturnValue(mockDocRef);
      setDoc.mockResolvedValue(undefined);
      arrayUnion.mockReturnValue(["tune1", mockTuneId]);

      const result = await favouritesService.addFavorite(
        mockUserId,
        mockTuneId,
        "hatao"
      );

      expect(doc).toHaveBeenCalledWith(mockDb, "favorites", mockUserId);
      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          hatao: ["tune1", mockTuneId],
        },
        { merge: true }
      );
      expect(result).toBe(true);
    });

    it("should add session favorite when type is thesession", async () => {
      const mockDocRef = { id: mockUserId };
      doc.mockReturnValue(mockDocRef);
      setDoc.mockResolvedValue(undefined);
      arrayUnion.mockReturnValue([mockTuneId]);

      const result = await favouritesService.addFavorite(
        mockUserId,
        mockTuneId,
        "thesession"
      );

      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          thesession: [mockTuneId],
        },
        { merge: true }
      );
      expect(result).toBe(true);
    });

    it("should default to hatao type if not specified", async () => {
      const mockDocRef = { id: mockUserId };
      doc.mockReturnValue(mockDocRef);
      setDoc.mockResolvedValue(undefined);
      arrayUnion.mockReturnValue([mockTuneId]);

      await favouritesService.addFavorite(mockUserId, mockTuneId);

      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          hatao: [mockTuneId],
        },
        { merge: true }
      );
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
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("removeFavorite", () => {
    it("should remove favorite successfully", async () => {
      const mockDocRef = { id: mockUserId };
      doc.mockReturnValue(mockDocRef);
      setDoc.mockResolvedValue(undefined);
      arrayRemove.mockReturnValue([]);

      const result = await favouritesService.removeFavorite(
        mockUserId,
        mockTuneId,
        "hatao"
      );

      expect(doc).toHaveBeenCalledWith(mockDb, "favorites", mockUserId);
      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          hatao: [],
        },
        { merge: true }
      );
      expect(result).toBe(true);
    });

    it("should remove session favorite when type is thesession", async () => {
      const mockDocRef = { id: mockUserId };
      doc.mockReturnValue(mockDocRef);
      setDoc.mockResolvedValue(undefined);
      arrayRemove.mockReturnValue([]);

      const result = await favouritesService.removeFavorite(
        mockUserId,
        mockTuneId,
        "thesession"
      );

      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          thesession: [],
        },
        { merge: true }
      );
      expect(result).toBe(true);
    });

    it("should default to hatao type if not specified", async () => {
      const mockDocRef = { id: mockUserId };
      doc.mockReturnValue(mockDocRef);
      setDoc.mockResolvedValue(undefined);
      arrayRemove.mockReturnValue([]);

      await favouritesService.removeFavorite(mockUserId, mockTuneId);

      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          hatao: [],
        },
        { merge: true }
      );
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
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
