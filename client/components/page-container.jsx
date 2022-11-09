import React from 'react';
import Container from 'react-bootstrap/Container';

export default function PageContainer({ children }) {
  return (
    <div className="bg-light">
      <Container>
        {children}
      </Container>
    </div>
  );
}
