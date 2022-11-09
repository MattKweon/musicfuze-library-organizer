import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class AuthForm extends React.Component {
  render() {
    return (
      <Form className="form-container">
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            className="bg-light"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
          type="password"
          className="bg-light"
          />
        </Form.Group>
        <Button type="submit" className="color-btn">Register</Button>
      </Form>
    );
  }
}
