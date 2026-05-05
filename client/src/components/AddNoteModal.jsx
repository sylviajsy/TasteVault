import { useState } from "react";
import { toast } from "react-toastify";
import { GlobalSearchBar } from "./GlobalSearchBar";


export const AddNoteModal = ({ onClose }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(false);
    const [WinesResults, setWinesResults] = useState([]);

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

  return (
    <div onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()}>
            <GlobalSearchBar onSearch={handleWineSearch} />
            {loading && (
                <p>Searching wines...</p>
            )}
        </div>
    </div>
  )
}
