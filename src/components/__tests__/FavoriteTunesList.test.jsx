import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FavoriteTunesList from "../FavoriteTunesList";
import { useFavorites } from "../../contexts/FavoritesContext";
import { getTuneById } from "../../services/tunesService";

// Mock dependencies
jest.mock("../../contexts/FavoritesContext");
jest.mock("../../services/tunesService");

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("FavoriteTunesList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when there are no favorites", () => {
    beforeEach(() => {
      useFavorites.mockReturnValue({
        hataoFavorites: [],
      });
    });

    it("displays no favorites message", () => {
      renderWithRouter(<FavoriteTunesList />);

      expect(screen.getByText("No favorite tunes yet.")).toBeInTheDocument();
    });

    it("does not render the favorites list", () => {
      renderWithRouter(<FavoriteTunesList />);

      expect(screen.queryByText("Favorite Tunes")).not.toBeInTheDocument();
    });
  });

  describe("when there are favorites", () => {
    const mockTunes = [
      {
        "Tune No.": "001",
        "Tune Title": "The Kesh Jig",
        Genre: "Jig",
        Rhythm: "6/8",
        Key: "G",
        Mode: "Major",
      },
      {
        "Tune No.": "002",
        "Tune Title": "The Butterfly",
        Genre: "Slip Jig",
        Rhythm: "9/8",
        Key: "Em",
        Mode: "Dorian",
      },
    ];

    beforeEach(() => {
      useFavorites.mockReturnValue({
        hataoFavorites: ["001", "002"],
      });

      getTuneById.mockImplementation((id) => {
        return Promise.resolve(mockTunes.find((tune) => tune["Tune No."] === id));
      });
    });

    it("displays the Favorite Tunes heading", async () => {
      renderWithRouter(<FavoriteTunesList />);

      await waitFor(() => {
        expect(screen.getByText("Favorite Tunes")).toBeInTheDocument();
      });
    });

    it("fetches and displays all favorite tunes", async () => {
      renderWithRouter(<FavoriteTunesList />);

      await waitFor(() => {
        expect(screen.getByText("The Kesh Jig")).toBeInTheDocument();
        expect(screen.getByText("The Butterfly")).toBeInTheDocument();
      });
    });

    it("displays tune details correctly", async () => {
      renderWithRouter(<FavoriteTunesList />);

      await waitFor(() => {
        expect(screen.getByText("Genre: Jig, Rhythm: 6/8")).toBeInTheDocument();
        expect(screen.getByText("Genre: Slip Jig, Rhythm: 9/8")).toBeInTheDocument();
      });
    });

    it("creates correct links to tune detail pages", async () => {
      renderWithRouter(<FavoriteTunesList />);

      await waitFor(() => {
        const keshLink = screen.getByText("The Kesh Jig").closest("a");
        const butterflyLink = screen.getByText("The Butterfly").closest("a");

        expect(keshLink).toHaveAttribute("href", "/tune/001");
        expect(butterflyLink).toHaveAttribute("href", "/tune/002");
      });
    });

    it("calls getTuneById for each favorite", async () => {
      renderWithRouter(<FavoriteTunesList />);

      await waitFor(() => {
        expect(getTuneById).toHaveBeenCalledWith("001");
        expect(getTuneById).toHaveBeenCalledWith("002");
        expect(getTuneById).toHaveBeenCalledTimes(2);
      });
    });

    it("renders tunes in a list structure", async () => {
      const { container } = renderWithRouter(<FavoriteTunesList />);

      await waitFor(() => {
        const list = container.querySelector("ul");
        expect(list).toBeInTheDocument();

        const listItems = container.querySelectorAll("li");
        expect(listItems).toHaveLength(2);
      });
    });
  });

  describe("when favorites list changes", () => {
    it("updates displayed tunes when favorites change", async () => {
      const mockTune1 = {
        "Tune No.": "001",
        "Tune Title": "The Kesh Jig",
        Genre: "Jig",
        Rhythm: "6/8",
      };

      const mockTune2 = {
        "Tune No.": "002",
        "Tune Title": "The Butterfly",
        Genre: "Slip Jig",
        Rhythm: "9/8",
      };

      getTuneById.mockImplementation((id) => {
        if (id === "001") return Promise.resolve(mockTune1);
        if (id === "002") return Promise.resolve(mockTune2);
      });

      // Start with one favorite
      useFavorites.mockReturnValue({
        hataoFavorites: ["001"],
      });

      const { rerender } = renderWithRouter(<FavoriteTunesList />);

      await waitFor(() => {
        expect(screen.getByText("The Kesh Jig")).toBeInTheDocument();
      });

      // Update to two favorites
      useFavorites.mockReturnValue({
        hataoFavorites: ["001", "002"],
      });

      rerender(
        <BrowserRouter>
          <FavoriteTunesList />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("The Kesh Jig")).toBeInTheDocument();
        expect(screen.getByText("The Butterfly")).toBeInTheDocument();
      });
    });
  });
});
