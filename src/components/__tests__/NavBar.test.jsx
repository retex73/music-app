import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../NavBar";

// Mock AccountMenu component
jest.mock("../AccountMenu", () => {
  return function MockAccountMenu() {
    return <div data-testid="account-menu">Account Menu</div>;
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("NavBar", () => {
  it("renders the logo with correct text", () => {
    renderWithRouter(<NavBar />);
    expect(screen.getByText("IrishWhistleTunes")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    renderWithRouter(<NavBar />);

    expect(screen.getByText("Hatao's Tune a Day")).toBeInTheDocument();
    expect(screen.getByText("The Session")).toBeInTheDocument();
    expect(screen.getByText("Catalogue")).toBeInTheDocument();
  });

  it("logo links to home page", () => {
    renderWithRouter(<NavBar />);

    const logo = screen.getByText("IrishWhistleTunes");
    expect(logo.closest("a")).toHaveAttribute("href", "/");
  });

  it("navigation links have correct routes", () => {
    renderWithRouter(<NavBar />);

    const hataoLink = screen.getByText("Hatao's Tune a Day").closest("a");
    const sessionLink = screen.getByText("The Session").closest("a");
    const catalogueLink = screen.getByText("Catalogue").closest("a");

    expect(hataoLink).toHaveAttribute("href", "/hatao");
    expect(sessionLink).toHaveAttribute("href", "/thesession");
    expect(catalogueLink).toHaveAttribute("href", "/catalogue");
  });

  it("renders AccountMenu component", () => {
    renderWithRouter(<NavBar />);
    expect(screen.getByTestId("account-menu")).toBeInTheDocument();
  });

  it("renders AppBar and Toolbar", () => {
    const { container } = renderWithRouter(<NavBar />);

    const appBar = container.querySelector("header");
    expect(appBar).toBeInTheDocument();

    const toolbar = container.querySelector(".MuiToolbar-root");
    expect(toolbar).toBeInTheDocument();
  });
});
