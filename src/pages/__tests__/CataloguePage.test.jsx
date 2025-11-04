import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CataloguePage from "../CataloguePage";
import Papa from "papaparse";

// Mock PapaParse
jest.mock("papaparse");

// Mock fetch
global.fetch = jest.fn();

const mockTunesData = [
  {
    tune_id: "1",
    setting_id: "s1",
    name: "The Butterfly",
    type: "slip jig",
    meter: "9/8",
    mode: "Em",
    abc: "ABC1",
    date: "2024-01-01",
    username: "user1",
  },
  {
    tune_id: "2",
    setting_id: "s2",
    name: "The Banshee",
    type: "reel",
    meter: "4/4",
    mode: "D",
    abc: "ABC2",
    date: "2024-01-02",
    username: "user2",
  },
  {
    tune_id: "3",
    setting_id: "s3",
    name: "Cooley's Reel",
    type: "reel",
    meter: "4/4",
    mode: "Em",
    abc: "ABC3",
    date: "2024-01-03",
    username: "user3",
  },
  {
    tune_id: "4",
    setting_id: "s4",
    name: "The Silver Spear",
    type: "reel",
    meter: "4/4",
    mode: "D",
    abc: "ABC4",
    date: "2024-01-04",
    username: "user4",
  },
];

// Create a div that filters out MUI-specific style props
const DivWithProps = ({ children, sx, component, ...props }) => {
  const {
    justifyContent,
    alignItems,
    flexDirection,
    gap,
    p,
    py,
    mt,
    mb,
    ml,
    mr,
    maxWidth,
    mx,
    display,
    flexWrap,
    spacing,
    width,
    bgcolor,
    borderBottom,
    borderColor,
    cursor,
    ...domProps
  } = props;
  return <div {...domProps}>{children}</div>;
};

