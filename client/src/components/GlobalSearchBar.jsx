import { useEffect } from "react";

export const GlobalSearchBar = ({
    value,
    onChange,
    onSearch,
    id = "global-search",
    label = "Search",
}) => {
    useEffect(() => {
        const cleanedValue = value.replace(/\s+/g, " ").trim();

        const timer = setTimeout(() => {
            onSearch(cleanedValue);
        }, 500);

        return () => clearTimeout(timer);
    }, [value])

  return (
    <div className="mx-auto mb-6 w-full max-w-3xl bg-transparent p-1 sm:mb-8">
        <label htmlFor={id} className="sr-only">
            {label}
        </label>
        <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search wines, winery, region..."
            className="w-full rounded-full border border-border-strong bg-surface px-4 py-3 text-sm text-text outline-none transition placeholder:text-placeholder shadow-input focus:border-brand-soft focus:ring-4 focus:ring-brand-soft/10 sm:px-5 sm:text-base"
        />
    </div>
  )
}
