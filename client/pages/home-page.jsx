import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class Home extends React.Component {
  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    return (
      <>
        <div />
        <h1 className="fw-bolder">Library</h1>
      </>
    );
  }
}

Home.contextType = AppContext;
