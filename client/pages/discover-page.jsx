import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class Discover extends React.Component {
  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    return (
      <div className="container">
        <div className="row">
          <div className="col-10">
            <input
              type="text"
              name="search"
            />
          </div>
          <div className="col-2">
            <div type="submit" className="btn">search</div>
          </div>
        </div>
      </div>
    );
  }
}

Discover.contextType = AppContext;
