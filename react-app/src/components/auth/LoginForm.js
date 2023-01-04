import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import "./auth.css"

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const demologin = () => {
    setEmail('demo@aa.io')
    setPassword('password')
  }

  if (user) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div className='login-form-container'>
      <form onSubmit={onLogin}>
        <div className="login-header-text">Log In</div>
        <div className="warning-header-text">Make sure you are visiting the correct URL</div>
        <div>
          {errors.map((error, ind) => (
            <div key={ind} className='error-text'>{error}</div>
          ))}
        </div>
        <div>
          <div className='login-input-text'>Email address:</div>
          {/* <label htmlFor='email'>Email</label> */}
          <input
            name='email'
            type='text'
            placeholder='Email'
            value={email}
            onChange={updateEmail}
            className="login-input-box"
          />
        </div>
        <div>
          <div className='login-input-text'>Password:</div>
          {/* <label htmlFor='password'>Password</label> */}
          <input
            name='password'
            type='password'
            placeholder='Password'
            value={password}
            onChange={updatePassword}
            className="login-input-box"
          />
        </div>
          <button type='submit' className='login-form-button'>Login</button>
          <div id='no-account-text'>Don't have an account? <NavLink to="/sign-up" exact={true}><span id='get-started-text'>Get Started</span></NavLink></div>
          <div id='demo-login-or'> ---------------- or -----------------</div>
          <button id='login-demo-user-button' type='submit' onClick={()=>demologin()}>Log In with Demo User</button>
      </form>
    </div>
  );
};

export default LoginForm;
