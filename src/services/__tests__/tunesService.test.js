import Papa from "papaparse";
import Fuse from "fuse.js";

// Mock Papa and Fuse
jest.mock("papaparse");
jest.mock("fuse.js");

// Mock fetch
global.fetch = jest.fn();

const mockTunesData = [
  {
    "Set No.": "1",
    "Tune No.": "123",
    "Tune Title": "The Butterfly",
    Genre: "Irish Traditional",
    Rhythm: "Slip Jig",
    Key: "Em",
    Mode: "Dorian",
  },
  {
    "Set No.": "1",
    "Tune No.": "124",
    "Tune Title": "The Banshee",
    Genre: "Irish Traditional",
    Rhythm: "Reel",
    Key: "D",
    Mode: "Major",
  },
];

describe("tunesService", () => {
  let initializeTunesData, searchTunes, getTuneById;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Re-import module for each test
    const tunesService = require("../tunesService");
    initializeTunesData = tunesService.initializeTunesData;
    searchTunes = tunesService.searchTunes;
    getTuneById = tunesService.getTuneById;
  });

  describe("initializeTunesData", () => {
    it("should fetch and parse CSV data successfully", async () => {
      const csvText = `Set No.,Tune No.,Tune Title,Genre,Rhythm,Key,Mode
1,123,The Butterfly,Irish Traditional,Slip Jig,Em,Dorian
1,124,The Banshee,Irish Traditional,Reel,D,Major`;

      fetch.mockResolvedValueOnce({
        text: jest.fn().mockResolvedValue(csvText),
      });

      Papa.parse.mockReturnValue({
        data: mockTunesData,
      });

      Fuse.mockImplementation(() => ({
        search: jest.fn(),
      }));

      const result = await initializeTunesData();

      expect(fetch).toHaveBeenCalledWith("/data/tunes_data.csv");
      expect(Papa.parse).toHaveBeenCalled();
      expect(result).toEqual(mockTunesData);
    });

    it("should handle fetch errors gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await initializeTunesData();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("searchTunes", () => {
    it("should return empty array for empty query", () => {
      expect(searchTunes("")).toEqual([]);
      expect(searchTunes(null)).toEqual([]);
    });

    it("should return search results from Fuse", async () => {
      const csvText = `Set No.,Tune No.,Tune Title,Genre,Rhythm,Key,Mode
1,123,The Butterfly,Irish Traditional,Slip Jig,Em,Dorian`;

      fetch.mockResolvedValueOnce({
        text: jest.fn().mockResolvedValue(csvText),
      });

      Papa.parse.mockReturnValue({
        data: mockTunesData,
      });

      const mockSearch = jest.fn(() => [
        { item: mockTunesData[0], score: 0.1 },
      ]);

      Fuse.mockImplementation(() => ({
        search: mockSearch,
      }));

      await initializeTunesData();

      const results = searchTunes("Butterfly");

      expect(mockSearch).toHaveBeenCalledWith("Butterfly");
      expect(results).toEqual([mockTunesData[0]]);
    });

    it("should return empty array if Fuse not initialized", () => {
      const results = searchTunes("test");
      expect(results).toEqual([]);
    });
  });

  describe("getTuneById", () => {
    it("should return tune by ID after initialization", async () => {
      const csvText = `Set No.,Tune No.,Tune Title,Genre,Rhythm,Key,Mode
1,123,The Butterfly,Irish Traditional,Slip Jig,Em,Dorian`;

      fetch.mockResolvedValueOnce({
        text: jest.fn().mockResolvedValue(csvText),
      });

      Papa.parse.mockReturnValue({
        data: mockTunesData,
      });

      Fuse.mockImplementation(() => ({
        search: jest.fn(),
      }));

      await initializeTunesData();
      const result = await getTuneById("123");

      expect(result).toEqual(mockTunesData[0]);
    });

    it("should throw error if tune not found", async () => {
      const csvText = `Set No.,Tune No.,Tune Title,Genre,Rhythm,Key,Mode
1,123,The Butterfly,Irish Traditional,Slip Jig,Em,Dorian`;

      fetch.mockResolvedValueOnce({
        text: jest.fn().mockResolvedValue(csvText),
      });

      Papa.parse.mockReturnValue({
        data: mockTunesData,
      });

      Fuse.mockImplementation(() => ({
        search: jest.fn(),
      }));

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await initializeTunesData();

      await expect(getTuneById("999")).rejects.toThrow(
        "Tune with ID 999 not found"
      );

      consoleErrorSpy.mockRestore();
    });

    it("should auto-initialize data if not loaded", async () => {
      const csvText = `Set No.,Tune No.,Tune Title,Genre,Rhythm,Key,Mode
1,123,The Butterfly,Irish Traditional,Slip Jig,Em,Dorian`;

      fetch.mockResolvedValueOnce({
        text: jest.fn().mockResolvedValue(csvText),
      });

      Papa.parse.mockReturnValue({
        data: mockTunesData,
      });

      Fuse.mockImplementation(() => ({
        search: jest.fn(),
      }));

      const result = await getTuneById("123");

      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual(mockTunesData[0]);
    });
  });
});