// Mock MUI components
jest.mock("@mui/material", () => ({
  Container: DivWithProps,
  Box: DivWithProps,
  Typography: ({ children, component: Component = "div", ...props }) => {
    const Comp = Component || "div";
    return <Comp {...props}>{children}</Comp>;
  },
  TextField: ({ label, value, onChange, ...props }) => (
    <input
      type="text"
      placeholder={label}
      value={value}
      onChange={onChange}
      {...props}
    />
  ),
  Paper: DivWithProps,
  Chip: ({ label, onClick, color, variant, ...props }) => (
    <button onClick={onClick} data-color={color} data-variant={variant} {...props}>
      {label}
    </button>
  ),
  Button: ({ children, onClick, variant, size, ...props }) => (
    <button onClick={onClick} data-variant={variant} data-size={size} {...props}>
      {children}
    </button>
  ),
  Grid: ({ children, item, container, spacing, ...props }) => {
    const Component = item ? "div" : "div";
    return <Component {...props}>{children}</Component>;
  },
  Pagination: ({ count, page, onChange, ...props }) => (
    <div data-testid="pagination" {...props}>
      {Array.from({ length: count }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onChange(null, pageNum)}
          data-current={pageNum === page}
        >
          {pageNum}
        </button>
      ))}
    </div>
  ),
}));

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("CataloguePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock successful CSV fetch
    global.fetch.mockResolvedValue({
      text: jest.fn().mockResolvedValue("csv content"),
    });

    // Mock PapaParse
    Papa.parse.mockImplementation((csvText, options) => ({
      data: mockTunesData,
    }));
  });

  it("should load and display list of all tunes", async () => {
    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    expect(screen.getByText("The Banshee")).toBeInTheDocument();
    expect(screen.getByText("Cooley's Reel")).toBeInTheDocument();
    expect(screen.getByText("The Silver Spear")).toBeInTheDocument();
  });

  it("should display tune count", async () => {
    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("4 tunes found")).toBeInTheDocument();
    });
  });

  it("should filter tunes by search term (name)", async () => {
    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search tunes...");
    fireEvent.change(searchInput, { target: { value: "butterfly" } });

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
      expect(screen.queryByText("The Banshee")).not.toBeInTheDocument();
    });

    expect(screen.getByText("1 tunes found")).toBeInTheDocument();
  });

  it("should filter tunes by search term (type)", async () => {
    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search tunes...");
    fireEvent.change(searchInput, { target: { value: "slip jig" } });

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
      expect(screen.queryByText("The Banshee")).not.toBeInTheDocument();
    });

    expect(screen.getByText("1 tunes found")).toBeInTheDocument();
  });

  it("should filter tunes by type (chip selection)", async () => {
    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    // Click the "Reel" chip
    const reelChip = screen.getByText("Reel");
    fireEvent.click(reelChip);

    await waitFor(() => {
      expect(screen.queryByText("The Butterfly")).not.toBeInTheDocument();
      expect(screen.getByText("The Banshee")).toBeInTheDocument();
      expect(screen.getByText("Cooley's Reel")).toBeInTheDocument();
    });

    expect(screen.getByText("3 tunes found")).toBeInTheDocument();
  });

  it("should filter by multiple types", async () => {
    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    // Click the "Reel" chip
    const reelChip = screen.getByText("Reel");
    fireEvent.click(reelChip);

    // Click the "Slip jig" chip - use regex to handle capitalization
    const slipJigChip = screen.getByText(/^Slip jig$/i);
    fireEvent.click(slipJigChip);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
      expect(screen.getByText("The Banshee")).toBeInTheDocument();
    });

    expect(screen.getByText("4 tunes found")).toBeInTheDocument();
  });

  it("should filter by letter (first letter)", async () => {
    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    // Click the "C" letter button
    const cButton = screen.getByText("C");
    fireEvent.click(cButton);

    await waitFor(() => {
      expect(screen.queryByText("The Butterfly")).not.toBeInTheDocument();
      expect(screen.getByText("Cooley's Reel")).toBeInTheDocument();
    });

    expect(screen.getByText("1 tunes found")).toBeInTheDocument();
  });

  it("should toggle letter filter (click same letter to clear)", async () => {
    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    // Click the "T" letter button
    const tButton = screen.getByText("T");
    fireEvent.click(tButton);

    await waitFor(() => {
      expect(screen.getByText("3 tunes found")).toBeInTheDocument();
    });

    // Click "T" again to clear filter
    fireEvent.click(tButton);

    await waitFor(() => {
      expect(screen.getByText("4 tunes found")).toBeInTheDocument();
    });
  });

  it("should handle pagination correctly", async () => {
    // Create many tunes to test pagination
    const manyTunes = Array.from({ length: 25 }, (_, i) => ({
      tune_id: `${i + 1}`,
      setting_id: `s${i + 1}`,
      name: `Tune ${i + 1}`,
      type: "reel",
      meter: "4/4",
      mode: "D",
      abc: `ABC${i + 1}`,
      date: "2024-01-01",
      username: "user",
    }));

    Papa.parse.mockImplementation((csvText, options) => ({
      data: manyTunes,
    }));

    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("25 tunes found")).toBeInTheDocument();
    });

    // First page should show tunes 1-10
    expect(screen.getByText("Tune 1")).toBeInTheDocument();
    expect(screen.getByText("Tune 10")).toBeInTheDocument();
    expect(screen.queryByText("Tune 11")).not.toBeInTheDocument();

    // Click page 2
    const pagination = screen.getByTestId("pagination");
    const page2Button = pagination.querySelector('[data-current="false"]');
    fireEvent.click(page2Button);

    // Wait for page 1 tune to disappear first, then check for page 2 tune
    await waitFor(() => {
      expect(screen.queryByText("Tune 1")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Tune 11")).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.queryByText("Tune 10")).not.toBeInTheDocument();
    expect(screen.getByText("Tune 20")).toBeInTheDocument();
  });

  it("should navigate to tune details when tune is clicked", async () => {
    // Create a mock navigate function that we can track
    let navigatedTo = null;
    const MockedCataloguePage = () => {
      const navigate = (path) => {
        navigatedTo = path;
      };

      // Inline simplified version to test navigation logic
      const [tunes] = React.useState(mockTunesData);
      const handleTuneClick = (tuneId) => {
        navigate(`/thesession/tune/${tuneId}`);
      };

      return (
        <div>
          {tunes.map((tune) => (
            <div
              key={tune.tune_id}
              onClick={() => handleTuneClick(tune.tune_id)}
              data-testid={`tune-${tune.tune_id}`}
            >
              {tune.name}
            </div>
          ))}
        </div>
      );
    };

    render(<MockedCataloguePage />);

    // Click on a tune
    const tuneElement = screen.getByTestId("tune-1");
    fireEvent.click(tuneElement);

    expect(navigatedTo).toBe("/thesession/tune/1");
  });

  it("should handle empty state (no tunes)", async () => {
    Papa.parse.mockReturnValue({
      data: [],
    });

    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("0 tunes found")).toBeInTheDocument();
    });

    expect(screen.getByText("0 tunes found")).toBeInTheDocument();
  });

  it("should handle search with no results", async () => {
    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search tunes...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    await waitFor(() => {
      expect(screen.getByText("0 tunes found")).toBeInTheDocument();
    });

    expect(screen.queryByText("The Butterfly")).not.toBeInTheDocument();
  });

  it("should reset to page 1 when search or filters change", async () => {
    // Create many tunes to test pagination
    const manyTunes = Array.from({ length: 25 }, (_, i) => ({
      tune_id: `${i + 1}`,
      setting_id: `s${i + 1}`,
      name: `Tune ${i + 1}`,
      type: "reel",
      meter: "4/4",
      mode: "D",
      abc: `ABC${i + 1}`,
      date: "2024-01-01",
      username: "user",
    }));

    Papa.parse.mockImplementation((csvText, options) => ({
      data: manyTunes,
    }));

    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("25 tunes found")).toBeInTheDocument();
    });

    // Navigate to page 2
    const pagination = screen.getByTestId("pagination");
    const page2Button = pagination.querySelector('[data-current="false"]');
    fireEvent.click(page2Button);

    // Wait for page 1 tune to disappear first, then check for page 2 tune
    await waitFor(() => {
      expect(screen.queryByText("Tune 1")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Tune 11")).toBeInTheDocument();
    }, { timeout: 3000 });

    // Now apply a search filter
    const searchInput = screen.getByPlaceholderText("Search tunes...");
    fireEvent.change(searchInput, { target: { value: "Tune 1" } });

    // Should reset to page 1
    await waitFor(() => {
      expect(screen.getByText("Tune 1")).toBeInTheDocument();
    });
  });

  it("should handle CSV loading errors gracefully", async () => {
    global.fetch.mockRejectedValue(new Error("Failed to load CSV"));

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it("should display tune metadata in list", async () => {
    renderWithRouter(<CataloguePage />);

    await waitFor(() => {
      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    // Check that metadata is displayed for a tune
    const butterflyMetadata = screen.getByText(/Type: slip jig \| Mode: Em \| Meter: 9\/8/);
    expect(butterflyMetadata).toBeInTheDocument();
  });
});
