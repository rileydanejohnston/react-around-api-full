import { React, useState, useEffect } from 'react'
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
// import api from '../utils/api';
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
import Api from '../utils/api';

function App() {
  const history = useHistory();
  const { NODE_ENV } = process.env;

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

  let authApi = new Api({
    baseUrl: NODE_ENV === 'production' ? 'https://api.around-the-us.students.nomoreparties.site' : 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
        authorization: `Bearer ${userToken}`
      }
  });

  // get JWT from storage, set userToken
  useEffect(() => {
    if (localStorage.getItem('jwt')){
      // get token/email from storage
      const jwt = localStorage.getItem('jwt');
      const email = localStorage.getItem('email');

      // set state variables
      setUserToken(jwt);
      setLoggedIn(true);
      setUserEmail(email);

      // navigate to main
      history.push('/');
    }
  }, []);

  // get user's info once userToken is set
  // need to be authorized to get user's info
  useEffect(() => {
    authApi.getUserInfo()
        .then(({ data }) => {
          setCurrentUser({ name: data.name, about: data.about, avatar: data.avatar, _id: data._id });
        })
        .catch((err) => console.log(err));
  }, [userToken]);
 
  // get cards once userToken is set
  // need to be authorized to get cards
  useEffect(() => {
    authApi.getCards()
    .then(({ data }) => {
      const cardData = data.map((item) => {
        return { likes: item.likes, name: item.name, link: item.link, cardId: item._id, ownerId: item.owner }
      });
      setCards(cardData);
    })
    .catch((err) => console.log(err));
  }, [userToken]);

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
    // has the user liked the card? True or false
    const isLiked = card.likes.some(like => like === currentUser._id);

    authApi.changeLikeStatus(card.cardId, !isLiked)
    .then(({ data }) => {
      const newCards = cards.map((prevCard) => {
        if (prevCard.cardId === data._id) {
          return { likes: data.likes, name: data.name, link: data.link, cardId: data._id, ownerId: data.owner };
        }
        return prevCard;
      });
      setCards(newCards);
    })  
    .catch((err) => console.log(err));
  }

  function handleDeleteCard() {
    authApi.deleteCard(deleteCard)
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
    authApi.updateProfile(formInput)
    .then(({ data }) => {
      const updateUser = {...currentUser, name: data.name, about: data.about };
      setCurrentUser(updateUser);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      closeAllPopups();
    });
  }

  function handleUpdateAvatar(formInput) {
    authApi.updateProfilePic(formInput)
    .then(({ data }) => {
      const updateUser = { ...currentUser, avatar: data.avatar };
      setCurrentUser(updateUser);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      closeAllPopups();
    });
  }

  function handleAddPlaceSubmit(name, url) {
    authApi.addCard(name, url)
    .then(({ data }) => {
      const newCard = {
        likes: data.likes, 
        name: data.name, 
        link: data.link, 
        cardId: data._id, 
        ownerId: data.owner,
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
        setUserToken(res.token);
        setUserEmail(email);
        setLoggedIn(true);
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