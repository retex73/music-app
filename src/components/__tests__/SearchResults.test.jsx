import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import SearchResults from "../SearchResults";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SearchResults", () => {
  const mockTunes = [
    {
      "Tune No.": "001",
      "Tune Title": "The Blackthorn Stick",
      Genre: "Irish Traditional",
      Rhythm: "Polka",
      Key: "D",
      Mode: "Major",
      "Learning Video": "https://example.com/video1",
    },
    {
      "Tune No.": "002",
      "Tune Title": "The Butterfly",
      Genre: "Irish Traditional",
      Rhythm: "Slip Jig",
      Key: "Em",
      Mode: "Dorian",
      "Learning Video": "https://example.com/video2",
    },
    {
      "Tune No.": "003",
      "Tune Title": "Morrison's Jig",
      Genre: "Irish Traditional",
      Rhythm: "Jig",
      Key: "G",
      Mode: "Major",
      "Learning Video": "https://example.com/video3",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe("Initial State", () => {
    it("should render null when no search has been performed", () => {
      const { container } = renderWithRouter(
        <SearchResults results={[]} hasSearched={false} />
      );

      expect(container.firstChild).toBeNull();
    });

    it("should not display no results message when hasSearched is false", () => {
      renderWithRouter(<SearchResults results={[]} hasSearched={false} />);

      expect(
        screen.queryByText("No tunes found matching your search")
      ).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should show no results message when search returns empty and hasSearched is true", () => {
      renderWithRouter(<SearchResults results={[]} hasSearched={true} />);

      expect(
        screen.getByText("No tunes found matching your search")
      ).toBeInTheDocument();
    });

    it("should show helpful suggestion text in empty state", () => {
      renderWithRouter(<SearchResults results={[]} hasSearched={true} />);

      expect(
        screen.getByText("Try adjusting your search terms or check the spelling")
      ).toBeInTheDocument();
    });
  });

  describe("Results Display", () => {
    it("should render list of tune results", () => {
      renderWithRouter(
        <SearchResults results={mockTunes} hasSearched={true} />
      );

      expect(screen.getByText("The Blackthorn Stick")).toBeInTheDocument();
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
      expect(screen.getByText("Morrison's Jig")).toBeInTheDocument();
    });

    it("should display correct number of results", () => {
      renderWithRouter(
        <SearchResults results={mockTunes} hasSearched={true} />
      );

      expect(screen.getByText("Showing 1-3 of 3 results")).toBeInTheDocument();
    });

    it("should render tune metadata for each result", () => {
      renderWithRouter(
        <SearchResults results={mockTunes} hasSearched={true} />
      );

      // Check for genre chips
      const genreChips = screen.getAllByText("Irish Traditional");
      expect(genreChips).toHaveLength(3);

      // Check for rhythm
      expect(screen.getByText("Polka")).toBeInTheDocument();
      expect(screen.getByText("Slip Jig")).toBeInTheDocument();
      expect(screen.getByText("Jig")).toBeInTheDocument();

      // Check for key/mode (using getAllByText for duplicates)
      const dMajorChips = screen.getAllByText("D Major");
      expect(dMajorChips.length).toBeGreaterThan(0);
      expect(screen.getByText("Em Dorian")).toBeInTheDocument();
      expect(screen.getByText("G Major")).toBeInTheDocument();
    });

    it("should render Watch Tutorial buttons for all results", () => {
      renderWithRouter(
        <SearchResults results={mockTunes} hasSearched={true} />
      );

      const tutorialButtons = screen.getAllByRole("link", {
        name: /watch tutorial/i,
      });
      expect(tutorialButtons).toHaveLength(3);
    });

    it("should have correct video links", () => {
      renderWithRouter(
        <SearchResults results={mockTunes} hasSearched={true} />
      );

      const tutorialButtons = screen.getAllByRole("link", {
        name: /watch tutorial/i,
      });
      expect(tutorialButtons[0]).toHaveAttribute(
        "href",
        "https://example.com/video1"
      );
      expect(tutorialButtons[0]).toHaveAttribute("target", "_blank");
      expect(tutorialButtons[0]).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Navigation", () => {
    it("should navigate to tune details when card is clicked", () => {
      renderWithRouter(
        <SearchResults results={mockTunes} hasSearched={true} />
      );

      const firstCard = screen.getByText("The Blackthorn Stick").closest("div");
      userEvent.click(firstCard);

      expect(mockNavigate).toHaveBeenCalledWith("/tune/001");
    });

    it("should navigate with correct tune ID for each tune", () => {
      renderWithRouter(
        <SearchResults results={mockTunes} hasSearched={true} />
      );

      const secondCard = screen.getByText("The Butterfly").closest("div");
      userEvent.click(secondCard);

      expect(mockNavigate).toHaveBeenCalledWith("/tune/002");
    });

    it("should not navigate when video link is clicked", () => {
      renderWithRouter(
        <SearchResults results={mockTunes} hasSearched={true} />
      );

      const videoLink = screen.getAllByRole("link", {
        name: /watch tutorial/i,
      })[0];
      userEvent.click(videoLink);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Pagination", () => {
    const manyTunes = Array.from({ length: 12 }, (_, i) => ({
      "Tune No.": `${String(i + 1).padStart(3, '0')}`,
      "Tune Title": `Tune ${i + 1}`,
      Genre: "Irish Traditional",
      Rhythm: "Jig",
      Key: "D",
      Mode: "Major",
      "Learning Video": `https://example.com/video${i + 1}`,
    }));

    it("should show pagination when results exceed items per page", () => {
      renderWithRouter(
        <SearchResults results={manyTunes} hasSearched={true} />
      );

      const pagination = screen.getByRole("navigation");
      expect(pagination).toBeInTheDocument();
    });

    it("should not show pagination when results fit on one page", () => {
      renderWithRouter(
        <SearchResults results={mockTunes} hasSearched={true} />
      );

      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });

    it("should display correct page count", () => {
      renderWithRouter(
        <SearchResults results={manyTunes} hasSearched={true} />
      );

      // 12 tunes / 5 per page = 3 pages
      // Check for page 3 button
      const page3Button = screen.getByLabelText("Go to page 3");
      expect(page3Button).toBeInTheDocument();
    });

    it("should show first 5 items on page 1", () => {
      renderWithRouter(
        <SearchResults results={manyTunes} hasSearched={true} />
      );

      expect(screen.getByText("Tune 1")).toBeInTheDocument();
      expect(screen.getByText("Tune 5")).toBeInTheDocument();
      expect(screen.queryByText("Tune 6")).not.toBeInTheDocument();
    });

    it("should show correct results count for first page", () => {
      renderWithRouter(
        <SearchResults results={manyTunes} hasSearched={true} />
      );

      expect(screen.getByText("Showing 1-5 of 12 results")).toBeInTheDocument();
    });

    it("should change page when pagination button is clicked", async () => {
      renderWithRouter(
        <SearchResults results={manyTunes} hasSearched={true} />
      );

      const page2Button = screen.getByLabelText("Go to page 2");
      userEvent.click(page2Button);

      await waitFor(() => {
        expect(screen.getByText("Tune 6")).toBeInTheDocument();
      });

      expect(screen.getByText("Tune 10")).toBeInTheDocument();
      expect(screen.queryByText("Tune 1")).not.toBeInTheDocument();
    });

    it("should update results count on page change", async () => {
      renderWithRouter(
        <SearchResults results={manyTunes} hasSearched={true} />
      );

      const page2Button = screen.getByLabelText("Go to page 2");
      userEvent.click(page2Button);

      await waitFor(() => {
        expect(screen.getByText("Showing 6-10 of 12 results")).toBeInTheDocument();
      });
    });

    it("should scroll to top when page changes", () => {
      renderWithRouter(
        <SearchResults results={manyTunes} hasSearched={true} />
      );

      const page2Button = screen.getByLabelText("Go to page 2");
      userEvent.click(page2Button);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "smooth",
      });
    });

    it("should show correct items on last page", async () => {
      renderWithRouter(
        <SearchResults results={manyTunes} hasSearched={true} />
      );

      const page3Button = screen.getByLabelText("Go to page 3");
      userEvent.click(page3Button);

      await waitFor(() => {
        expect(screen.getByText("Tune 11")).toBeInTheDocument();
      });

      expect(screen.getByText("Tune 12")).toBeInTheDocument();
      expect(screen.getByText("Showing 11-12 of 12 results")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle single result", () => {
      renderWithRouter(
        <SearchResults results={[mockTunes[0]]} hasSearched={true} />
      );

      expect(screen.getByText("The Blackthorn Stick")).toBeInTheDocument();
      expect(screen.getByText("Showing 1-1 of 1 results")).toBeInTheDocument();
    });

    it("should handle tune with missing optional fields gracefully", () => {
      const tuneWithMissingFields = [
        {
          "Tune No.": "999",
          "Tune Title": "Test Tune",
          Genre: "",
          Rhythm: "",
          Key: "",
          Mode: "",
          "Learning Video": "",
        },
      ];

      renderWithRouter(
        <SearchResults results={tuneWithMissingFields} hasSearched={true} />
      );

      expect(screen.getByText("Test Tune")).toBeInTheDocument();
    });

    it("should reset to page 1 when results change", () => {
      const { rerender } = renderWithRouter(
        <SearchResults results={mockTunes} hasSearched={true} />
      );

      // Should show results from page 1
      expect(screen.getByText("Showing 1-3 of 3 results")).toBeInTheDocument();

      // Update with different results
      rerender(
        <BrowserRouter>
          <SearchResults
            results={[mockTunes[0]]}
            hasSearched={true}
          />
        </BrowserRouter>
      );

      expect(screen.getByText("Showing 1-1 of 1 results")).toBeInTheDocument();
    });
  });
});
