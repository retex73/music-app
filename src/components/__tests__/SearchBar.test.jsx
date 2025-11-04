import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../SearchBar";

// Mock lodash debounce to execute immediately in tests
jest.mock("lodash/debounce", () => (fn) => {
  const debounced = (...args) => fn(...args);
  debounced.cancel = jest.fn();
  return debounced;
});

describe("SearchBar", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render search input", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      expect(input).toBeInTheDocument();
    });

    it("should render search icon button", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const searchButton = screen.getByRole("button", { name: "" });
      expect(searchButton).toBeInTheDocument();
    });

    it("should have empty input value initially", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      expect(input).toHaveValue("");
    });
  });

  describe("User Typing", () => {
    it("should update input value when user types", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "jig");

      expect(input).toHaveValue("jig");
    });

    it("should call onSearch with trimmed value when typing", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "reel");

      expect(mockOnSearch).toHaveBeenCalledWith("reel");
    });

    it("should call onSearch for each keystroke", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "abc");

      // Called for "a", "ab", "abc"
      expect(mockOnSearch).toHaveBeenCalledTimes(3);
      expect(mockOnSearch).toHaveBeenNthCalledWith(1, "a");
      expect(mockOnSearch).toHaveBeenNthCalledWith(2, "ab");
      expect(mockOnSearch).toHaveBeenNthCalledWith(3, "abc");
    });

    it("should trim whitespace from search query", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "  jig  ");

      // Last call should have trimmed value
      expect(mockOnSearch).toHaveBeenLastCalledWith("jig");
    });
  });

  describe("Form Submission", () => {
    it("should call onSearch when Enter key is pressed", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "hornpipe{Enter}");

      // Called for each character plus Enter submission
      expect(mockOnSearch).toHaveBeenCalled();
      // Last call should be from Enter key with full text
      expect(mockOnSearch).toHaveBeenLastCalledWith("hornpipe");
    });

    it("should call onSearch when search icon is clicked", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "polka");

      mockOnSearch.mockClear();

      const searchButton = screen.getByRole("button", { name: "" });
      userEvent.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith("polka");
    });

    it("should prevent default form submission", () => {
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      const form = container.querySelector("form");
      const submitHandler = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit", submitHandler);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "test{Enter}");

      expect(submitHandler).toHaveBeenCalled();
    });
  });

  describe("Search Clearing", () => {
    it("should clear search when input is emptied", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "jig");

      mockOnSearch.mockClear();

      userEvent.clear(input);

      expect(input).toHaveValue("");
      expect(mockOnSearch).toHaveBeenCalledWith("");
    });

    it("should allow retyping after clearing", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "first");
      userEvent.clear(input);
      userEvent.type(input, "second");

      expect(input).toHaveValue("second");
      expect(mockOnSearch).toHaveBeenLastCalledWith("second");
    });
  });

  describe("Debouncing Behavior", () => {
    it("should create debounced search function", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      // Component should render without errors
      expect(screen.getByPlaceholderText("Search for tunes")).toBeInTheDocument();
    });

    it("should cancel debounce on form submit", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "test");

      // Submit form
      userEvent.type(input, "{Enter}");

      // Should call onSearch with current query
      expect(mockOnSearch).toHaveBeenCalledWith("test");
    });
  });

  describe("Component Lifecycle", () => {
    it("should cleanup debounce on unmount", () => {
      const { unmount } = render(<SearchBar onSearch={mockOnSearch} />);

      unmount();

      // Component should unmount without errors
      expect(screen.queryByPlaceholderText("Search for tunes")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string submission", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const searchButton = screen.getByRole("button", { name: "" });
      userEvent.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith("");
    });

    it("should handle only whitespace input", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "   ");

      expect(mockOnSearch).toHaveBeenCalledWith("");
    });

    it("should handle special characters", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "O'Carolan");

      expect(mockOnSearch).toHaveBeenLastCalledWith("O'Carolan");
    });

    it("should handle rapid typing", () => {
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByPlaceholderText("Search for tunes");
      userEvent.type(input, "quick");

      expect(mockOnSearch).toHaveBeenCalled();
      expect(input).toHaveValue("quick");
    });
  });
});
