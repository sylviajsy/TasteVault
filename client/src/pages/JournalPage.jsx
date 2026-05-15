import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AddNoteModal } from '../components/AddNoteModal'

export const JournalPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [journal, setJournal] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadNote = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/journal`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

       const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch journal");
      }

      setJournal(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNote();
  }, [])
  return (
    <div>
        <h1>JournalPage</h1>

        {loading && <p>Loading journal...</p>}

        {!loading && journal.length === 0 && (
          <p>No tasting notes yet. Add your first tasting note!</p>
        )}

        {journal.map((note) => (
          <div
            key={note.noteId}>
              {note.wine.imageUrl && (
                <img
                  src={note.wine.imageUrl}
                  alt={note.wine.name}
                />
              )}
              <div>
                <h2>{note.wine.name}</h2>
                <h2>{note.userStats.score}</h2>
              </div>
          </div>
        ))}

        <button
          onClick={() => setIsAddNoteOpen(true)}
        >
          Add Tasting Note
        </button>
        <div>
          {isAddNoteOpen && (
            <AddNoteModal
              onClose={() => setIsAddNoteOpen(false)}
            />
          )}
        </div>
    </div>
  )
}
