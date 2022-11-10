import React from 'react';
import parseRoute from './lib/parse-route';
import Auth from './pages/auth';
import Navbar from './components/navbar';
import PageContainer from './components/page-container';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const newRoute = parseRoute(window.location.hash);
      this.setState({ route: newRoute });
    });
  }

  render() {
    return (
      <>
        <Navbar />
        <PageContainer>
          <Auth />
        </PageContainer>
      </>
    );
  }
}
