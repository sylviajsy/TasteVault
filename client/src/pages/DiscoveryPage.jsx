import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { WineCard } from '../components/WineCard';
import { WineDetailModal } from '../components/WineDetailModal';
import { GlobalSearchBar } from '../components/GlobalSearchBar';

export const DiscoveryPage = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [wines, setWines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedWine, setSelectedWine] = useState(null);
    const [query, setQuery] = useState("");

    const loadWines = async (search = "") => {
        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/api/wines?search=${encodeURIComponent(search)}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch wines');
            }

            setWines(data);
            console.log('Wines', data);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }  finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadWines();
    },[])

    const handleSelectedWine = (wine) => {
        setSelectedWine(wine);
    }

    const handleCloseModal = () => {
        setSelectedWine(null);
    };

    const onSearch = 

  return (
    <div className="px-4 pb-10 md:px-6">
        <h1>Discovery Page</h1>
        {loading && (
          <p className="mb-4 text-[#6f102e]">
            Loading wines...
          </p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {wines.map((wine) => (
              <WineCard 
                  key={wine.wine_id}
                  wine={wine}
                  onSelect={handleSelectedWine}
              />
          ))}
        </div>
        <div>
            {selectedWine && (
                <WineDetailModal 
                    wine={selectedWine}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    </div>
  )
}
