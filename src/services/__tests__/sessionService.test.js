import Papa from "papaparse";

// Mock Papa
jest.mock("papaparse");

// Mock fetch
global.fetch = jest.fn();

const mockSessionData = [
  {
    tune_id: "1",
    setting_id: "s1",
    name: "The Butterfly",
    type: "slip jig",
    meter: "9/8",
    mode: "Em",
    abc: "ABC notation here",
    date: "2024-01-01",
    username: "user1",
  },
  {
    tune_id: "1",
    setting_id: "s2",
    name: "The Butterfly",
    type: "slip jig",
    meter: "9/8",
    mode: "D",
    abc: "ABC notation variant",
    date: "2024-01-02",
    username: "user2",
  },
  {
    tune_id: "2",
    setting_id: "s3",
    name: "The Banshee",
    type: "reel",
    meter: "4/4",
    mode: "D",
    abc: "ABC notation reel",
    date: "2024-01-03",
    username: "user3",
  },
];

describe("sessionService", () => {
  let initializeSessionData,
    searchSessionTunes,
    getSessionTuneById,
    getRandomTunes;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Re-import module for each test
    const sessionService = require("../sessionService");
    initializeSessionData = sessionService.initializeSessionData;
    searchSessionTunes = sessionService.searchSessionTunes;
    getSessionTuneById = sessionService.getSessionTuneById;
    getRandomTunes = sessionService.getRandomTunes;
  });

  describe("initializeSessionData", () => {
    it("should fetch and parse CSV data successfully", async () => {
      const csvText = `tune_id,setting_id,name,type,meter,mode,abc,date,username
1,s1,The Butterfly,slip jig,9/8,Em,ABC notation here,2024-01-01,user1`;

      fetch.mockResolvedValueOnce({
        text: jest.fn().mockResolvedValue(csvText),
      });

      Papa.parse.mockReturnValue({
        data: mockSessionData,
      });

      const result = await initializeSessionData();

      expect(fetch).toHaveBeenCalledWith("/data/session_tunes_data.csv");
      expect(Papa.parse).toHaveBeenCalled();
      expect(result).toEqual(mockSessionData);
    });

    it("should handle fetch errors gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await initializeSessionData();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("searchSessionTunes", () => {
    beforeEach(() => {
      fetch.mockResolvedValue({
        text: jest.fn().mockResolvedValue("mock csv"),
      });
      Papa.parse.mockReturnValue({
        data: mockSessionData,
      });
    });

    it("should return empty array for empty query", async () => {
      const result = await searchSessionTunes("");
      expect(result).toEqual([]);
    });

    it("should search tunes by name (case insensitive)", async () => {
      const result = await searchSessionTunes("butterfly");

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("The Butterfly");
    });

    it("should return unique tunes (first setting only)", async () => {
      const result = await searchSessionTunes("butterfly");

      // Should return only one result even though there are 2 settings
      expect(result).toHaveLength(1);
      expect(result[0].setting_id).toBe("s1"); // First setting
    });

    it("should auto-initialize data if not loaded", async () => {
      await searchSessionTunes("test");

      expect(fetch).toHaveBeenCalled();
    });
  });

  describe("getSessionTuneById", () => {
    beforeEach(() => {
      fetch.mockResolvedValue({
        text: jest.fn().mockResolvedValue("mock csv"),
      });
      Papa.parse.mockReturnValue({
        data: mockSessionData,
      });
    });

    it("should return all settings for a tune ID", async () => {
      const result = await getSessionTuneById("1");

      expect(result).toHaveLength(2);
      expect(result[0].tune_id).toBe("1");
      expect(result[1].tune_id).toBe("1");
    });

    it("should throw error if tune not found", async () => {
      await expect(getSessionTuneById("999")).rejects.toThrow(
        "Tune with ID 999 not found"
      );
    });

    it("should auto-initialize data if not loaded", async () => {
      await getSessionTuneById("1");

      expect(fetch).toHaveBeenCalled();
    });
  });

  describe("getRandomTunes", () => {
    beforeEach(() => {
      fetch.mockResolvedValue({
        text: jest.fn().mockResolvedValue("mock csv"),
      });
      Papa.parse.mockReturnValue({
        data: mockSessionData,
      });
      // Mock Math.random for consistent test results
      jest.spyOn(Math, "random").mockReturnValue(0.5);
    });

    afterEach(() => {
      Math.random.mockRestore();
    });

    it("should return unique tunes (first setting only)", async () => {
      const result = await getRandomTunes(3);

      // Should have 2 unique tunes (tune_id 1 and 2)
      expect(result.length).toBeLessThanOrEqual(2);

      // Check that tunes are unique by tune_id
      const tuneIds = result.map((t) => t.tune_id);
      const uniqueIds = [...new Set(tuneIds)];
      expect(tuneIds).toEqual(uniqueIds);
    });

    it("should return requested number of tunes", async () => {
      const result = await getRandomTunes(1);

      expect(result).toHaveLength(1);
    });

    it("should default to 3 tunes if count not specified", async () => {
      const result = await getRandomTunes();

      // We only have 2 unique tunes, so should return max 2
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it("should auto-initialize data if not loaded", async () => {
      await getRandomTunes(3);

      expect(fetch).toHaveBeenCalled();
    });
  });
});
