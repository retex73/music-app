import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TuneSummaryCard from "../TuneSummaryCard";

describe("TuneSummaryCard", () => {
  const mockTune = {
    name: "The Butterfly",
    type: "Slip Jig",
    aliases: ["An Féileacán"],
    settings: [
      { id: "1", abc: "abc notation 1" },
      { id: "2", abc: "abc notation 2" },
    ],
    url: "https://thesession.org/tunes/1",
  };

  const mockOnToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render tune name", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.getByText("The Butterfly")).toBeInTheDocument();
    });

    it("should render tune type", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.getByText("Slip Jig")).toBeInTheDocument();
    });

    it("should render aliases when present", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.getByText(/also known as:/i)).toBeInTheDocument();
      expect(screen.getByText(/an féileacán/i)).toBeInTheDocument();
    });

    it("should not render aliases section when aliases is empty", () => {
      const tuneWithoutAliases = { ...mockTune, aliases: [] };
      render(
        <TuneSummaryCard
          tune={tuneWithoutAliases}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.queryByText(/also known as:/i)).not.toBeInTheDocument();
    });

    it("should render settings count", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.getByText("2 versions")).toBeInTheDocument();
    });

    it("should render View on TheSession button", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const link = screen.getByRole("link", { name: /view on thesession/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://thesession.org/tunes/1");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Favorite Button", () => {
    it("should render favorite button", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const favoriteButton = screen.getByRole("button");
      expect(favoriteButton).toBeInTheDocument();
    });

    it("should show outline icon when not favorited", () => {
      const { container } = render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const outlineIcon = container.querySelector('[data-testid="FavoriteBorderIcon"]');
      expect(outlineIcon).toBeInTheDocument();
    });

    it("should show filled icon when favorited", () => {
      const { container } = render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={true}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const filledIcon = container.querySelector('[data-testid="FavoriteIcon"]');
      expect(filledIcon).toBeInTheDocument();
    });

    it("should call onToggleFavorite when favorite button is clicked", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const favoriteButton = screen.getByRole("button");
      userEvent.click(favoriteButton);

      expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
    });

    it("should toggle from unfavorited to favorited", () => {
      const { rerender, container } = render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const favoriteButton = screen.getByRole("button");
      userEvent.click(favoriteButton);

      // Rerender with updated favorite state
      rerender(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={true}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const filledIcon = container.querySelector('[data-testid="FavoriteIcon"]');
      expect(filledIcon).toBeInTheDocument();
    });

    it("should toggle from favorited to unfavorited", () => {
      const { rerender, container } = render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={true}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const favoriteButton = screen.getByRole("button");
      userEvent.click(favoriteButton);

      // Rerender with updated favorite state
      rerender(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const outlineIcon = container.querySelector('[data-testid="FavoriteBorderIcon"]');
      expect(outlineIcon).toBeInTheDocument();
    });
  });

  describe("Tune Information Display", () => {
    it("should display tune title as h1", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("The Butterfly");
    });

    it("should display multiple aliases with comma separation", () => {
      const tuneWithMultipleAliases = {
        ...mockTune,
        aliases: ["First Alias", "Second Alias", "Third Alias"],
      };

      render(
        <TuneSummaryCard
          tune={tuneWithMultipleAliases}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(
        screen.getByText("Also known as: First Alias, Second Alias, Third Alias")
      ).toBeInTheDocument();
    });

    it("should display Type label", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.getByText("Type")).toBeInTheDocument();
    });

    it("should display Settings label", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.getByText("Settings")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle tune without type", () => {
      const tuneWithoutType = { ...mockTune, type: null };
      render(
        <TuneSummaryCard
          tune={tuneWithoutType}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.queryByText("Type")).not.toBeInTheDocument();
    });

    it("should handle tune without settings", () => {
      const tuneWithoutSettings = { ...mockTune, settings: null };
      render(
        <TuneSummaryCard
          tune={tuneWithoutSettings}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    });

    it("should handle tune with single setting", () => {
      const tuneWithOneSetting = {
        ...mockTune,
        settings: [{ id: "1", abc: "abc notation" }],
      };
      render(
        <TuneSummaryCard
          tune={tuneWithOneSetting}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.getByText("1 versions")).toBeInTheDocument();
    });

    it("should handle tune with empty aliases array", () => {
      const tuneWithEmptyAliases = { ...mockTune, aliases: [] };
      render(
        <TuneSummaryCard
          tune={tuneWithEmptyAliases}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.queryByText(/also known as:/i)).not.toBeInTheDocument();
    });

    it("should handle tune with undefined aliases", () => {
      const tuneWithUndefinedAliases = { ...mockTune, aliases: undefined };
      render(
        <TuneSummaryCard
          tune={tuneWithUndefinedAliases}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.queryByText(/also known as:/i)).not.toBeInTheDocument();
    });

    it("should handle very long tune name", () => {
      const tuneWithLongName = {
        ...mockTune,
        name: "This is an extremely long tune name that should still render properly without breaking the layout",
      };
      render(
        <TuneSummaryCard
          tune={tuneWithLongName}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(
        screen.getByText(
          "This is an extremely long tune name that should still render properly without breaking the layout"
        )
      ).toBeInTheDocument();
    });

    it("should handle many settings", () => {
      const tuneWithManySettings = {
        ...mockTune,
        settings: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 1}`,
          abc: `abc notation ${i + 1}`,
        })),
      };
      render(
        <TuneSummaryCard
          tune={tuneWithManySettings}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      expect(screen.getByText("10 versions")).toBeInTheDocument();
    });
  });

  describe("Button Interactions", () => {
    it("should have proper button attributes", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const link = screen.getByRole("link", { name: /view on thesession/i });
      expect(link).toHaveAttribute("href");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should handle multiple favorite button clicks", () => {
      render(
        <TuneSummaryCard
          tune={mockTune}
          isFavorite={false}
          onToggleFavorite={mockOnToggleFavorite}
        />
      );

      const favoriteButton = screen.getByRole("button");
      userEvent.click(favoriteButton);
      userEvent.click(favoriteButton);
      userEvent.click(favoriteButton);

      expect(mockOnToggleFavorite).toHaveBeenCalledTimes(3);
    });
  });
});
