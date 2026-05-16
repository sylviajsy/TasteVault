import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { WineDetailModal } from "./WineDetailModal";
import { mockWine } from "../../../test-data/wines.js";

describe('Wine Detail Modal', () => {
    test("Renders wine details", () => {
        render(<WineDetailModal wine={mockWine} onClose={vi.fn()} />);

        expect(screen.getByText("Dark Horse Cabernet")).toBeInTheDocument();
        expect(screen.getByText("plum")).toBeInTheDocument();
        expect(screen.getByAltText(/dark horse cabernet/i)).toHaveAttribute(
            "src",
            "https://example.com/wine.png"
        );
        expect(screen.getAllByText(/california/i)[0]).toBeInTheDocument();
    })

    test("renders mock flavors from test data", () => {
        render(<WineDetailModal wine={mockWine} onClose={vi.fn()} />);

        expect(screen.getByText(/black_fruit/i)).toBeInTheDocument();
        expect(screen.getByText("blackberry")).toBeInTheDocument();
        expect(screen.getByText("plum")).toBeInTheDocument();
    });

    test("returns nothing when wine is missing", () => {
        const { container } = render(<WineDetailModal wine={null} onClose={vi.fn()} />);

        expect(container.firstChild).toBeNull();
    });

    test("renders fallback values for incomplete wine data", () => {
        const partialWine = {
            image_url: "",
            grapes: null,
            flavors: null,
        };

        render(<WineDetailModal wine={partialWine} onClose={vi.fn()} />);

        expect(screen.getByText("Unknown Wine")).toBeInTheDocument();
        expect(screen.getByText("Unknown Winery")).toBeInTheDocument();
        expect(screen.getAllByText("Region unavailable")).toHaveLength(2);
        expect(screen.getAllByText("N/A").length).toBeGreaterThan(0);
        expect(screen.getByText("Taste Vault")).toBeInTheDocument();
    });
})
