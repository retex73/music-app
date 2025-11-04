import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TuneDetailsPage from "../TuneDetailsPage";
import { getTuneById } from "../../services/tunesService";

// Mock services
jest.mock("../../services/tunesService");

// Mock react-youtube
jest.mock("react-youtube", () => ({
  __esModule: true,
  default: ({ videoId }) => <div data-testid="youtube-player">{videoId}</div>,
}));

// Mock contexts
const mockToggleFavorite = jest.fn();
const mockUseFavorites = jest.fn(() => ({
  hataoFavorites: [],
  toggleFavorite: mockToggleFavorite,
}));

jest.mock("../../contexts/FavoritesContext", () => ({
  useFavorites: () => mockUseFavorites(),
}));

// Create a div that filters out MUI-specific style props
const DivWithProps = ({ children, sx, ...props }) => {
  const {
    justifyContent,
    alignItems,
    flexDirection,
    gap,
    p,
    mt,
    mb,
    ml,
    mr,
    maxWidth,
    mx,
    py,
    ...domProps
  } = props;
  return <div {...domProps}>{children}</div>;
};

// Mock MUI components
jest.mock("@mui/material", () => ({
  Box: DivWithProps,
  Typography: ({ children, component: Component = "div", ...props }) => {
    const Comp = Component || "div";
    return <Comp {...props}>{children}</Comp>;
  },
  Card: DivWithProps,
  CardContent: DivWithProps,
  Chip: ({ label, ...props }) => <div {...props}>{label}</div>,
  Button: ({ children, startIcon, href, ...props }) => {
    const Component = href ? "a" : "button";
    return (
      <Component href={href} {...props}>
        {startIcon}
        {children}
      </Component>
    );
  },
  Stack: DivWithProps,
  IconButton: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock icons
jest.mock("@mui/icons-material/PlayCircleOutline", () => () => "▶");
jest.mock("@mui/icons-material/ArrowBack", () => () => "←");
jest.mock("@mui/icons-material/Favorite", () => () => "♥");
jest.mock("@mui/icons-material/FavoriteBorder", () => () => "♡");

const mockTuneData = {
  "Set No.": "1",
  "Tune No.": "123",
  "Tune Title": "The Butterfly",
  Genre: "Irish Traditional",
  Rhythm: "Slip Jig",
  Key: "Em",
  Mode: "Dorian",
  Part: "2",
  Added: "2024-01-15",
  "Learning Video": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};

const renderWithRouter = (
  ui,
  { route = "/tune/123", initialEntries = ["/tune/123"] } = {}
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/tune/:tuneId" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe("TuneDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFavorites.mockReturnValue({
      hataoFavorites: [],
      toggleFavorite: mockToggleFavorite,
    });
  });

  it("should display loading state initially", () => {
    getTuneById.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockTuneData), 100))
    );

    renderWithRouter(<TuneDetailsPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should load and display tune details by ID from route params", async () => {
    getTuneById.mockResolvedValue(mockTuneData);

    renderWithRouter(<TuneDetailsPage />);

    await waitFor(() => {
      expect(getTuneById).toHaveBeenCalledWith("123");
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    // Check all tune details are displayed
    expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    expect(screen.getByText("Set 1")).toBeInTheDocument();
    expect(screen.getByText("Tune 123")).toBeInTheDocument();
    expect(screen.getByText("Irish Traditional")).toBeInTheDocument();
    expect(screen.getByText("Rhythm: Slip Jig")).toBeInTheDocument();
    expect(screen.getByText("Key: Em")).toBeInTheDocument();
    expect(screen.getByText("Mode: Dorian")).toBeInTheDocument();
    expect(screen.getByText("Parts: 2")).toBeInTheDocument();
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  });

  it("should display YouTube video player with correct video ID", async () => {
    getTuneById.mockResolvedValue(mockTuneData);

    renderWithRouter(<TuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("youtube-player")).toBeInTheDocument();
    });

    expect(screen.getByTestId("youtube-player")).toHaveTextContent(
      "dQw4w9WgXcQ"
    );
  });

  it("should show unfavorited icon when tune is not in favorites", async () => {
    getTuneById.mockResolvedValue(mockTuneData);

    renderWithRouter(<TuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    const favoriteButton = screen.getByLabelText("toggle favorite");
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton.textContent).toBe("♡");
  });

  it("should show favorited icon when tune is in favorites", async () => {
    getTuneById.mockResolvedValue(mockTuneData);
    mockUseFavorites.mockReturnValue({
      hataoFavorites: ["123"],
      toggleFavorite: mockToggleFavorite,
    });

    renderWithRouter(<TuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    const favoriteButton = screen.getByLabelText("toggle favorite");
    expect(favoriteButton.textContent).toBe("♥");
  });

  it("should toggle favorite when favorite button is clicked", async () => {
    getTuneById.mockResolvedValue(mockTuneData);

    renderWithRouter(<TuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    const favoriteButton = screen.getByLabelText("toggle favorite");
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith("123", "hatao");
  });

  it("should have back button that navigates to home", async () => {
    getTuneById.mockResolvedValue(mockTuneData);

    renderWithRouter(<TuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    const backButton = screen.getByLabelText("back to search");
    expect(backButton).toBeInTheDocument();
    expect(backButton.textContent).toContain("Back to Search");
  });

  it("should handle tune not found (invalid ID)", async () => {
    getTuneById.mockRejectedValue(new Error("Tune with ID 999 not found"));

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithRouter(<TuneDetailsPage />, {
      route: "/tune/999",
      initialEntries: ["/tune/999"],
    });

    // Should remain in loading state when error occurs
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("should have YouTube link with correct attributes", async () => {
    getTuneById.mockResolvedValue(mockTuneData);

    renderWithRouter(<TuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    // Query by role for link
    const links = screen.getAllByRole("link");
    const youtubeLink = links.find(
      (link) => link.textContent.includes("Watch on YouTube")
    );

    expect(youtubeLink).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
    expect(youtubeLink).toHaveAttribute("target", "_blank");
    expect(youtubeLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should handle tune with missing video gracefully", async () => {
    const tuneWithoutVideo = {
      ...mockTuneData,
      "Learning Video": "",
    };
    getTuneById.mockResolvedValue(tuneWithoutVideo);

    renderWithRouter(<TuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    // YouTube player should not be rendered
    expect(screen.queryByTestId("youtube-player")).not.toBeInTheDocument();
    // But other details should still be present
    expect(screen.getByText("The Butterfly")).toBeInTheDocument();
  });

  it("should display all tune metadata chips", async () => {
    getTuneById.mockResolvedValue(mockTuneData);

    renderWithRouter(<TuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    // Check metadata chips
    expect(screen.getByText("Set 1")).toBeInTheDocument();
    expect(screen.getByText("Tune 123")).toBeInTheDocument();
    expect(screen.getByText("Irish Traditional")).toBeInTheDocument();
    expect(screen.getByText("Rhythm: Slip Jig")).toBeInTheDocument();
    expect(screen.getByText("Key: Em")).toBeInTheDocument();
    expect(screen.getByText("Mode: Dorian")).toBeInTheDocument();
    expect(screen.getByText("Parts: 2")).toBeInTheDocument();
  });
});
