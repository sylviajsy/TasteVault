import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { GlobalSearchBar } from "./GlobalSearchBar";

describe('Global Search Bar', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    test('calls onChange when typing', async () => {
        const onChange = vi.fn();

       render(
            <GlobalSearchBar
                value=""
                onChange={onChange}
                onSearch={vi.fn()}
            />
        );

        fireEvent.change(screen.getByPlaceholderText(/search wines/i), {
            target: { value: "Cab" },
        });

        expect(onChange).toHaveBeenCalledWith("Cab");
    })
})