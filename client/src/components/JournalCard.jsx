export const JournalCard = ({ note, onSelect }) => {
  if (!note) {
    return null;
  }

  const handleClick = () => {
        onSelect(note);
        console.log("journal selected",note);
    };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View tasting note for ${note.wine?.name || "wine"}`}
      data-testid="journal-card"
      className="grid gap-5 rounded-[2rem] bg-transparent p-2 text-left md:grid-cols-[140px_1fr] focus:outline-none focus:ring-4 focus:ring-brand-soft/20"
    >
      <div className="px-4 py-5 text-center">
        <p className="mt-2 text-lg font-semibold text-brand">
          {note.date}
        </p>
      </div>

      <div className="ui-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        {note.wine?.imageUrl && (
          <img
            src={note.wine.imageUrl}
            alt={note.wine.name}
            className="h-28 w-20 shrink-0 rounded-2xl object-contain bg-gradient-to-br from-tint to-accent p-2"
          />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold text-text">
            {note.wine?.name || "Unknown wine"}
          </h2>
          <p className="mt-1 text-sm text-text-soft">
            {note.wine?.winery || "Unknown winery"}
          </p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-label">
            Score: {note.userStats?.score ?? "N/A"}
          </p>
        </div>
      </div>
    </article>
  );
};
