import React from 'react'

export default function ImagePopup({ card, onClose }) {
  return (
    <div className={card.link === '' ? 'popup' : 'popup popup_active' }>
      <div className='popup__image-wrap'>
        <button className='popup__close popup__close_type_image' type='button' onClick={onClose} />
        <img className='popup__image' src={card.link} alt={card.name} />
        <p className='popup__caption'>{card.name}</p>
      </div>
    </div>
  )
}
