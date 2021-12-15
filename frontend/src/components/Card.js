import React from 'react'
import CurrentUserContext from '../contexts/CurrentUserContext';

export default function Card({ card, onCardLike, onCardClick, onDeleteClick }) {

  const currentUser = React.useContext(CurrentUserContext);

  const isOwner = currentUser._id === card.ownerId;

  const isLiked = card.likes.some(like => like._id === currentUser._id);
  const likeBtnClass = isLiked ? 'cards__like-button cards__like-button_active' : 'cards__like-button';

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onDeleteClick(card.cardId);
  }
  
  return (
    <li className='cards__item'>
        {isOwner && <button className='cards__close-button' onClick={handleDeleteClick} type='button' />}
        <img className='cards__photo' src={card.link} alt={card.name} onClick={handleClick} />
        <div className='cards__label'>
          <h2 className='cards__name'>{card.name}</h2>
          <div className='cards__like'>
            <button className={likeBtnClass} onClick={handleLikeClick} type='button' />
            <p className='cards__like-count'>{card.likes.length}</p>
          </div>
        </div>
      </li>
  )
}
