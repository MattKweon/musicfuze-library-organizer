import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AppContext from '../lib/app-context';

export default class SavedResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      playlistName: ''
    };

    this.handleCreatePlaylist = this.handleCreatePlaylist.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  componentDidMount() {
    const endpoint = this.props.libCategory.get('libCategory');
    const token = window.localStorage.getItem('user-jwt');
    const options = {
      headers: {
        'X-Access-Token': token
      }
    };
    fetch(`/api/user/library/${endpoint}`, options)
      .then(res => res.json())
      .then(result => {
        this.setState({ result });
      });
  }

  handleCreatePlaylist(e) {
    this.setState({ createPlaylist: true });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleCancel() {
    this.setState({
      createPlaylist: false,
      playlistName: ''
    });
  }

  handleConfirm(e) {
    e.preventDefault();
    const { playlistName } = this.state;
    const token = window.localStorage.getItem('user-jwt');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      },
      body: JSON.stringify({ playlistName })
    };
    fetch('/api/create/playlist', options)
      .then(res => res.json())
      .then(result => {
        this.setState({ result, createPlaylist: false });
      });
  }

  render() {
    const { handleCreatePlaylist, handleChange, handleCancel, handleConfirm } = this;
    const { result, createPlaylist } = this.state;
    const endpoint = this.props.libCategory.get('libCategory');

    if (result === null) return null;

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
      } else if (endpoint === 'playlists') {
        return (
          <div
            key={item.playlistId}
            data-id={item.playlistId}
            className="row align-items-center clickable-row" >
            <div className="col-4 ps-0">
              <div className="add-playlist-container d-flex">
                <span className="material-symbols-outlined color-icons">queue_music</span>
              </div>
            </div>
            <div className="col-7">
              <span>{item.name}</span>
            </div>
            <div className="col-1">
              <span className="material-symbols-outlined color-icons">
                chevron_right
              </span>
            </div>
            <hr className="style1 w-100 mt-1" />
          </div>
        );
      }
    });

    return (
      <>
        {result && endpoint === 'songs' &&
          <div className="container">{savedList}</div>
        }
        {endpoint === 'playlists' &&
          <div className="container" onClick={handleCreatePlaylist}>
            <div className="row align-items-center clickable-row">
              <div className="col-4 ps-0">
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
            <div>{savedList}</div>
          </div>
        }
        {createPlaylist &&
          <div className="modal-background fixed-top vh-100">
            <div className="modal-container p-3">
              <div className="header">
                <h4>New Playlist</h4>
              </div>
              <Form onSubmit={handleConfirm}>
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      name="playlistName"
                      onChange={handleChange}
                      placeholder="PLAYLIST NAME"
                      className="form-control search-bar text-muted my-3"
                      required />
                  </div>
                </div>
                <div className="row">
                  <div className="col d-flex justify-content-between">
                    <Button
                      name="close"
                      type="button"
                      className="btn-secondary"
                      onClick={handleCancel} >
                      Close
                    </Button>
                    <Button
                      name="save"
                      type="submit"
                      className="btn-main" >
                      Save Changes
                    </Button>
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
