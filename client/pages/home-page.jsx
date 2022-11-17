import React from 'react';
import Redirect from '../components/redirect';
import SavedResult from '../components/saved-result';
import AppContext from '../lib/app-context';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: null };

    this.handleCategoryClick = this.handleCategoryClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { params } = this.props.route;
    const endpoint = params.get('libCategory');
    const prevEndpoint = prevProps.route.params.get('libCategory');
    if (prevEndpoint !== endpoint) {
      this.setState({ content: endpoint });
    }
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
    const { user } = this.context;
    const { content } = this.state;

    if (!user) return <Redirect to="sign-in" />;

    let pageHeader;
    if (!content) {
      pageHeader = 'Library';
    } else if (content === 'songs') {
      pageHeader = 'Songs';
    }

    return (
      <>
        {content
          ? <>
            <span className="material-symbols-outlined">
              chevron_left
            </span>
            <span>Library</span>
          </>
          : <div className="pb-5" />
        }
        <h1 className="fw-bolder">{pageHeader}</h1>
        {content === 'songs'
          ? <SavedResult libCategory={content} />
          : <div className="container" onClick={handleCategoryClick}>
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
        }
      </>
    );
  }
}

Home.contextType = AppContext;
