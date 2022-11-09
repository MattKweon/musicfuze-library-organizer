import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class AuthForm extends React.Component {
  render() {
    return (
      <Form className="form-container">
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            className="bg-light"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
          type="password"
          className="bg-light"
          />
        </Form.Group>
        <div className="d-flex flex-row-reverse">
          <Button type="submit" className="btn-main">Register</Button>
        </div>
      </Form>
    );
  }
}
