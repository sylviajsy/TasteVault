import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AddNoteModal } from '../components/AddNoteModal';
import { GlobalSearchBar } from "../components/GlobalSearchBar";
import { JournalCard } from "../components/JournalCard";
import { JournalDetailModal } from "../components/JournalDetailModal";

export const JournalPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [journal, setJournal] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const loadNote = async (searchTerm="") => {
    const search = searchTerm.replace(/\s+/g, " ").trim();
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/journal?search=${encodeURIComponent(search)}`, {
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

  const handleSelectedJournal = (note) => {
    setSelectedJournal(note);
  }

  const handleCloseModal = () => {
    setSelectedJournal(null);
  }

  return (
    <div className="px-4 pb-10 md:px-6">
        <h1>JournalPage</h1>

        {loading && <p className="text-wine-burgundy">Loading journal...</p>}

        {!loading && journal.length === 0 && (
          <p className="text-wine-text-soft">No tasting notes yet. Add your first tasting note!</p>
        )}

        <GlobalSearchBar value={query} onChange={setQuery} onSearch={loadNote}/>

        <div className="space-y-6">
          {journal.map((note) => (
            <JournalCard
              key={note.noteId}
              note={note}
              onSelect={handleSelectedJournal}
            />
          ))}
        </div>

        <div>
          {selectedJournal && (
            <JournalDetailModal journal={selectedJournal} onClose={handleCloseModal}/>
          ) }
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
