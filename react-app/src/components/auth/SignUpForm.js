import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();

    const errorsArr = []

    if (firstName.length > 49) {
      errorsArr.push("First Name must be less than 50 characters")
    }
    if (lastName.length > 49) {
      errorsArr.push("Last Name must be less than 50 characters")
    }
    if (username.length > 30) {
      errorsArr.push("Username must be less than 30 characters")
    }
    if (email.length > 100) {
      errorsArr.push("Email length must be less than 100 characters")
    }
    if (password.length > 30 || repeatPassword > 30) {
      errorsArr.push("Password length must be less than 30 characters")
    }
    if (password !== repeatPassword) {
      errorsArr.push("Passwords do not match")
    }

    if (errorsArr.length) {
      setErrors(errorsArr)
      return;
    }




    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password, firstName, lastName));
      if (data) {
        setErrors(data)
      }
    }
  };

  const updateFirstName = (e) => {
    setFirstName(e.target.value);
  }

  const updateLastName = (e) => {
    setLastName(e.target.value);
  }

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div className='login-form-container'>
    <form onSubmit={onSignUp}>
      <div className='login-header-text'>Sign Up</div>
      <div>
        {errors.map((error, ind) => (
          <div key={ind} className='error-text'>{error}</div>
        ))}
      </div>
      <div>
        <div className='login-input-text'>First name</div>
        <input
          type='text'
          name='First Name'
          onChange={updateFirstName}
          value={firstName}
          placeholder="First Name"
          className="login-input-box"
        ></input>
      </div>
      <div>
        <div className='login-input-text'>Last Name</div>
        <input
          type='text'
          name='Last Name'
          onChange={updateLastName}
          value={lastName}
          placeholder="Last Name"
          className="login-input-box"
        ></input>
      </div>
      <div>
        <div className='login-input-text'>Username</div>
        <input
          type='text'
          name='username'
          onChange={updateUsername}
          value={username}
          placeholder="Username"
          className="login-input-box"
        ></input>
      </div>
      <div>
        <div className='login-input-text'>Email</div>
        <input
          type='text'
          name='email'
          onChange={updateEmail}
          value={email}
          placeholder="Email"
          className="login-input-box"
        ></input>
      </div>
      <div>
        <div className='login-input-text'>Password</div>
        <input
          type='password'
          name='password'
          onChange={updatePassword}
          value={password}
          placeholder="Password"
          className="login-input-box"
        ></input>
      </div>
      <div>
        <div className='login-input-text'>Repeat Password</div>
        <input
          type='password'
          name='repeat_password'
          onChange={updateRepeatPassword}
          value={repeatPassword}
          required={true}
          placeholder="Repeat Password"
          className="login-input-box"
        ></input>
      </div>
      <button type='submit' className='login-form-button'>Sign Up</button>
      <div id='no-account-text'>Already have an account? <NavLink to="/login" exact={true}><span id='get-started-text'>Login</span></NavLink></div>
    </form>
    </div>
  );
};

export default SignUpForm;
