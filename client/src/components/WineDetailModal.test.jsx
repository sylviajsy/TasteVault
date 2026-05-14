import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { WineDetailModal } from "./WineDetailModal";

const mockWine = {
    id: 101,
    name: "Dark Horse Cabernet",
    winery: "Dark Horse",
    grapes: ["Cabernet Sauvignon", "Merlot"],
    flavors: [
        {
        group: "black_fruit",
        notes: ["blackberry", "plum"],
        },
    ],
    image_url: "https://example.com/wine.png",
    region: "California, United States",
};

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
})