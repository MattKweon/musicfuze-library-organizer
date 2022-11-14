import React from 'react';

export default class SearchResult extends React.Component {
  render() {
    const { result, filterType } = this.props;
    let resultList;
    if (filterType === 'track') {
      resultList = result.map((item, index) => {
        return (
          <div key="index" className="row">
            <div className="col">
              <div className="img-album">
                <img src={item.cover} alt={`${item.title}`} />
              </div>
              <span>{item.title}, {item.name}</span>
            </div>
          </div>
        );
      });
    } else if (filterType === 'artist') {
      resultList = result.map((item, index) => {
        return (
          <div key="index" className="row">
            <div className="col">
              <div className="img-artist">
                <img src={item.picture} alt="item.name" />
              </div>
              <span>{item.name}</span>
            </div>
          </div>
        );
      });
    }
    return (
      <div className="container">{resultList}</div>
    );
  }
}
