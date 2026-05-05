import { useState } from "react";
import { toast } from "react-toastify";
import { GlobalSearchBar } from "./GlobalSearchBar";


export const AddNoteModal = ({ onClose }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(false);
    const [WinesResults, setWinesResults] = useState([]);
    const [selectedWine, setSelectedWine] = useState([]);

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
        setWinesResults([]);
    }

  return (
    <div onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()}>
            <div>
                <h2>Add Tasting Note</h2>
            </div>
            <button
                onClick={onClose}
            >
                ✕
            </button>
            {selectedWine && (
                <h2>Wine: {selectedWine.name}</h2>
            )}
            <GlobalSearchBar onSearch={handleWineSearch} />
                {loading && (
                    <p>Searching wines...</p>
                )}

                {WinesResults.length > 0 && (
                    <div>
                        {WinesResults.map((wine)=>{
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
    </div>
  )
}
