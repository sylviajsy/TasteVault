export const JournalDetailModal = ({ journal, onClose }) => {
  if (!journal) {
    return null;
  }

  const textOr = (value, fallback = "N/A") =>
    value === null || value === undefined || value === "" ? fallback : value;

  const scaleOr = (value) =>
    value === null || value === undefined || value === "" ? "N/A" : `${value}/10`;

  const wine = journal.wine || {};
  const userStats = journal.userStats || {};
  const flavors = Array.isArray(userStats.userFlavor) ? userStats.userFlavor : [];
  const safeName = textOr(wine.name, "Unknown Wine");
  const safeWinery = textOr(wine.winery, "Unknown Winery");
  const safeRegion = textOr(wine.region, "Region unavailable");
  const safeDate = textOr(journal.date, "Unknown Date");
  const safeComment = textOr(userStats.comment, "No tasting note yet.");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="ui-modal-shell max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close modal"
          className="ui-close-button"
          onClick={onClose}
        >
          ×
        </button>

        <div className="grid gap-0 md:grid-cols-[minmax(280px,360px)_1fr]">
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 bg-gradient-to-br from-tint to-accent p-6 text-center">
            {wine.imageUrl ? (
              <img
                src={wine.imageUrl}
                alt={safeName}
                className="max-h-[340px] w-auto max-w-full object-contain"
              />
            ) : (
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-label">
                Taste Vault
              </span>
            )}
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <div className="space-y-2 border-b border-divider pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-label">
                  {safeRegion}
                </p>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-label">
                    Tasted On
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand">
                    {safeDate}
                  </p>
                </div>
              </div>
              <h2 className="text-3xl font-semibold text-text">
                {safeName}
              </h2>
              <p className="text-base text-text-soft">
                {safeWinery}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Score</p>
                <p className="mt-1 font-semibold text-text">{scaleOr(userStats.score)}</p>
              </div>
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Price</p>
                <p className="mt-1 font-semibold text-text">{textOr(userStats.price)}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Acidity</p>
                <p className="mt-1 font-semibold text-text">{scaleOr(userStats.acidity)}</p>
              </div>
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Fizziness</p>
                <p className="mt-1 font-semibold text-text">{scaleOr(userStats.fizziness)}</p>
              </div>
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Intensity</p>
                <p className="mt-1 font-semibold text-text">{scaleOr(userStats.intensity)}</p>
              </div>
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Sweetness</p>
                <p className="mt-1 font-semibold text-text">{scaleOr(userStats.sweetness)}</p>
              </div>
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Tannin</p>
                <p className="mt-1 font-semibold text-text">{scaleOr(userStats.tannin)}</p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-label">
                Selected Flavors
              </p>
              <div className="space-y-3">
                {flavors.length > 0 ? (
                  flavors.map((flavor, index) => {
                    const notes = Array.isArray(flavor?.notes) ? flavor.notes : [];

                    return (
                      <div
                        key={flavor?.group || `flavor-${index}`}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <span className="ui-tag">
                          {textOr(flavor?.group)}
                        </span>
                        {notes.length > 0 ? (
                          notes.map((note) => (
                            <span
                              key={`${flavor?.group || "flavor"}-${note}`}
                              className="ui-chip"
                            >
                              {note}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-text-soft">N/A</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-sm text-text-soft">N/A</span>
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-panel px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-label">
                Tasting Note
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-text-soft">
                {safeComment}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
