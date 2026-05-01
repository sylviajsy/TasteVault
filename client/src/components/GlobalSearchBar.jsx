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
    <div>
        <input 
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Search wines, winery, region..."
        />
    </div>
  )
}
