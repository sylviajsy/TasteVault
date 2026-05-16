export const WineDetailModal = ({ wine, onClose }) => {
  if (!wine) {
    return null;
  }

  const textOr = (value, fallback = "N/A") =>
    value === null || value === undefined || value === "" ? fallback : value;

  const scaleOr = (value) =>
    value === null || value === undefined || value === "" ? "N/A" : `${value}/10`;

  const grapes = Array.isArray(wine.grapes) ? wine.grapes : [];
  const flavors = Array.isArray(wine.flavors) ? wine.flavors : [];
  const safeName = textOr(wine.name, "Unknown Wine");
  const safeWinery = textOr(wine.winery, "Unknown Winery");
  const safeRegion = textOr(wine.region, "Region unavailable");
  const safePrice = textOr(wine.price);

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
          <div className="flex min-h-[420px] items-center justify-center bg-gradient-to-br from-wine-blush to-wine-rose p-6">
            {wine.image_url ? (
              <img
                src={wine.image_url}
                alt={safeName}
                className="max-h-[380px] w-auto max-w-full object-contain"
              />
            ) : (
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-wine-label">
                Taste Vault
              </span>
            )}
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <div className="space-y-2 border-b border-wine-divider pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-wine-label">
                {safeRegion}
              </p>
              <h2 className="text-3xl font-semibold text-wine-text">
                {safeName}
              </h2>
              <p className="text-base text-wine-text-soft">
                {safeWinery}
              </p>
              <p className="text-lg font-semibold text-wine-burgundy">
                {safePrice}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Region</p>
                <p className="mt-1 font-semibold text-wine-text">{safeRegion}</p>
              </div>
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Vintage</p>
                <p className="mt-1 font-semibold text-wine-text">{textOr(wine.year)}</p>
              </div>
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Acidity</p>
                <p className="mt-1 font-semibold text-wine-text">{scaleOr(wine.acidity)}</p>
              </div>
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Tannin</p>
                <p className="mt-1 font-semibold text-wine-text">{scaleOr(wine.tannin)}</p>
              </div>
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Intensity</p>
                <p className="mt-1 font-semibold text-wine-text">{scaleOr(wine.intensity)}</p>
              </div>
              <div className="rounded-2xl bg-wine-panel px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-wine-label">Sweetness</p>
                <p className="mt-1 font-semibold text-wine-text">{scaleOr(wine.sweetness)}</p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-wine-label">
                Grapes
              </p>
              <div className="flex flex-wrap gap-2">
                {grapes.length > 0 ? (
                  grapes.map((grape) => (
                    <span
                      key={grape}
                      className="rounded-full border border-wine-border bg-wine-chip px-3 py-1 text-xs font-medium text-wine-burgundy"
                    >
                      {grape}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-wine-text-soft">N/A</span>
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-wine-label">
                Flavors
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
              
          </div>
        </div>
      </div>
    </div>
  );
};
