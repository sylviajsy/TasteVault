import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'react-toastify';
import { WineCard } from '../components/WineCard';
import { WineDetailModal } from '../components/WineDetailModal';
import { GlobalSearchBar } from '../components/GlobalSearchBar';

export const DiscoveryPage = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [wines, setWines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedWine, setSelectedWine] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);  
    const [query, setQuery] = useState("");
    const loaderRef = useRef(null);
    const limit = 24;

    const loadWines = useCallback(
        async (searchTerm = "", pageNumber = 0, replace = false) => {
            // Search input cleanup
            const search = searchTerm.replace(/\s+/g, " ").trim();

            try {
                setLoading(true);

                const offset = pageNumber * limit;

                const res = await fetch(`${API_URL}/api/wines?search=${encodeURIComponent(search)}&limit=${limit}&offset=${offset}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch wines');
                }

                setWines((prev) => (replace ? data : [...prev, ...data]));
                console.log('Wines', data);
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }  finally {
                setLoading(false);
            }
    }, [API_URL, loading])

    useEffect(() => {
        loadWines("", 0, true);
    },[])

    const handleSelectedWine = (wine) => {
        setSelectedWine(wine);
    }

    const handleSearch = (value) => {
        setPage(0);
        setHasMore(true);
        loadWines(value, 0, true);
    };

    const handleCloseModal = () => {
        setSelectedWine(null);
    };

  return (
    <div className="px-4 pb-10 md:px-6">
        <h1>Discovery Page</h1>
        {loading && (
          <p className="mb-4 text-wine-burgundy">
            Loading wines...
          </p>
        )}
        <GlobalSearchBar value={query} onChange={setQuery} onSearch={handleSearch}/>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {wines.map((wine) => (
              <WineCard 
                  key={wine.id}
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
