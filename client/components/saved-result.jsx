import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import AppContext from '../lib/app-context';

export default class SavedResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      playlistName: '',
      showPlaylistDetails: null,
      choosePlaylist: null
    };

    this.handleCreatePlaylist = this.handleCreatePlaylist.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleSongOptions = this.handleSongOptions.bind(this);
    this.handleClickPlaylist = this.handleClickPlaylist.bind(this);
    this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancelDelete = this.handleCancelDelete.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
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

  handleSongOptions(e) {
    const saveId = e.target.closest('[data-id]').getAttribute('data-id');
    const trackId = this.state.result[saveId].id;
    const token = window.localStorage.getItem('user-jwt');
    const options = {
      headers: {
        'X-Access-Token': token
      }
    };
    fetch('/api/user/library/playlists', options)
      .then(res => res.json())
      .then(result => {
        this.setState({ result, trackId, choosePlaylist: true });
      });
  }

  addSongToPlaylist(e) {
    e.preventDefault();
    const trackId = this.state.trackId;
    const playlistId = e.target.closest('[data-id]').getAttribute('data-id');
    const token = window.localStorage.getItem('user-jwt');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      },
      body: JSON.stringify({ playlistId, trackId })
    };
    fetch('/api/save/playlist/track', options)
      .then(res => res.json())
      .then(result => {
        this.setState({ choosePlaylist: false });
      });
    this.componentDidMount();
  }

  handleDelete(e) {
    const deleteId = e.target.closest('[data-id]').getAttribute('data-id');
    this.setState({ deleteFromLibrary: deleteId });
  }

  handleCancelDelete() {
    this.setState({ deleteFromLibrary: null });
  }

  handleConfirmDelete(e) {
    e.preventDefault();
    const endpoint = this.props.libCategory.get('libCategory');
    const deleteId = this.state.deleteFromLibrary;
    const token = window.localStorage.getItem('user-jwt');
    let trackId;
    let options;
    if (endpoint === 'songs') {
      trackId = this.state.result[deleteId].id;
      options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': token
        },
        body: JSON.stringify({ trackId })
      };
      fetch('/api/delete/library', options)
        .then(res => res.json())
        .then(result => {
          this.setState({ result, deleteFromLibrary: null });
        })
        .catch(err => console.error(err));
    } else if (endpoint === 'playlists') {
      const playlistId = this.state.showPlaylistDetails[0][deleteId].id;
      trackId = this.state.showPlaylistDetails[1][deleteId].id;
      options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': token
        },
        body: JSON.stringify({ trackId, playlistId })
      };
      fetch('/api/delete/playlist/track', options)
        .then(res => res.json())
        .then(result => {
          this.setState({
            deleteFromLibrary: null,
            showPlaylistDetails: result
          });
        });
    }
  }

  render() {
    const { handleCreatePlaylist, handleChange, handleCancel, handleConfirm, handleClickPlaylist, handleSongOptions, addSongToPlaylist, handleDelete, handleCancelDelete, handleConfirmDelete } = this;
    const { result, createPlaylist, showPlaylistDetails, choosePlaylist, deleteFromLibrary } = this.state;
    const endpoint = this.props.libCategory.get('libCategory');
    let savedList;
    let playlistDetails;

    if (result) {
      // eslint-disable-next-line array-callback-return
      savedList = result.map((item, index) => {
        if (endpoint === 'songs' && choosePlaylist !== true) {
          return (
            <div key={index} data-id={index} className="row margin-neg">
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
              <Dropdown className="col-1">
                <Dropdown.Toggle
                className="material-symbols-outlined dropdown-btn pt-4 ps-3"
                id="dropdown-basic" >
                  more_horiz
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleSongOptions}>Add to Playlist</Dropdown.Item>
                  <Dropdown.Item onClick={handleDelete} className="text-danger">Remove...</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <hr className="style1 w-100" />
            </div >
          );
        } else if (endpoint === 'playlists' || choosePlaylist === true) {
          return (
            <div
              role="button"
              key={index}
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
      const tracks = showPlaylistDetails[1];
      savedList = tracks.map((item, index) => {
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
            <Dropdown className="col-1">
              <Dropdown.Toggle
                className="material-symbols-outlined dropdown-btn pt-4 ps-3"
                id="dropdown-basic" >
                more_horiz
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleDelete} className="text-danger">Remove...</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <hr className="style1 w-100" />
          </div>
        );
      });
      playlistDetails = (
        <>
          <div className="container">
            <div className="row">
              <div className="col d-flex justify-content-center">
                <div className="playlist-img-placeholder" />
              </div>
            </div>
            <div className="row my-3">
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
            {/* <div className="row mb-3">
              <div className="col d-flex justify-content-center">
                <Button type="button" className="btn-alt">Add Music</Button>
              </div>
            </div> */}
          </div>
          {tracks &&
            <div className="container">{savedList}</div>
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
            <div role="button" className="container" onClick={handleCreatePlaylist}>
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
        {choosePlaylist &&
          <div className="modal-background fixed-top vh-100">
            <div className="choose-playlist-container p-3">
              <div className="header">
                <h4>Select Playlist</h4>
              </div>
              <div className="container" onClick={addSongToPlaylist}>
                <div>{savedList}</div>
              </div>
            </div>
          </div>
        }
        {deleteFromLibrary &&
          <div className="modal-background fixed-top vh-100">
            <div className="modal-container-delete p-3">
              <div className="header text-center">
                <h4>Remove from library</h4>
              </div>
              <div className="row">
                <div className="col d-flex justify-content-between">
                  <Button
                    name="close"
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancelDelete} >
                    Cancel
                  </Button>
                  <Button
                    name="save"
                    type="submit"
                    className="btn-main"
                    onClick={handleConfirmDelete} >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
        <div />
      </>
    );
  }
}

SavedResult.contextType = AppContext;
