export const JournalCard = ({ note, onSelect }) => {
  if (!note) {
    return null;
  }

  const handleClick = () => {
        onSelect(note);
        console.log("journal selected",note);
    };

  return (
    <article onClick={handleClick} data-testid="journal-card" className="grid gap-5 rounded-[2rem] bg-transparent p-2 text-left md:grid-cols-[140px_1fr]">
      <div className="px-4 py-5 text-center">
        <p className="mt-2 text-lg font-semibold text-wine-burgundy">
          {note.date}
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-wine-border bg-wine-cream p-5 shadow-wine-card sm:flex-row sm:items-center">
        {note.wine?.imageUrl && (
          <img
            src={note.wine.imageUrl}
            alt={note.wine.name}
            className="h-28 w-20 shrink-0 rounded-2xl object-contain bg-gradient-to-br from-wine-blush to-wine-rose p-2"
          />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold text-wine-text">
            {note.wine?.name || "Unknown wine"}
          </h2>
          <p className="mt-1 text-sm text-wine-text-soft">
            {note.wine?.winery || "Unknown winery"}
          </p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-wine-label">
            Score: {note.userStats?.score ?? "N/A"}
          </p>
        </div>
      </div>
    </article>
  );
};
