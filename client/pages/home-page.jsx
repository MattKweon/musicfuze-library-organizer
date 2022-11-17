import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dummy: false };

    this.handleCategoryClick = this.handleCategoryClick.bind(this);
  }

  handleCategoryClick(e) {
    e.preventDefault();
    const categoryType = e.target.closest('[data-category]').getAttribute('data-category');
    let newHash = '#?';
    newHash += `libCategory=${categoryType}`;
    window.location.hash = newHash;
  }

  render() {
    const { handleCategoryClick } = this;

    if (!this.context.user) return <Redirect to="sign-in" />;

    return (
      <>
        <h1 className="fw-bolder">Library</h1>
        <div className="container" onClick={handleCategoryClick}>
          <div data-category="songs" className="row clickable-row">
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
          <hr className="style1" />
        </div>
      </>
    );
  }
}

Home.contextType = AppContext;
