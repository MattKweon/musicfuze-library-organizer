import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

export default class NavigationBar extends React.Component {
  render() {
    return (
      <Navbar className="color-nav">
        <Container>
          <img
            src="/images/logo.png"
            width="73"
            height="70"
            alt="Logo"
          />
          <Button className="color-btn">Sign Up</Button>
        </Container>
      </Navbar>
    );
  }
}
