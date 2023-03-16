import React from 'react';
import Button from 'react-bootstrap/Button';
import jwtDecode from 'jwt-decode';
import AppContext from './lib/app-context';
import parseRoute from './lib/parse-route';
import Auth from './pages/auth-page';
import Home from './pages/home-page';
import Discover from './pages/discover-page';
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

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleCancelSignOut = this.handleCancelSignOut.bind(this);
    this.handleConfirmSignOut = this.handleConfirmSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const newRoute = parseRoute(window.location.hash);
      this.setState({ route: newRoute });
    });
    const token = window.localStorage.getItem('user-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('user-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    this.setState({ signOutModal: true });
  }

  handleCancelSignOut() {
    this.setState({ signOutModal: false });
  }

  handleConfirmSignOut() {
    window.localStorage.removeItem('user-jwt');
    this.setState({
      user: null,
      signOutModal: false
    });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <Home route={route} />;
    }
    if (route.path === 'discover') {
      return <Discover route={route} />;
    }
    if (route.path === 'sign-in' || route.path === 'sign-up') {
      return <Auth />;
    }
  }

  render() {
    if (this.state.isAuthorizing) {
      return null;
    }
    const { user, route, signOutModal } = this.state;
    const { handleSignIn, handleSignOut, handleCancelSignOut, handleConfirmSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          <Navbar />
          <PageContainer>
            { this.renderPage() }
            {signOutModal &&
              <div className="modal-background fixed-top vh-100">
                <div className="modal-container-delete p-3">
                  <div className="header text-center">
                    <h4>Log out from MusicFuze?</h4>
                  </div>
                  <div className="row">
                    <div className="col d-flex justify-content-between">
                      <Button
                        name="close"
                        type="button"
                        className="btn-secondary"
                        onClick={handleCancelSignOut} >
                        Cancel
                      </Button>
                      <Button
                        name="save"
                        type="submit"
                        className="btn-main"
                        onClick={handleConfirmSignOut} >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </PageContainer>
        </>
      </AppContext.Provider>
    );
  }
}
