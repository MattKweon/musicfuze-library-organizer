import React from 'react';
import AppContext from './lib/app-context';
import parseRoute from './lib/parse-route';
import AuthPage from './pages/auth-page';
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
            <AuthPage />
          </PageContainer>
        </>
      </AppContext.Provider>
    );
  }
}
