import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the auth context hook
jest.mock("./contexts/AuthContext", () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    currentUser: null,
    loading: false,
  }),
}));

// Mock the favorites context hook
jest.mock("./contexts/FavoritesContext", () => ({
  FavoritesProvider: ({ children }) => <div>{children}</div>,
  useFavorites: () => ({
    sessionFavorites: [],
    toggleFavorite: jest.fn(),
  }),
}));

// Create a div that accepts any prop
const DivWithProps = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

// Mock MUI theme
jest.mock("@mui/material/styles", () => ({
  ThemeProvider: ({ children }) => <div>{children}</div>,
  styled: (Component) => (props) => {
    const { children, component: Component2, ...rest } = props;
    const FinalComponent = Component2 || Component || DivWithProps;
    return <FinalComponent {...rest}>{children}</FinalComponent>;
  },
}));

// Mock CssBaseline
jest.mock("@mui/material/CssBaseline", () => ({
  __esModule: true,
  default: () => null,
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: () => null,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock MUI components
jest.mock("@mui/material", () => ({
  Box: DivWithProps,
  Typography: ({ children, component: Component = "div", ...props }) => {
    const Comp = Component || "div";
    return <Comp {...props}>{children}</Comp>;
  },
  AppBar: DivWithProps,
  Toolbar: DivWithProps,
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
  Grid: DivWithProps,
}));

// Mock Grid2
jest.mock("@mui/material/Grid2", () => ({
  __esModule: true,
  default: DivWithProps,
}));

// Mock AccountMenu component
jest.mock("./components/AccountMenu", () => ({
  __esModule: true,
  default: () => <div>Account Menu</div>,
}));

// Mock HomePage component
jest.mock("./pages/HomePage", () => ({
  __esModule: true,
  default: () => <div>Home Page</div>,
}));

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);

    // Check for the app title
    expect(screen.getByText("IrishWhistleTunes")).toBeInTheDocument();
  });
});
