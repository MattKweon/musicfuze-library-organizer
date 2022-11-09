import React from 'react';
import Auth from './pages/auth';
import NavigationBar from './components/navigation-bar';
import PageContainer from './components/page-container';

export default class App extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        <PageContainer>
          <Auth />
        </PageContainer>
      </>
    );
  }
}
