export const WineCard = ({ wine }) => {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#dcc4ba] bg-[#fff8ef] text-left shadow-[0_16px_36px_rgba(96,17,40,0.10)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(96,17,40,0.16)]">
      <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#f8e6da] to-[#f2d4ca]">
        {wine.image_url ? (
          <img
            src={wine.image_url}
            alt={wine.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8f5a4c]">
            Taste Vault
          </span>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f5a4c]">
            {wine.region_display || 'Region unavailable'}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-[#5b1228]">
            {wine.name}
          </h3>
          <p className="mt-1 text-sm text-[#7a4c43]">
            {wine.winery || 'Unknown winery'}
            {wine.year ? ` • ${wine.year}` : ''}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-[#6b4b4b]">
          <div className="rounded-2xl bg-[#f7ede3] px-3 py-2">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8f5a4c]">Price</p>
            <p className="mt-1 font-semibold text-[#5b1228]">
              {wine.price ? `$${wine.price}` : 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(wine.grapes || []).slice(0, 3).map((grape) => (
            <span
              key={grape}
              className="rounded-full border border-[#d8b7aa] bg-[#fff3e8] px-3 py-1 text-xs font-medium text-[#6f102e]"
            >
              {grape}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};
