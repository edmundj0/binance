import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
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

    if(username.length > 30){
      errorsArr.push("Username must be less than 30 characters")
    }

    if (email.length > 100){
      errorsArr.push("Email length must be less than 100 characters")
    }

    if(password.length > 30 || repeatPassword > 30){
      errorsArr.push("Password length must be less than 30 characters")
    }

    if (password !== repeatPassword){
      errorsArr.push("Passwords do not match")
    }

    if(errorsArr.length){
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
    <form onSubmit={onSignUp}>
      <div>
        {errors.map((error, ind) => (
          <div key={ind}>{error}</div>
        ))}
      </div>
      <div>
        <div>First name</div>
        <input
          type='text'
          name='First Name'
          onChange={updateFirstName}
          value={firstName}
          placeholder="First Name"
        ></input>
      </div>
      <div>
        <div>Last Name</div>
        <input
          type='text'
          name='Last Name'
          onChange={updateLastName}
          value={lastName}
          placeholder="Last Name"
        ></input>
      </div>
      <div>
        <div>Username</div>
        <input
          type='text'
          name='username'
          onChange={updateUsername}
          value={username}
          placeholder="Username"
        ></input>
      </div>
      <div>
        <div>Email</div>
        <input
          type='text'
          name='email'
          onChange={updateEmail}
          value={email}
          placeholder="Email"
        ></input>
      </div>
      <div>
        <div>Password</div>
        <input
          type='password'
          name='password'
          onChange={updatePassword}
          value={password}
          placeholder="Password"
        ></input>
      </div>
      <div>
        <div>Repeat Password</div>
        <input
          type='password'
          name='repeat_password'
          onChange={updateRepeatPassword}
          value={repeatPassword}
          required={true}
          placeholder="Repeat Password"
        ></input>
      </div>
      <button type='submit'>Sign Up</button>
    </form>
  );
};

export default SignUpForm;
