import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AppContext from '../lib/app-context';

export default class SavedResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      playlistName: '',
      showPlaylistDetails: null
    };

    this.handleCreatePlaylist = this.handleCreatePlaylist.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleClickPlaylist = this.handleClickPlaylist.bind(this);
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

  handleClickPlaylist(e) {
    const id = e.target.closest('[data-id]').getAttribute('data-id');
    const token = window.localStorage.getItem('user-jwt');
    let newHash = window.location.hash;
    newHash += `&playlistId=${id}`;
    window.location.hash = newHash;
    const options = {
      headers: {
        'X-Access-Token': token
      }
    };
    fetch(`/api/user/library/playlists/${id}`, options)
      .then(res => res.json())
      .then(result => {
        this.setState({
          result: null,
          showPlaylistDetails: result
        });
      });
  }

  render() {
    const { handleCreatePlaylist, handleChange, handleCancel, handleConfirm, handleClickPlaylist } = this;
    const { result, createPlaylist, showPlaylistDetails } = this.state;
    const endpoint = this.props.libCategory.get('libCategory');
    let savedList;
    let playlistDetails;

    if (result) {
      // eslint-disable-next-line array-callback-return
      savedList = result.map((item, index) => {
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
                <span>{item.playlistName}</span>
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
    }
    if (showPlaylistDetails) {
      const info = showPlaylistDetails[0][0];
      const tracks = showPlaylistDetails[1][0];
      playlistDetails = (
        <>
          <div className="container">
            <div className="row">
              <div className="col d-flex justify-content-center">
                <div className="playlist-img-placeholder" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="row">
                  <div className="col d-flex justify-content-center">
                    <h5>{info.playlistName}</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col d-flex justify-content-center">
                    <span className="color-main">{info.username}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col d-flex justify-content-center">
                <Button type="button" className="btn-alt">Add Music</Button>
              </div>
            </div>
          </div>
          {tracks &&
            <div key={tracks.id} data-id={tracks.id} className="row margin-neg">
              <div className="col-2 col-md-1 p-0">
                <div className="img-album my-1">
                  <img
                    src={tracks.albumCover}
                    className="rounded img-fluid"
                    alt={tracks.title} />
                </div>
              </div>
              <div className="col-9 col-md-10 pt-3">
                <span className="d-inline-block text-truncate" style={{ maxWidth: 250 }}>{tracks.title}</span>
                <br />
                <span className="text-muted">{tracks.artistName}</span>
              </div>
              <hr className="style1 w-100" />
            </div>
          }
        </>
      );
    }

    return (
      <>
        {result && endpoint === 'songs' &&
          <div className="container">{savedList}</div>
        }
        {endpoint === 'playlists' && showPlaylistDetails === null
          ? <>
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
            </div>
            <div className="container" onClick={handleClickPlaylist}>
              <div>{savedList}</div>
            </div>
          </>
          : <div className="container">{playlistDetails}</div>
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
