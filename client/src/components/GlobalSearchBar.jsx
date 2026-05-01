import { useState } from "react";

export const GlobalSearchBar = ({ onSearch }) => {
    const [input, setInput] = useState("");

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
