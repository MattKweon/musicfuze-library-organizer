import React from 'react';
import AppContext from '../lib/app-context';

export default class SavedResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = { result: null };
  }

  componentDidMount() {
    const token = window.localStorage.getItem('user-jwt');
    const endpoint = this.props.libCategory;
    const options = {
      method: 'GET',
      headers: {
        'X-Access-Token': token
      }
    };
    fetch('/api/user/library', options)
      .then(res => res.json())
      .then(result => {
        if (endpoint === 'songs') {
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
        }
      });
  }

  render() {
    const { result } = this.state;

    if (!result) return null;

    return (
      <>
        <div />
        {result &&
          <div className="container">{result}</div>
        }
      </>
    );
  }
}

SavedResult.contextType = AppContext;
