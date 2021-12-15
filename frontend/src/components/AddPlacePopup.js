import React from 'react'
import PopupWithForm from './PopupWithForm';

export default function AddPlacePopup({ isOpen, onClose, onAddPlaceSubmit, isSaving, setIsSaving }) {

  const [name, setName] = React.useState('');
  const [url, setUrl] = React.useState('');

  React.useEffect(() => {
    setName('');
    setUrl('');
  }, [isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleUrlChange(e) {
    setUrl(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    onAddPlaceSubmit(name, url);
  } 

  return (
    <PopupWithForm
      title='New place'
      name='place'
      buttonText='Create'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSaving={isSaving}
    >
      <input className='popup__name popup__input' onChange={handleNameChange} value={name} id='newPlace-name' type='text' placeholder='Title' name='title' minLength='1' maxLength='30' required />
      <span className='popup__error' id='newPlace-name-error' />
      <input className='popup__about popup__input' onChange={handleUrlChange} value={url} id='newPlace-about' type='url' placeholder='Image link' name='link' required />
      <span className='popup__error' id='newPlace-about-error' />
    </PopupWithForm>
  )
}
