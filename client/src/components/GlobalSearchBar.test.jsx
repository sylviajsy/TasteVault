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

    test('calls onChange when typing', () => {
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

    test("calls onSearch after debounce", () => {
        vi.useFakeTimers();

        const onSearch = vi.fn();

        render(
            <GlobalSearchBar
                value="Cabernet"
                onChange={vi.fn()}
                onSearch={onSearch}
            />
        );

        vi.advanceTimersByTime(500);
        
        // assert callback
        expect(onSearch).toHaveBeenCalledWith("Cabernet");
    });

    test("does not call onSearch for empty input", () => {
        vi.useFakeTimers();

        const onSearch = vi.fn();

        render(
            <GlobalSearchBar
            value="   "
            onChange={vi.fn()}
            onSearch={onSearch}
            />
        );

        vi.advanceTimersByTime(500);

        expect(onSearch).not.toHaveBeenCalled();

        vi.useRealTimers();
    });
})