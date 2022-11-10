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
      // console.log('second render');
    });
    this.setState({ isAuthorizing: false });
    // console.log('first render');
  }

  render() {
    if (this.state.isAuthorizing) {
      // console.log('component mounted');
      return null;
    }
    const { user, route } = this.state;
    const contextValue = { user, route };
    // console.log(contextValue);
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
