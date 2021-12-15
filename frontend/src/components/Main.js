import React from 'react';
import Card from './Card';
import CurrentUserContext from '../contexts/CurrentUserContext';

export default function Main({ onEditProfileClick, onAddPlaceClick, onEditAvatarClick, onCardClick, onCardLike, onDeleteClick, cards }) 
{
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className='main'>
      <section className='profile'>
        <div className='profile__avatar' onClick={onEditAvatarClick} style={{ backgroundImage: `url(${currentUser.avatar})` }}>
          <button className='profile__avatar-btn' type='button' />
        </div>
        <div className='profile__info-container'>
          <div className='profile__info'>
            <div className='profile__name-button'>
              <h1 className='profile__name'>{currentUser.name}</h1>
              <button className='profile__edit-button' type='button' onClick={onEditProfileClick} />
            </div>
            <p className='profile__about'>{currentUser.about}</p>
          </div>
          <button className='profile__add-button' type='button' onClick={onAddPlaceClick} />
        </div>
      </section>
      <section className='locations'>
        <ul className='cards'>
          {cards.map((item) => {
              return (
              <Card key={`${item.cardId}`} card={item} onCardLike={onCardLike} onCardClick={onCardClick} onDeleteClick={onDeleteClick} />
            )
          })}
        </ul>
      </section>
    </main>
  )
}
