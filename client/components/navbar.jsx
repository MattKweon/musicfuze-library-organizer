import React from 'react';

export default class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar color-nav">
        <div className="container">
          <a href="#" className="navbar-brand">
            <img
              src="/images/logo.png"
              width="73"
              height="70"
              alt="Logo"
            />
          </a>
          <div>
            <a href="#sign-in" className="btn btn-alt me-2">Sign In</a>
            <a href="#sign-up" className="btn btn-main">Sign Up</a>
          </div>
        </div>
      </nav>
    );
  }
}
