import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TheSessionTuneDetailsPage from "../TheSessionTuneDetailsPage";
import { getSessionTuneById } from "../../services/sessionService";
import { tunePreferencesService } from "../../services/tunePreferencesService";

// Mock the services
jest.mock("../../services/sessionService");
jest.mock("../../services/tunePreferencesService");

// Mock the contexts
jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { uid: "test-user-123" },
  }),
}));

jest.mock("../../contexts/FavoritesContext", () => ({
  useFavorites: () => ({
    sessionFavorites: [],
    toggleFavorite: jest.fn(),
  }),
}));

// Create a div that filters out MUI-specific style props
const DivWithProps = ({ children, sx, ...props }) => {
  // Filter out MUI Box props that shouldn't be on DOM elements
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
  Button: ({
    children,
    component: Component = "button",
    startIcon,
    ...props
  }) => {
    const Comp = Component || "button";
    return (
      <Comp {...props}>
        {startIcon}
        {children}
      </Comp>
    );
  },
  Stack: DivWithProps,
  IconButton: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
  List: ({ children, ...props }) => <ul {...props}>{children}</ul>,
  ListItem: ({ children, secondaryAction, ...props }) => (
    <li {...props}>
      {children}
      {secondaryAction}
    </li>
  ),
  ListItemText: ({ primary, secondary, ...props }) => (
    <div {...props}>
      <div>{primary}</div>
      {secondary && <div>{secondary}</div>}
    </div>
  ),
  Menu: ({ children, open, anchorEl, ...props }) =>
    open ? <div {...props}>{children}</div> : null,
  MenuItem: ({ children, onClick, ...props }) => (
    <div onClick={onClick} {...props}>
      {children}
    </div>
  ),
}));

// Mock MUI styles
jest.mock("@mui/material/styles", () => ({
  styled: (Component) => (props) => {
    const { children, component: Component2, ...rest } = props;
    const FinalComponent = Component2 || Component;
    return <FinalComponent {...rest}>{children}</FinalComponent>;
  },
}));

// Mock icons
jest.mock("@mui/icons-material/ArrowBack", () => () => "←");
jest.mock("@mui/icons-material/Favorite", () => () => "♥");
jest.mock("@mui/icons-material/FavoriteBorder", () => () => "♡");

// Mock the TuneSettingsList component since we don't need to test its internals
jest.mock(
  "../../components/TheSessionTuneDetailsPage/TuneSettingsList",
  () => ({
    __esModule: true,
    default: ({ settings, onVersionMenuClick }) => (
      <div data-testid="tune-settings">
        {settings.map((setting, index) => (
          <div key={setting.id}>
            <div>
              Version {index + 1} by {setting.username}
            </div>
            <button onClick={(e) => onVersionMenuClick(e, setting)}>≡</button>
          </div>
        ))}
      </div>
    ),
  })
);

const mockTuneSettings = [
  {
    setting_id: "version1",
    mode: "D major",
    abc: "ABC notation",
    date: "2024-01-01",
    username: "user1",
    name: "Test Tune",
    type: "reel",
    meter: "4/4",
  },
  {
    setting_id: "version2",
    mode: "D major",
    abc: "ABC notation 2",
    date: "2024-01-02",
    username: "user2",
    name: "Test Tune",
    type: "reel",
    meter: "4/4",
  },
];

const renderWithRouter = (ui, { route = "/thesession/tune/123" } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/thesession/tune/:tuneId" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe("TheSessionTuneDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getSessionTuneById.mockResolvedValue(mockTuneSettings);
    tunePreferencesService.getTunePreferences.mockResolvedValue({
      versionOrder: [],
    });
  });

  it("should load and display tune settings", async () => {
    renderWithRouter(<TheSessionTuneDetailsPage />);

    // Wait for the tune settings to load
    await waitFor(() => {
      expect(screen.getByText("Test Tune")).toBeInTheDocument();
    });

    // Check if both versions are displayed
    expect(screen.getByText("Version 1 by user1")).toBeInTheDocument();
    expect(screen.getByText("Version 2 by user2")).toBeInTheDocument();
  });

  it("should apply saved version order from preferences", async () => {
    // Mock preferences with a specific order
    tunePreferencesService.getTunePreferences.mockResolvedValue({
      versionOrder: ["version2", "version1"],
    });

    renderWithRouter(<TheSessionTuneDetailsPage />);

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText("Test Tune")).toBeInTheDocument();
    });

    // Check the order of versions (should be reversed based on preferences)
    const versions = screen.getAllByText(/Version \d by user\d/);
    expect(versions[0]).toHaveTextContent("Version 1 by user2");
    expect(versions[1]).toHaveTextContent("Version 2 by user1");
  });

  it("should show reorder menu when reorder button is clicked", async () => {
    renderWithRouter(<TheSessionTuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Tune")).toBeInTheDocument();
    });

    // Click the reorder button for the first version
    const reorderButtons = screen.getAllByText("≡");
    fireEvent.click(reorderButtons[0]);

    // Verify menu appears with position options
    await waitFor(() => {
      expect(screen.getByText("Move to position 1")).toBeInTheDocument();
      expect(screen.getByText("Move to position 2")).toBeInTheDocument();
    });
  });

  it("should save preferences when moving a version to a new position", async () => {
    renderWithRouter(<TheSessionTuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Tune")).toBeInTheDocument();
    });

    // Click the reorder button for the first version
    const reorderButtons = screen.getAllByText("≡");
    fireEvent.click(reorderButtons[0]);

    // Click "Move to position 2" in the menu
    await waitFor(() => {
      expect(screen.getByText("Move to position 2")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Move to position 2"));

    // Verify that saveTunePreferences was called with the new order
    await waitFor(() => {
      expect(tunePreferencesService.saveTunePreferences).toHaveBeenCalledWith(
        "test-user-123",
        "123",
        ["version2", "version1"]
      );
    });
  });

  it("should handle errors when loading tune settings", async () => {
    getSessionTuneById.mockRejectedValue(new Error("Failed to load"));

    renderWithRouter(<TheSessionTuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("should display tune metadata correctly", async () => {
    renderWithRouter(<TheSessionTuneDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Tune")).toBeInTheDocument();
    });

    // Check that tune metadata is displayed
    expect(screen.getByText("reel")).toBeInTheDocument();
    expect(screen.getByText("4/4")).toBeInTheDocument();
    expect(screen.getByText("D major")).toBeInTheDocument();
  });
});
