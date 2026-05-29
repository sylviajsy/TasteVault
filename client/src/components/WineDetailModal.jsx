import { TasteRadarChart } from "./TasteRadarChart";

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="ui-modal-shell max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="ui-close-button"
          onClick={onClose}
        >
          ×
        </button>

        <div className="grid gap-0 md:grid-cols-[minmax(280px,360px)_1fr]">
          <div className="flex min-h-[420px] items-center justify-center bg-gradient-to-br from-tint to-accent p-6">
            {wine.image_url ? (
              <img
                src={wine.image_url}
                alt={safeName}
                className="max-h-[380px] w-auto max-w-full object-contain"
              />
            ) : (
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-label">
                Taste Vault
              </span>
            )}
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <div className="space-y-2 border-b border-divider pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-label">
                {safeRegion}
              </p>
              <h2 className="text-3xl font-semibold text-text">
                {safeName}
              </h2>
              <p className="text-base text-text-soft">
                {safeWinery}
              </p>
              <p className="text-lg font-semibold text-brand">
                {safePrice}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Region</p>
                <p className="mt-1 font-semibold text-text">{safeRegion}</p>
              </div>
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Vintage</p>
                <p className="mt-1 font-semibold text-text">{textOr(wine.year)}</p>
              </div>
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Acidity</p>
                <p className="mt-1 font-semibold text-text">{scaleOr(wine.acidity)}</p>
              </div>
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Tannin</p>
                <p className="mt-1 font-semibold text-text">{scaleOr(wine.tannin)}</p>
              </div>
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Intensity</p>
                <p className="mt-1 font-semibold text-text">{scaleOr(wine.intensity)}</p>
              </div>
              <div className="ui-panel">
                <p className="text-xs uppercase tracking-[0.16em] text-label">Sweetness</p>
                <p className="mt-1 font-semibold text-text">{scaleOr(wine.sweetness)}</p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-label">
                Grapes
              </p>
              <div className="flex flex-wrap gap-2">
                {grapes.length > 0 ? (
                  grapes.map((grape) => (
                    <span
                      key={grape}
                      className="ui-chip text-brand"
                    >
                      {grape}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-text-soft">N/A</span>
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-label">
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

            <TasteRadarChart wines={wine} />
              
          </div>
        </div>
      </div>
    </div>
  );
};
