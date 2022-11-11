import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class Discover extends React.Component {
  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    return (
      <h1>discover-page</h1>
    );
  }
}

Discover.contextType = AppContext;
