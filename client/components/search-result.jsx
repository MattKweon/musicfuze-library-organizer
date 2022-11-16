import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = { addedToLibrary: false };

    this.startTimer = this.startTimer.bind(this);
    this.handleAddToLibary = this.handleAddToLibary.bind(this);
  }

  startTimer() {
    setTimeout(() => {
      this.setState({ addedToLibrary: false });
    }, 2000);
  }

  handleAddToLibary(e) {
    e.preventDefault();
    const saveId = e.target.closest('[data-id]').getAttribute('data-id');
    const { id, title, artistId, albumId } = this.props.result[saveId];
    const songInfo = { id, title, artistId, albumId };
    const token = window.localStorage.getItem('user-jwt');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token
      },
      body: JSON.stringify(songInfo)
    };
    fetch('/api/save/library', options)
      .then(res => res.json())
      .then(result => {
        this.startTimer();
        this.setState({ addedToLibrary: true });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { addedToLibrary } = this.state;
    const { result, filterType } = this.props;
    const { handleAddToLibary } = this;
    // eslint-disable-next-line array-callback-return
    const resultList = result.map((item, index) => {
      if (filterType === 'track') {
        return (
          <div key={index} data-id={index} className="row margin-neg">
            <div className="col-2 col-md-1 ps-0">
              <div className="img-album d-inline-block my-1">
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
                <Dropdown.Item onClick={handleAddToLibary}>Add to Library</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <hr className="style1 w-100" />
          </div>
        );
      } else if (filterType === 'artist') {
        return (
          <div key={index} className="row margin-neg">
            <div className="col-2 ps-0">
              <div className="img-album d-inline-block my-1">
                <img
                  src={item.picture}
                  className="img-fluid img-artist"
                  alt={item.name} />
              </div>
            </div>
            <div className="col-10 pt-4">
              <span className="text-truncate">{item.name}</span>
            </div>
            <hr className="style1" />
          </div>
        );
      } else if (filterType === 'album') {
        return (
          <div key={index} className="row margin-neg">
            <div className="col-2 ps-0">
              <div className="img-album d-inline-block my-1">
                <img
                  src={item.cover}
                  className="rounded img-fluid"
                  alt={item.title} />
              </div>
            </div>
            <div className="col-10 pt-3">
              <span className="text-truncate">{item.title}</span>
              <br />
              <span className="text-muted">{item.name}</span>
            </div>
            <hr className="style1" />
          </div>
        );
      }
    });

    return (
      <>
        <div className="container">{resultList}</div>
        {addedToLibrary &&
          <div className="fixed-top">
            <div className="modal-added-to">
              <span className="material-symbols-outlined check mt-4">
                check_circle
              </span>
              <h2 className="modal-added-to-msg mt-1">Added to library</h2>
            </div>
          </div>
        }
      </>
    );
  }
}
