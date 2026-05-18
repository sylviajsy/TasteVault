import { useEffect } from "react";

export const GlobalSearchBar = ({ value, onChange, onSearch }) => {
    useEffect(() => {
        const cleanedValue = value.replace(/\s+/g, " ").trim();

        const timer = setTimeout(() => {
            onSearch(cleanedValue);
        }, 500);

        return () => clearTimeout(timer);
    }, [value])

  return (
    <div className="mx-auto mb-8 w-full max-w-3xl bg-transparent p-1">
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search wines, winery, region..."
            className="w-full rounded-full border border-wine-border-strong bg-wine-cream px-5 py-3 text-base text-wine-text outline-none transition placeholder:text-wine-placeholder shadow-wine-input focus:border-wine-burgundy-soft focus:ring-4 focus:ring-wine-burgundy-soft/10"
        />
    </div>
  )
}
