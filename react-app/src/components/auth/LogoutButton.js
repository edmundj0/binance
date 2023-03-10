import React from 'react';
import { useDispatch } from 'react-redux';
import { clearPaymentMethods } from '../../store/paymentMethod';
import { clearPortfolios } from '../../store/portfolio';
import { logout } from '../../store/session';
import { clearWatchlists } from '../../store/watchlist';

const LogoutButton = () => {
  const dispatch = useDispatch()
  const onLogout = async (e) => {
    await dispatch(logout());
    await dispatch(clearPaymentMethods());
    await dispatch(clearPortfolios());
    await dispatch(clearWatchlists());
  };

  return <button onClick={onLogout} className="logout-button-main">Logout</button>;
};

export default LogoutButton;
