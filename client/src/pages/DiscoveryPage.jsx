import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { WineCard } from '../components/WineCard';

export const DiscoveryPage = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [wines, setWines] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadWines = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/api/wines`);
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

  return (
    <div>
        <h1>Discovery Page</h1>
        {loading && (
          <p className="mb-4 text-[#6f102e]">
            Loading wines...
          </p>
        )}
        {wines.map((wine) => (
            <WineCard 
                key={wine.wine_id}
                wine={wine}
            />
        ))}
    </div>
  )
}

