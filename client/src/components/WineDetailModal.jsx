import React from 'react'

export const WineDetailModal = ({ wine, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={onClose}>X</button>
            <div>
                {wine.image_url ? (
                    <img
                        src={wine.image_url}
                        alt={wine.name}
                    />
                ): (
                <span>
                    Taste Vault
                </span>
                )}
            </div>

            <div>
                <div>
                    <p>{wine.region_display || 'Region unavailable'}</p>
                    <h3>{wine.name}</h3>
                    <p>
                        {wine.winery || 'Unknown winery'}
                        {wine.year ? ` • ${wine.year}` : ''}
                    </p>
                    <p>{wine.price ? `$${wine.price}` : 'N/A'}</p>
                </div>
            </div>

            <div>
                <p>
                    <strong>Region:</strong>{" "}
                    {wine.region_display}
                </p>

                <p>
                    <strong>Vintage:</strong>{" "}
                    {wine.year || "N/A"}
                </p>

                <p>
                    <strong>Acidity:</strong>{" "}
                    {wine.acidity ?? "N/A"}
                </p>

                <p>
                    <strong>Tannin:</strong>{" "}
                    {wine.tannin ?? "N/A"}
                </p>

                <p>
                    <strong>Intensity:</strong>{" "}
                    {wine.intensity ?? "N/A"}
                </p>

                <p>
                    <strong>Sweetness:</strong>{" "}
                    {wine.sweetness ?? "N/A"}
                </p>
            </div>

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
  )
}
