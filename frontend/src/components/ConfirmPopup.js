import React from 'react'
import PopupWithForm from './PopupWithForm'

export default function ConfirmPopup({ isOpen, onSubmit, onClose, title, name, isSaving, setIsSaving }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    onSubmit();
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onClose={onClose}
      title={title}
      name={name}
      isSaving={isSaving}
      buttonText='Yes'
    />
  )
}
