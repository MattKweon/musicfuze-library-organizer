import React from 'react';
import NavigationBar from './components/navigation-bar';
import Auth from './pages/auth';

export default class App extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        <Auth />
      </>
    );
  }
}
