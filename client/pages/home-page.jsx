import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class Home extends React.Component {
  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    return (
      <>
        <h1 className="fw-bolder">Library</h1>
        <div className="container">
          <div className="row clickable-row" href="#?libCategory=songs">
            <div className="col-1 p-0">
              <span className="material-symbols-outlined">
                music_note
              </span>
            </div>
            <div className="col-10 p-0">
              <span>Songs</span>
            </div>
            <div className="col-1">
              <span className="material-symbols-outlined">
                chevron_right
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Home.contextType = AppContext;
