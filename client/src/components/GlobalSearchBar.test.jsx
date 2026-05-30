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
        const onSearch = vi.fn();

        render(
            <GlobalSearchBar
                value="Cabernet"
                onChange={vi.fn()}
                onSearch={onSearch}
            />
        );

        vi.advanceTimersByTime(499);

        expect(onSearch).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        
        expect(onSearch).toHaveBeenCalledWith("Cabernet");
        expect(onSearch).toHaveBeenCalledTimes(1);
    });

    test("calls onSearch with trimmed input after debounce", () => {
        const onSearch = vi.fn();

        render(
            <GlobalSearchBar
                value="   Cabernet   Sauvignon   "
                onChange={vi.fn()}
                onSearch={onSearch}
            />
        );

        vi.advanceTimersByTime(500);

        expect(onSearch).toHaveBeenCalledWith("Cabernet Sauvignon");
    });

    test("calls onSearch with empty string when input is only whitespace", () => {
        const onSearch = vi.fn();

        render(
            <GlobalSearchBar
                value="   "
                onChange={vi.fn()}
                onSearch={onSearch}
            />
        );

        vi.advanceTimersByTime(500);

        expect(onSearch).toHaveBeenCalledWith("");
    });
})
