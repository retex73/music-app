import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { tunePreferencesService } from "../tunePreferencesService";

// Mock Firebase
jest.mock("firebase/firestore", () => {
  const mockDb = {};
  return {
    getFirestore: jest.fn(() => mockDb),
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
  };
});

jest.mock("../../config/firebase", () => ({
  __esModule: true,
  default: {},
}));

describe("tunePreferencesService", () => {
  const mockUserId = "test-user-123";
  const mockTuneId = "tune-456";
  const mockVersionOrder = ["version1", "version2", "version3"];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("getTunePreferences", () => {
    it("should return preferences when they exist", async () => {
      const mockData = {
        userId: mockUserId,
        tuneId: mockTuneId,
        versionOrder: mockVersionOrder,
      };

      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => mockData,
      });

      const result = await tunePreferencesService.getTunePreferences(
        mockUserId,
        mockTuneId
      );

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        "tunePreferences",
        `${mockUserId}_${mockTuneId}`
      );
      expect(result).toEqual(mockData);
    });

    it("should return empty preferences when they do not exist", async () => {
      getDoc.mockResolvedValueOnce({
        exists: () => false,
      });

      const result = await tunePreferencesService.getTunePreferences(
        mockUserId,
        mockTuneId
      );

      expect(result).toEqual({ versionOrder: [] });
    });

    it("should handle errors gracefully", async () => {
      // Silence the console.error for this test
      jest.spyOn(console, "error").mockImplementation(() => {});

      getDoc.mockRejectedValueOnce(new Error("Firebase error"));

      const result = await tunePreferencesService.getTunePreferences(
        mockUserId,
        mockTuneId
      );

      expect(result).toEqual({ versionOrder: [] });
    });
  });

  describe("saveTunePreferences", () => {
    it("should save preferences successfully", async () => {
      const mockDocRef = {};
      doc.mockReturnValueOnce(mockDocRef);
      setDoc.mockResolvedValueOnce(undefined);

      const result = await tunePreferencesService.saveTunePreferences(
        mockUserId,
        mockTuneId,
        mockVersionOrder
      );

      expect(doc).toHaveBeenCalledWith(
        expect.anything(),
        "tunePreferences",
        `${mockUserId}_${mockTuneId}`
      );
      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          userId: mockUserId,
          tuneId: mockTuneId,
          versionOrder: mockVersionOrder,
          updatedAt: expect.any(String),
        },
        { merge: true }
      );
      expect(result).toBe(true);
    });

    it("should handle errors gracefully", async () => {
      // Silence the console.error for this test
      jest.spyOn(console, "error").mockImplementation(() => {});

      setDoc.mockRejectedValueOnce(new Error("Firebase error"));

      const result = await tunePreferencesService.saveTunePreferences(
        mockUserId,
        mockTuneId,
        mockVersionOrder
      );

      expect(result).toBe(false);
    });
  });
});
