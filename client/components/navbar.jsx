import React from 'react';
import AppContext from '../lib/app-context';

export default class Navbar extends React.Component {
  render() {
    const { user } = this.context;
    const containerJustifyContent = user
      ? 'container justify-content-start'
      : 'container';
    return (
      <nav className="navbar color-nav">
        <div className={containerJustifyContent}>
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
                <a href="#" className="me-4">Home</a>
                <a href="#discover" className="text-decoration-none">Discover</a>
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
      </nav>
    );
  }
}

Navbar.contextType = AppContext;
