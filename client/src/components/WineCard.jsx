import React from 'react'

export const WineCard = ({ wine }) => {
  return (
    <div>
        <img 
            src={wine.image_url}
        />
        <h3>
            {wine.name}
        </h3>
        <h3>
            {wine.winery}
        </h3>
    </div>
  )
}
