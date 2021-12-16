import React from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom';

export default function Header({ loggedIn, userEmail, logout }) {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className={loggedIn ? 'header header_logged-in' : 'header'}>
      <div className='header__menu-wrapper'>
        <div className='logo'/>
        {loggedIn && <button className={menuOpen ? `header__button header__button_close` : `header__button header__button_menu`} onClick={() => setMenuOpen(!menuOpen)}/>}
      </div>
      {
        (location.pathname === '/login') && <Link className='header__text header__text_link header__text_auth' to='/register'>Sign up</Link>
      }
      {
        (location.pathname === '/register') && <Link className='header__text header__text_link header__text_auth' to='/login'>Log in</Link>}
      {
        (loggedIn && location.pathname === '/') && 
        <div className={menuOpen ? 'header__nav header__nav_active' : 'header__nav'}>
          <p className='header__text header__text_email'>{userEmail}</p>
          <Link className='header__text header__text_link header__text_log-out' onClick={logout} to='/login'>Log out</Link>
        </div>
      }
    </header>
  )
}
