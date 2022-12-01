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
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleClick() {
    this.setState({
      username: 'lfzdemo',
      password: 'password2'
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { action } = this.props;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch(`/api/auth/${action}`, options)
      .then(res => res.json())
      .then(result => {
        if (action === 'sign-up') {
          window.location.hash = 'sign-in';
        } else if (result.error) {
          this.setState({ error: result.error });
        } else if (result.user && result.token) {
          this.props.onSignIn(result);
        }
      });
  }

  render() {
    const { handleChange, handleClick, handleSubmit } = this;
    const { username, password } = this.state;
    const { action } = this.props;
    const submitBtnText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    const errorMsg = 'Incorrect username or password';
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            className="bg-light"
            autoFocus />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          className="bg-light" />
        </Form.Group>
        {this.state.error &&
          <div className="alert alert-danger py-1">{errorMsg}</div>
        }
        <div className="d-flex justify-content-between">
          <Button type="button" className="btn-alt" onClick={handleClick}>DEMO</Button>
          <Button type="submit" className="btn-main">{submitBtnText}</Button>
        </div>
      </Form>
    );
  }
}
