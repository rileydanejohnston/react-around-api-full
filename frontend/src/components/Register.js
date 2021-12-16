import React from 'react'
import { Link } from 'react-router-dom';

export default function Register({ onRegister }) {

  const [email,setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(email, password);
  }

  return (
    <div className='auth'>
      <h3 className='auth__title'>Sign up</h3>
      <form className='auth__form' onSubmit={handleSubmit} method='POST' name='register'>
        <input className='auth__input' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' type='email' name='email' required/>
        <input className='auth__input' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='password' name='password' required />
        <button className='auth__submit' type='submit'>Sign up</button>
        <p className='auth__redirect'>Already a member? Log in <Link className='auth__link' to='/login'>here!</Link>
        </p>
      </form>
    </div>
  )
}
