import React from 'react'

export default function PopupWithForm({ name, title, children, isOpen, onClose, onSubmit, buttonText, isSaving }) {

  return (
    <div className={isOpen ? `popup popup_active popup_type_${name}`: `popup popup_type_${name}`}>
      <div className='popup__container'>
        <button className='popup__close' type='button' onClick={onClose} />
        <form className='popup__form' id={name} onSubmit={onSubmit} method='POST' name={name}>
          <h3 className='popup__title popup__title_confirm'>{title}</h3>
          {children}
          <button className='popup__submit popup__submit_confirm' type='submit' name='submit'>{isSaving ? 'Saving...' : buttonText}</button>
        </form>
      </div>
    </div>
  )
}
