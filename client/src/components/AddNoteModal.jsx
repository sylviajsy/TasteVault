import { useState } from "react";
import { toast } from "react-toastify";
import { GlobalSearchBar } from "./GlobalSearchBar";


export const AddNoteModal = ({ onClose }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(false);
    const [winesResults, setWinesResults] = useState([]);
    const [selectedWine, setSelectedWine] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [formData, setFormData] = useState({
        wine_id: null,
        price: "",
        comment: "",
        user_acidity: 5,
        user_fizziness: 0,
        user_intensity: 5,
        user_sweetness: 5,
        user_tannin: 5,
        user_flavor: [],
    })

    const handleWineSearchChange = (value) => {
        setSearchInput(value);

        if (selectedWine && value !== selectedWine.name) {
            setSelectedWine(null);

            setFormData((prev) => ({
                ...prev,
                wine_id: null,
            }));
        }
    };

    const handleWineSearch = async (searchTerm) => {
        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/api/wines?search=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch wines');
            }

            setWinesResults(data);
            console.log('Wine Journal Search', data);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectWine = (wine) => {
        setSelectedWine(wine);
        setSearchInput(wine.name);

        setFormData((prev) => ({
            ...prev,
            wine_id: wine.wine_id,
        }));

        setWinesResults([]);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.wine_id) {
            toast.error("Please select a wine first.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/api/notes`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to save note");
            }

            toast.success("Tasting note saved!");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div onClick={onClose}>
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <div>
                <h2>Add Tasting Note</h2>
            </div>
            <button
                onClick={onClose}
            >
                ✕
            </button>
            <div>
                <label>Wine:</label>
                
                <GlobalSearchBar 
                    value={searchInput}
                    onChange={handleWineSearchChange}
                    onSearch={handleWineSearch} 
                />
                    {loading && (
                        <p>Searching wines...</p>
                    )}

                    {winesResults.length > 1 && (
                        <div>
                            {winesResults.map((wine)=>{
                                return (
                                    <button
                                        key={wine.wine_id}
                                        type="button"
                                        onClick={() => handleSelectWine(wine)}
                                    >
                                        {wine.image_url && (
                                            <img
                                                src={wine.image_url}
                                                alt={wine.name}
                                            />
                                        )}
                                        {wine.name}
                                        {wine.winery}
                                    </button>
                                )
                            })}
                        </div>
                    )}
            </div>
            <label>
                <span>Price</span>
                <input 
                    name = "price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="19.99"
                    required
                />
            </label>
        </form>
    </div>
  )
}
