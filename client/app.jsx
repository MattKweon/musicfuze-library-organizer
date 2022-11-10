import React from 'react';
import AppContext from './lib/app-context';
import parseRoute from './lib/parse-route';
import Auth from './pages/auth-page';
import Home from './pages/home-page';
import Navbar from './components/navbar';
import PageContainer from './components/page-container';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const newRoute = parseRoute(window.location.hash);
      this.setState({ route: newRoute });
    });
    this.setState({ isAuthorizing: false });
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === '') {
      return <Home />;
    }
    if (path === 'sign-in' || path === 'sign-up') {
      return <Auth />;
    }
  }

  render() {
    if (this.state.isAuthorizing) {
      return null;
    }
    const { user, route } = this.state;
    const contextValue = { user, route };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          <Navbar />
          <PageContainer>
            <Auth />
          </PageContainer>
        </>
      </AppContext.Provider>
    );
  }
}
