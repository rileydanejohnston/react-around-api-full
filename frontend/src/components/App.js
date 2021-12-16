import { React, useState, useEffect } from 'react'
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import api from '../utils/api';
import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoToolTip from './InfoToolTip';
import * as auth from '../utils/auth';
import ConfirmPopup from './ConfirmPopup';
// import Api from '../utils/api';

function App() {
  const history = useHistory();

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ link: '', name: '' });
  const [currentUser, setCurrentUser] = useState({ name: '', about: '', avatar: '', _id: ''});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);
  const [registerStatus, setRegisterStatus] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [deleteCard, setDeleteCard] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [userToken, setUserToken] = useState('');

  /*
  let authApi = new Api({
    baseUrl: "http://localhost:3000",
    headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json"
      }
  });
  */

  useEffect(() => {
    if (localStorage.getItem('jwt')){
      const jwt = localStorage.getItem('jwt');
      setUserToken(jwt);
      const email = localStorage.getItem('email');
      auth.authorize(jwt)
      .then((res) => {
        setLoggedIn(true);
        setUserEmail(email);
        history.push('/');
      })
      .catch((err) => console.log(err));
    }
  }, []);
  
  useEffect(() => {
    api.getUserInfo()
    .then(({ name, about, avatar, _id }) => {
      setCurrentUser({ name, about, avatar, _id });
    })
    .catch((err) => console.log(err));
  }, []);
 
  useEffect(() => {
    api.getCards()
    .then((res) => {
      const cardData = res.map((item) => {
        return { likes: item.likes, name: item.name, link: item.link, cardId: item._id, ownerId: item.owner._id }
      });
      setCards(cardData);
    })
    .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
        closeToolTip();
      }
    }
    document.addEventListener('keydown', closeByEscape);
    return () => document.removeEventListener('keydown', closeByEscape);
  }, [isToolTipOpen, isEditAvatarPopupOpen, isEditProfilePopupOpen, isAddPlacePopupOpen, isConfirmOpen])

  useEffect(() => {
    const handleOverlayClick = (e) => {
      if (e.target.classList.contains('popup_active')) {
        closeAllPopups();
        closeToolTip();
      }
    }
    document.addEventListener('click', handleOverlayClick);
    return () => document.removeEventListener('click', handleOverlayClick);
  }, [isToolTipOpen, isEditAvatarPopupOpen, isEditProfilePopupOpen, isAddPlacePopupOpen, isConfirmOpen])

  function handleCardLike(card) {
    const isLiked = card.likes.some(like => like._id === currentUser._id);

    api.changeLikeStatus(card.cardId, !isLiked)
    .then((res) => {
      const newCards = cards.map((prevCard) => {
        if (prevCard.cardId === res._id) {
          return { likes: res.likes, name: res.name, link: res.link, cardId: res._id, ownerId: res.owner._id };
        }
        return prevCard;
      });
      setCards(newCards);
    })  
    .catch((err) => console.log(err));
  }

  function handleDeleteCard() {
    api.deleteCard(deleteCard)
    .then((res) => {
      const newCards = cards.filter((prevCard) => { return prevCard.cardId !== deleteCard });
      setCards(newCards);
    })  
    .catch((err) => console.log(err))
    .finally(() => {
      setDeleteCard('');
      closeAllPopups();
    });
    
  }

  function handleConfirmOpen(cardId) {
    setIsSaving(false);
    setDeleteCard(cardId);
    setIsConfirmOpen(true);
  }

  function handleUpdateUser(formInput) {
    api.updateProfile(formInput)
    .then((res) => {
      const updateUser = {...currentUser, name: res.name, about: res.about };
      setCurrentUser(updateUser);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      closeAllPopups();
    });
  }

  function handleUpdateAvatar(formInput) {
    api.updateProfilePic(formInput)
    .then((res) => {
      const updateUser = { ...currentUser, avatar: res.avatar };
      setCurrentUser(updateUser);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      closeAllPopups();
    });
  }

  function handleAddPlaceSubmit(name, url) {
    api.addCard(name, url)
    .then((res) => {
      const newCard = {
        likes: res.likes, 
        name: res.name, 
        link: res.link, 
        cardId: res._id, 
        ownerId: res.owner._id
      };

      setCards([newCard, ...cards]);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      closeAllPopups();
    });
  }

  function handleEditAvatarClick() {
    setIsSaving(false);
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsSaving(false);
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsSaving(false);
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick({ link, name }) {
    setSelectedCard({ link, name });
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({ link: '', name: '' });
    setIsConfirmOpen(false);
  }

  function openToolTip() {
    setIsToolTipOpen(true);
  }

  function closeToolTip() {
    const tempStatus = registerStatus;
    setIsToolTipOpen(false);
    setRegisterStatus(false);

    if (tempStatus){
      history.push('/login');
    }
  }

  function handleRegister(email, password) {
    auth.signup(email, password)
    .then((res) => {
      setRegisterStatus(true);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      openToolTip();
    });
    
  }

  function handleSignin(email, password) {
    auth.signin(email, password)
    .then((res) => {
      if (res.token){
        localStorage.setItem('jwt', res.token);
        localStorage.setItem('email', email);
        setLoggedIn(true);
        setUserToken(res.token);
        setUserEmail(email);
        history.push('/');
      }
    })
    .catch((err) => console.log(err));
  }

  function handleLogout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('email');
    setLoggedIn(false);
    setUserEmail('');
    setUserToken('');
  }

  return (
    <div className='root'>
      <CurrentUserContext.Provider value={currentUser}>
        <Header loggedIn={loggedIn} userEmail={userEmail} logout={handleLogout} />
        <Switch>
          <Route path='/login'>
            <Login onSignIn={handleSignin} />
          </Route>
          <Route path='/register'>
            <Register onRegister={handleRegister} />
          </Route>
          <ProtectedRoute exact path='/' loggedIn={loggedIn}>
            <Main 
              onEditProfileClick={handleEditProfileClick} 
              onAddPlaceClick={handleAddPlaceClick} 
              onEditAvatarClick={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onDeleteClick={handleConfirmOpen}
            />
          </ProtectedRoute>
        </Switch>
        <Footer />
        <ImagePopup 
          card={selectedCard} 
          onClose={closeAllPopups}
        />
        <ConfirmPopup
          isOpen={isConfirmOpen}
          onSubmit={handleDeleteCard}
          onClose={closeAllPopups}
          title='Are you sure?'
          name='confirm'
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAddPlaceSubmit}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
        <InfoToolTip
          isOpen={isToolTipOpen}
          onClose={closeToolTip}
          registerStatus={registerStatus}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;