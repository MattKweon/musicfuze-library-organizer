import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch('/api/auth/sign-up', req)
      .then(res => res.json())
      .then(result => {
      });
  }

  render() {
    const { action } = this.props;
    const submitBtnText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            onChange={this.handleChange}
            className="bg-light"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
          type="password"
          name="password"
          onChange={this.handleChange}
          className="bg-light"
          />
        </Form.Group>
        <div className="d-flex flex-row-reverse">
          <Button type="submit" className="btn-main">{submitBtnText}</Button>
        </div>
      </Form>
    );
  }
}
