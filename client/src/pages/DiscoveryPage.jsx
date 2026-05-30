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
    const [debouncedQuery, setDebouncedQuery] = useState("");
    // Create a ref to anchor the loaderRef element at the bottom of the list
    const loaderRef = useRef(null);
    const limit = 24;

    const loadWines = useCallback(
        async (searchTerm = "", pageNumber = 0, replace = false) => {
            // Search input cleanup
            const search = searchTerm.replace(/\s+/g, " ").trim();

            if (stateRef.current.loading) return;

            try {
                setLoading(true);

                const offset = pageNumber * limit;

                const res = await fetch(`${API_URL}/api/wines?search=${encodeURIComponent(search)}&limit=${limit}&offset=${offset}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch wines');
                }

                setWines((prev) => (replace ? data : [...prev, ...data]));
                setHasMore(data.length === limit);
                console.log('Wines', data);
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }  finally {
                setLoading(false);
            }
    }, [API_URL])

    // To next page
    useEffect(() => {
        const isReplace = page === 0;
        loadWines(debouncedQuery, page, isReplace);
    },[page, debouncedQuery, loadWines])

    // New search query, page = 0
    useEffect(() => {
        setPage(0);
        setHasMore(true);
    }, [debouncedQuery]);

    const stateRef = useRef({ page, debouncedQuery, hasMore, loading });
    useEffect(() => {
        stateRef.current = { page, debouncedQuery, hasMore, loading };
    }, [page, debouncedQuery, hasMore, loading]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            // entries[0] represents the loaderRef element we are tracking
            const firstEntry = entries[0];
            const { hasMore: currentHasMore, loading: currentLoading, page: currentGlobalPage } = stateRef.current;

            if (firstEntry.isIntersecting && currentHasMore && !currentLoading) {
                // Increment page to trigger the fetch useEffect
                setPage(currentGlobalPage + 1);
            }
        }, {
            threshold: 0.1, // Trigger the callback when 10% of the sentinel is visible
        })

        const currentLoader = loaderRef.current;

        // Start observing the loaderRef element at the bottom
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        // Cleanup: disconnect the observer on unmount to prevent memory leaks
        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        }
    }, [])

    const handleSelectedWine = (wine) => {
        setSelectedWine(wine);
    }

    const handleSearch = (value) => {
        setDebouncedQuery(value);
    };

    const handleCloseModal = () => {
        setSelectedWine(null);
    };

  return (
    <div className="px-3 pb-10 sm:px-4 md:px-6">
        <h1>Discovery Page</h1>
        {loading && (
          <p className="mb-4 text-brand">
            Loading wines...
          </p>
        )}
        <GlobalSearchBar
          id="discovery-search"
          label="Search wines"
          onSearch={handleSearch}
        />
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
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

        {/* IntersectionObserver */}
        <div ref={loaderRef} className="h-10" />

        {loading && (
            <p className="mt-4 text-center text-brand">
                Loading more wines...
            </p>
        )}

        {!hasMore && (
            <p className="mt-4 text-center text-text-soft">
                No more wines.
            </p>
        )}
    </div>
  )
}
