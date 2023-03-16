import React from 'react';
import AppContext from '../lib/app-context';

export default class Navbar extends React.Component {
  render() {
    const { user, route, handleSignOut } = this.context;
    const justifyContent = user
      ? 'justify-content-start'
      : '';
    const underlineHome = route.path !== ''
      ? 'text-decoration-none'
      : '';
    const underlineDiscover = route.path !== 'discover'
      ? 'text-decoration-none'
      : '';
    return (
      <nav className="navbar color-nav">
        <div className={`container ${justifyContent}`}>
          <a href="#" className="navbar-brand">
            <img
              src="/images/logo.png"
              width="73"
              height="70"
              alt="Logo"
            />
          </a>
          <div>
            { user !== null &&
              <>
                <a href="#" className={`text-muted me-3 ${underlineHome}`}>Home</a>
                <a href="#discover" className={`text-muted ${underlineDiscover}`}>Discover</a>
              </>
            }
            { user === null &&
              <>
                <a href="#sign-in" className="btn btn-alt me-2">Sign In</a>
                <a href="#sign-up" className="btn btn-main">Sign Up</a>
              </>
            }
          </div>
        </div>
        { user !== null &&
          <button onClick={handleSignOut} className="btn btn-main position-absolute end-0 me-2">Sign Out</button>
        }
      </nav>
    );
  }
}

Navbar.contextType = AppContext;
