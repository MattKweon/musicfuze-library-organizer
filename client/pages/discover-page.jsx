import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';

export default class Discover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  componentDidUpdate() {
    const { params } = this.context.route;
    const endpoint = params.get('filterType');
    const q = this.state.searchInput;
    if (!q) {
      // eslint-disable-next-line no-useless-return
      return;
    } else {
      fetch(`/api/search/${endpoint}?q=${q}`)
        .then(res => res.json())
        .then(result => {
        });
    }
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({ searchInput: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { params } = this.context.route;
    let endpoint = params.get('filterType');
    const q = this.state.searchInput;
    if (!endpoint) {
      window.location.hash = '#discover?filterType=track';
      endpoint = 'track';
    }
    fetch(`/api/search/${endpoint}?q=${q}`)
      .then(res => res.json())
      .then(result => {
      });

  }

  handleFilterClick(e) {
    e.preventDefault();
    const filterType = e.target.getAttribute('data-filter');
    window.location.hash = `#discover?filterType=${filterType}`;
  }

  render() {
    const { user, route } = this.context;
    const { result } = this.state;
    const { handleChange, handleSubmit, handleFilterClick } = this;

    if (!user) return <Redirect to="sign-in" />;

    let artistTab, albumTab, trackTab;
    if (route.params.get('filterType') === 'artist') {
      artistTab = 'current-tab';
    } else {
      artistTab = '';
    }
    if (route.params.get('filterType') === 'album') {
      albumTab = 'current-tab';
    } else {
      albumTab = '';
    }
    if (route.params.get('filterType') === 'track') {
      trackTab = 'current-tab';
    } else {
      trackTab = '';
    }
    return (
      <div className="container">
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <input
              type="text"
              name="search"
              placeholder="Search song, artist, album... etc"
              onChange={handleChange}
              className="form-control search-bar mt-3 me-2 w-75 d-inline-block" />
            <Button type="submit" className="btn-alt mt-3 w-auto">search</Button>
          </div>
        </Form>
        <div className="row mt-2">
          <div className="col-2">
            <a
              data-filter="track"
              className={`text-decoration-none ${trackTab}`}
              onClick={handleFilterClick} >
              Songs
            </a>
          </div>
          <div className="col-2 me-2">
            <a
              data-filter="artist"
              className={`text-decoration-none ${artistTab}`}
              onClick={handleFilterClick} >
              Artists
            </a>
          </div>
          <div className="col-2">
            <a
              data-filter="album"
              className={`text-decoration-none ${albumTab}`}
              onClick={handleFilterClick} >
              Albums
            </a>
          </div>

        </div>
        { result !== null &&
          <div className="row">
            <div>{result}</div>
          </div>
        }
      </div>
    );
  }
}

Discover.contextType = AppContext;
