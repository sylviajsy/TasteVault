export const WineDetailModal = ({ wine, onClose }) => {
  const imageSrc = wine.image_url?.startsWith('//')
    ? `https:${wine.image_url}`
    : wine.image_url;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3d0b1a]/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-[#dcc4ba] bg-[#fff8ef] text-left shadow-[0_30px_80px_rgba(61,11,26,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#6f102e] text-lg font-semibold text-[#fff9f2] transition hover:bg-[#581024]"
          onClick={onClose}
        >
          ×
        </button>

        <div className="grid gap-0 md:grid-cols-[minmax(280px,360px)_1fr]">
          <div className="flex min-h-[420px] items-center justify-center bg-gradient-to-br from-[#f8e6da] to-[#f2d4ca] p-6">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={wine.name}
                className="max-h-[380px] w-auto max-w-full object-contain"
              />
            ) : (
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8f5a4c]">
                Taste Vault
              </span>
            )}
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <div className="space-y-2 border-b border-[#ead7ce] pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f5a4c]">
                {wine.region_display || 'Region unavailable'}
              </p>
              <h2 className="text-3xl font-semibold text-[#5b1228]">
                {wine.name}
              </h2>
              <p className="text-base text-[#7a4c43]">
                {wine.winery || 'Unknown winery'}
                {wine.year ? ` • ${wine.year}` : ''}
              </p>
              <p className="text-lg font-semibold text-[#6f102e]">
                {wine.price ? `$${wine.price}` : 'N/A'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f7ede3] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8f5a4c]">Region</p>
                <p className="mt-1 font-semibold text-[#5b1228]">{wine.region_display || 'N/A'}</p>
              </div>
              <div className="rounded-2xl bg-[#f7ede3] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8f5a4c]">Vintage</p>
                <p className="mt-1 font-semibold text-[#5b1228]">{wine.year || 'N/A'}</p>
              </div>
              <div className="rounded-2xl bg-[#f7ede3] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8f5a4c]">Acidity</p>
                <p className="mt-1 font-semibold text-[#5b1228]">{wine.acidity ?? 'N/A'}</p>
              </div>
              <div className="rounded-2xl bg-[#f7ede3] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8f5a4c]">Tannin</p>
                <p className="mt-1 font-semibold text-[#5b1228]">{wine.tannin ?? 'N/A'}</p>
              </div>
              <div className="rounded-2xl bg-[#f7ede3] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8f5a4c]">Intensity</p>
                <p className="mt-1 font-semibold text-[#5b1228]">{wine.intensity ?? 'N/A'}</p>
              </div>
              <div className="rounded-2xl bg-[#f7ede3] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8f5a4c]">Sweetness</p>
                <p className="mt-1 font-semibold text-[#5b1228]">{wine.sweetness ?? 'N/A'}</p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8f5a4c]">
                Grapes
              </p>
              <div className="flex flex-wrap gap-2">
                {(wine.grapes || []).map((grape) => (
                  <span
                    key={grape}
                    className="rounded-full border border-[#d8b7aa] bg-[#fff3e8] px-3 py-1 text-xs font-medium text-[#6f102e]"
                  >
                    {grape}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
