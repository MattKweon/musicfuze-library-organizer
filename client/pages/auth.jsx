import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AuthForm from '../components/auth-form';

export default class Auth extends React.Component {
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col className="text-center mt-5" >
              <h1>MusicFuze</h1>
              <p>Create an account to get started!</p>
            </Col>
          </Row>
          <Row>
            <AuthForm />
          </Row>
        </Container>
      </div>
    );
  }
}
