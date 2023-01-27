import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import { authenticate } from './store/session';
import BtcChart from './components/ChartTest';
import Dashboard from './components/Dashboard';
import OnePortfolio from './components/Portfolio/OnePortfolio/OnePortfolio';
import CoinDetails from './components/CoinDetails/CoinDetails';
import HomePage from './components/HomePage/HomePage';
import AllMarketData from './components/AllMarketData/AllMarketData';
import OneWatchlist from './components/Watchlists/OneWatchlist/OneWatchlist';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />
      <NavBar />
      <Switch>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute>
        <ProtectedRoute path='/dashboard' exact={true} >
          <Dashboard />
          {/* <BtcChart /> */}
        </ProtectedRoute>
        <ProtectedRoute path="/portfolios/:portfolioId" exact={true}>
          <OnePortfolio />
        </ProtectedRoute>
        <ProtectedRoute path="/watchlists/:watchlistId" exact={true}>
          <OneWatchlist />
        </ProtectedRoute>
        <Route path="/coins/:coinId" exact={true}>
          <CoinDetails />
        </Route>
        <Route path="/markets" exact={true}>
          <AllMarketData />
        </Route>
        <Route path="/" exact={true}>
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
