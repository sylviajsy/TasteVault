import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

export const DiscoveryPage = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [wines, setWines] = useState([]);

    const loadWines = async () => {
        try {
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
        }  
    }

    useEffect(() => {
        loadWines();
    },[])

  return (
    <div>
        <h1>Discovery Page</h1>
        {wines.map((wine) => (
            <div key={wine.wine_id}>
            <h3>{wine.name}</h3>
            <p>{wine.winery}</p>
            <p>{wine.region_display}</p>
            </div>
        ))}
    </div>
  )
}

