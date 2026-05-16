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
    <div className="px-4 pb-10 md:px-6">
        <h1>JournalPage</h1>

        {loading && <p className="text-wine-burgundy">Loading journal...</p>}

        {!loading && journal.length === 0 && (
          <p className="text-wine-text-soft">No tasting notes yet. Add your first tasting note!</p>
        )}

        <div className="space-y-6">
        {journal.map((note) => (
          <article
            key={note.noteId}
            className="grid gap-5 rounded-[2rem] bg-transparent p-2 text-left md:grid-cols-[140px_1fr]"
          >
              <div className="px-4 py-5 text-center">
                <p className="mt-2 text-lg font-semibold text-wine-burgundy">
                  {note.date}
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-[2rem] border border-wine-border bg-wine-cream p-5 shadow-wine-card sm:flex-row sm:items-center">
                {note.wine.imageUrl && (
                  <img
                    src={note.wine.imageUrl}
                    alt={note.wine.name}
                    className="h-28 w-20 shrink-0 rounded-2xl object-contain bg-gradient-to-br from-wine-blush to-wine-rose p-2"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-semibold text-wine-text">
                    {note.wine.name}
                  </h2>
                  <p className="mt-1 text-sm text-wine-text-soft">
                    {note.wine.winery || "Unknown winery"}
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-wine-label">
                    Score: {note.userStats.score}
                  </p>
                </div>
              </div>
          </article>
        ))}
        </div>

        <button
          className="fixed bottom-6 right-6 z-40 rounded-full bg-wine-burgundy px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-wine-ivory shadow-wine-card transition hover:bg-wine-burgundy-dark"
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
