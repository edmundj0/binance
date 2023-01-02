import React from 'react';
import { useDispatch } from 'react-redux';
import { clearPaymentMethods } from '../../store/paymentMethod';
import { clearPortfolios } from '../../store/portfolio';
import { logout } from '../../store/session';

const LogoutButton = () => {
  const dispatch = useDispatch()
  const onLogout = async (e) => {
    await dispatch(logout());
    await dispatch(clearPaymentMethods());
    await dispatch(clearPortfolios());
  };

  return <button onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
