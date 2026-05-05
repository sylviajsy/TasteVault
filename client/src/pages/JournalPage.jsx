import { useState } from "react";
import { AddNoteModal } from '../components/AddNoteModal'

export const JournalPage = () => {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  return (
    <div>
        <h1>JournalPage</h1>
        <p>View and add Joirnal here.</p>
        <button
          onClick={() => setIsAddNoteOpen(true)}
        >
          Add Tasting Note
        </button>
        {isAddNoteOpen && (
          <AddNoteModal
            onClose={() => setIsAddNoteOpen(false)}
          />
        )}
    </div>
  )
}
