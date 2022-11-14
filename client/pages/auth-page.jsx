import React from 'react';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';
import AuthForm from '../components/auth-form';

export default class Auth extends React.Component {
  render() {
    const { user, route, handleSignIn } = this.context;

    if (user) return <Redirect to="" />;

    const welcomeMessage = route.path === 'sign-in'
      ? 'Please sign-in to continue'
      : 'Create an account to get started!';
    return (
      <div className="row pt-5 align-items-center">
        <div className=" col-12 offset-0 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-6 offset-xl-3">
          <header className="text-center">
            <h1 className="mb-2">MusicFuze</h1>
            <p className="text-muted mb-4">{welcomeMessage}</p>
          </header>
          <div className="card p-3">
            <AuthForm
              action={route.path}
              onSignIn={handleSignIn} />
          </div>
        </div>
      </div>
    );
  }
}

Auth.contextType = AppContext;
