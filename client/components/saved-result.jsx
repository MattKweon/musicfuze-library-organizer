import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AppContext from '../lib/app-context';

export default class SavedResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = { result: null };

    this.handleCreatePlaylist = this.handleCreatePlaylist.bind(this);
  }

  componentDidMount() {
    const token = window.localStorage.getItem('user-jwt');
    const endpoint = this.props.libCategory.get('libCategory');
    const options = {
      method: 'GET',
      headers: {
        'X-Access-Token': token
      }
    };
    if (endpoint === 'songs') {
      fetch('/api/user/library', options)
        .then(res => res.json())
        .then(result => {
          // eslint-disable-next-line array-callback-return
          const savedList = result.map((item, index) => {
            if (endpoint === 'songs') {
              return (
                <div key={item.id} data-id={index} className="row margin-neg">
                  <div className="col-2 col-md-1 p-0">
                    <div className="img-album my-1">
                      <img
                        src={item.albumCover}
                        className="rounded img-fluid"
                        alt={item.title} />
                    </div>
                  </div>
                  <div className="col-9 col-md-10 pt-3">
                    <span className="d-inline-block text-truncate" style={{ maxWidth: 250 }}>{item.title}</span>
                    <br />
                    <span className="text-muted">{item.artistName}</span>
                  </div>
                  <hr className="style1 w-100" />
                </div>
              );
            }
          });
          this.setState({ result: savedList });
        });
    } else if (endpoint === 'playlist') {
      // filler
    }
  }

  handleCreatePlaylist(e) {
    // console.log('clicked');
    this.setState({ createdPlaylist: true });
  }

  render() {
    const { handleCreatePlaylist } = this;
    const { result, createdPlaylist } = this.state;
    const endpoint = this.props.libCategory.get('libCategory');

    return (
      <>
        {result && endpoint === 'songs' &&
          <div className="container">{result}</div>
        }
        {endpoint === 'playlist' &&
          <div className="container" onClick={handleCreatePlaylist}>
            <div className="row align-items-center clickable-row">
              <div className="col-4">
                <div className="add-playlist-container d-flex">
                  <span className="material-symbols-outlined color-icons">add</span>
                </div>
              </div>
              <div className="col-7">
                <span>New Playlist...</span>
              </div>
              <div className="col-1">
                <span className="material-symbols-outlined color-icons">
                  chevron_right
                </span>
              </div>
              <hr className="style1 w-100 mt-1" />
            </div>
          </div>
        }
        {createdPlaylist &&
          <div className="modal-background fixed-top vh-100">
            <div className="modal-container p-3">
              <div className="header">
                <h4>New Playlist</h4>
              </div>
              <Form>
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      name="search"
                      placeholder="PLAYLIST NAME"
                      className="form-control search-bar text-muted my-3" />
                  </div>
                </div>
                <div className="row">
                  <div className="col d-flex justify-content-between">
                    <Button type="button" className="btn-secondary">Close</Button>
                    <Button type="submit" className="btn-main">Save Changes</Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        }
        <div />
      </>
    );
  }
}

SavedResult.contextType = AppContext;
