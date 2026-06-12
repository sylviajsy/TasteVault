import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth0 } from '@auth0/auth0-react';
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
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const isFetchingRef = useRef(false);

  const loadNote = useCallback(async (searchTerm="") => {
    if (!isAuthenticated) return;

    if (isFetchingRef.current) {
      return;
    }

    const search = searchTerm.replace(/\s+/g, " ").trim();
    try {
      isFetchingRef.current = true;
      setLoading(true);

      const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: audience,
        }
      });
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
      isFetchingRef.current = false;
    }
  }, [API_URL, audience, getAccessTokenSilently, isAuthenticated])

  useEffect(() => {
    loadNote();
  }, [loadNote])

  const handleSelectedJournal = (note) => {
    setSelectedJournal(note);
  }

  const handleCloseModal = () => {
    setSelectedJournal(null);
  }

  return (
    <div className="px-3 pb-24 sm:px-4 sm:pb-10 md:px-6">
        <h1>JournalPage</h1>

        {loading && <p className="text-brand">Loading journal...</p>}

        {!loading && journal.length === 0 && (
          <p className="text-text-soft">No tasting notes yet. Add your first tasting note!</p>
        )}

        <GlobalSearchBar
          id="journal-search"
          label="Search tasting notes"
          onSearch={loadNote}
        />

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
          className="fixed bottom-6 right-6 z-40 rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-contrast shadow-card transition hover:bg-brand-strong"
          onClick={() => setIsAddNoteOpen(true)}
        >
          Add Tasting Note
        </button>
        <div>
          {isAddNoteOpen && (
            <AddNoteModal
              onClose={() => setIsAddNoteOpen(false)}
              onNoteAdded={loadNote}
            />
          )}
        </div>
    </div>
  )
}
