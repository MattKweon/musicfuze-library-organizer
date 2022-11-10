import React from 'react';
import Auth from './pages/auth';
import Navbar from './components/navbar';
import PageContainer from './components/page-container';

export default class App extends React.Component {
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
