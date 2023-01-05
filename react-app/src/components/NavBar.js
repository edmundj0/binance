
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import './NavBar.css'
import binanceLogo from '../assets/binanceLogo.png'


const NavBar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const user = useSelector(state => state.session.user)

  useEffect(() => {
    if (!showMenu) {
      return
    }

    const closeMenu = () => {
      setShowMenu(false);
    }

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu])

  const openMenu = () => {
    if (showMenu) {
      return
    }

    setShowMenu(true)
  }

  let content;
  if (!user) {
    content = (
      <div className='logged-out-nav-container'>
        <NavLink style={{ textDecoration: 'none' }} to='/' exact={true} activeClassName='active' className="logo-navlink">
          <div className='logo-section'>
            <img id="logo-img" src={binanceLogo} alt='logo-image'></img>
          </div>
        </NavLink>
        <div>
          <NavLink to="/markets" exact={true} style={{textDecoration: 'none'}} className="live-markets-nav-bar">View Live Markets</NavLink>
        </div>
        <div className='navbar-right-side'>

          <NavLink style={{ textDecoration: 'none' }} to='/login' exact={true} activeClassName='active'><span id='login-span'>Login</span></NavLink>

          <NavLink to="/sign-up" exact={true} activeClassName='active'>
            <button id="get-started-button">Get Started</button>
          </NavLink>
        </div>

      </div>
    )
  }
  else {
    content = (
      <div className='logged-in-nav-container'>
        <NavLink style={{ textDecoration: 'none' }} to='/dashboard' exact={true} activeClassName='active' className="logo-navlink">
          <div className='logo-section'>
            <img id="logo-img" src={binanceLogo} alt='logo-image'></img>
          </div>
        </NavLink>
        <div>
          <NavLink to="/markets" exact={true} style={{textDecoration: 'none'}} className="live-markets-nav-bar">View Live Markets</NavLink>
        </div>
        <div className='loggedin-navbar-right'>
          <button id='navbar-user-button' onClick={openMenu}>
            <p>{user.email}</p>
            <i className="fa-solid fa-caret-down" />
          </button>
          {showMenu && (
            <ul className='profile-dropdown'>
              <li className='profile-dropdown-li'>Username: {user.username}</li>
              <li className='profile-dropdown-li profile-dropdown-email'>Email: {user.email}</li>
              <NavLink style={{ textDecoration: 'none' }} to='/dashboard' exact={true} activeClassName='active'><span id='dashboard-dropdown-text'>Dashboard</span></NavLink>
              <li className='profile-dropdown-logout-button'><LogoutButton /></li>
            </ul>
          )}
        </div>
      </div>
    )
  }

  return (
    <nav>
      {content}
    </nav>
  )


}

// const NavBar = () => {
//   return (
//     <nav>
//       <ul>
//         <li>
//           <NavLink to='/dashboard' exact={true} activeClassName='active'>
//             Home
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to='/login' exact={true} activeClassName='active'>
//             Login
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to='/sign-up' exact={true} activeClassName='active'>
//             Sign Up
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to='/users' exact={true} activeClassName='active'>
//             Users
//           </NavLink>
//         </li>
//         <li>
//           <LogoutButton />
//         </li>
//       </ul>
//     </nav>
//   );
// }

export default NavBar;
