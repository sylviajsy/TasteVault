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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-wine-overlay/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-wine-border bg-wine-cream text-left shadow-wine-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="sticky top-4 z-20 ml-auto mr-4 mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-wine-burgundy text-lg font-semibold text-wine-ivory transition hover:bg-wine-burgundy-dark"
          onClick={onClose}
        >
          ×
        </button>

        <div className="grid gap-0 md:grid-cols-[minmax(280px,360px)_1fr]">
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 bg-gradient-to-br from-wine-blush to-wine-rose p-6 text-center">
            {wine.imageUrl ? (
              <img
                src={wine.imageUrl}
                alt={safeName}
                className="max-h-[340px] w-auto max-w-full object-contain"
              />
            ) : (
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-wine-label">
                Taste Vault
              </span>
            )}
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <div className="space-y-2 border-b border-wine-divider pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-wine-label">
                  {safeRegion}
                </p>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-label">
                    Tasted On
                  </p>
                  <p className="mt-1 text-sm font-semibold text-wine-burgundy">
                    {safeDate}
                  </p>
                </div>
              </div>
              <h2 className="text-3xl font-semibold text-wine-text">
                {safeName}
              </h2>
              <p className="text-base text-wine-text-soft">
                {safeWinery}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Score</p>
                <p className="mt-1 font-semibold text-wine-text">{scaleOr(userStats.score)}</p>
              </div>
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Price</p>
                <p className="mt-1 font-semibold text-wine-text">{textOr(userStats.price)}</p>
              </div>
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Acidity</p>
                <p className="mt-1 font-semibold text-wine-text">{scaleOr(userStats.acidity)}</p>
              </div>
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Fizziness</p>
                <p className="mt-1 font-semibold text-wine-text">{scaleOr(userStats.fizziness)}</p>
              </div>
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Intensity</p>
                <p className="mt-1 font-semibold text-wine-text">{scaleOr(userStats.intensity)}</p>
              </div>
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Sweetness</p>
                <p className="mt-1 font-semibold text-wine-text">{scaleOr(userStats.sweetness)}</p>
              </div>
              <div className="rounded-2xl bg-wine-panel px-4 py-3 sm:col-span-2 lg:col-span-1">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Tannin</p>
                <p className="mt-1 font-semibold text-wine-text">{scaleOr(userStats.tannin)}</p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-wine-label">
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
                        <span className="rounded-full bg-wine-burgundy px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-wine-ivory">
                          {textOr(flavor?.group)}
                        </span>
                        {notes.length > 0 ? (
                          notes.map((note) => (
                            <span
                              key={`${flavor?.group || "flavor"}-${note}`}
                              className="rounded-full border border-wine-border bg-wine-cream px-3 py-1 text-xs font-medium text-wine-text-soft"
                            >
                              {note}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-wine-text-soft">N/A</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-sm text-wine-text-soft">N/A</span>
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-wine-panel px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-label">
                Tasting Note
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-wine-text-soft">
                {safeComment}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
