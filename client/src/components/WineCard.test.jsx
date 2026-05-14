import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { WineCard } from "./WineCard";

const mockWine = {
    id: 101,
    name: "Dark Horse Cabernet",
    winery: "Dark Horse",
    grapes: ["Cabernet Sauvignon", "Merlot"],
    image_url: "https://test.com/wine.png",
};

describe('Wine Card', () => {
    test('Renders wine info', () => {
        render(<WineCard wine={mockWine} onSelect={vi.fn()} />);

        expect(screen.getByText("Dark Horse Cabernet")).toBeInTheDocument();
        expect(screen.getByAltText("Dark Horse Cabernet")).toHaveAttribute(
            "src",
            "https://test.com/wine.png"
        );
        expect(screen.getByText("Cabernet Sauvignon")).toBeInTheDocument();
    })

    test('Calls onClick when clicked',async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();

        render(<WineCard wine={mockWine} onSelect={onSelect} />);

        await user.click(screen.getByText("Dark Horse Cabernet"));

        expect(onSelect).toHaveBeenCalledWith(mockWine);
    })
})