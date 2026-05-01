import { useState,useEffect } from "react";

export const GlobalSearchBar = ({ onSearch }) => {
    const [input, setInput] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(input);
        }, 500);

        return () => clearTimeout(timer);
    }, [input])

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);
        onSearch(value);
    };

  return (
    <div className="mx-auto mb-8 w-full max-w-3xl bg-transparent p-1">
        <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Search wines, winery, region..."
            className="w-full rounded-full border border-[#cfae9d] bg-[#fff8ef] px-5 py-3 text-base text-[#5b1228] outline-none transition placeholder:text-[#9b7567] shadow-[0_12px_28px_rgba(96,17,40,0.08)] focus:border-[#7a1733] focus:ring-4 focus:ring-[#7a1733]/10"
        />
    </div>
  )
}
