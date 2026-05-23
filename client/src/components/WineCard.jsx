export const WineCard = ({ wine, onSelect }) => {
    if (!wine) {
        return null;
    }

    const safeName = wine.name || "Unknown Wine";
    const safeWinery = wine.winery || "Unknown Winery";
    const safeRegion = wine.region || "Region unavailable";
    const safePrice = wine.price || "N/A";
    const safeYear = wine.year ? ` • ${wine.year}` : "";
    const grapes = Array.isArray(wine.grapes) ? wine.grapes : [];

    const handleClick = () => {
        onSelect(wine);
        console.log("wine selected",wine);
    };

  return (
    <article onClick={handleClick} className="ui-card overflow-hidden rounded-3xl text-left transition hover:-translate-y-1 hover:shadow-card-hover">
      <div className="flex h-80 items-center justify-center bg-gradient-to-br from-tint to-accent p-6">
        {wine.image_url ? (
          <img
            src={wine.image_url}
            alt={safeName}
            className="max-h-60 object-contain"
          />
        ) : (
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-label">
            Taste Vault
          </span>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-label">
            {safeRegion}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-text">
            {safeName}
          </h3>
          <p className="mt-1 text-sm text-text-soft">
            {safeWinery}
            {safeYear}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-muted">
          <div className="ui-panel">
            <p className="text-xs uppercase tracking-[0.16em] text-label">Price</p>
            <p className="mt-1 font-semibold text-text">
              {safePrice}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {grapes.slice(0, 3).map((grape) => (
            <span
              key={grape}
              className="ui-chip text-brand"
            >
              {grape}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};
