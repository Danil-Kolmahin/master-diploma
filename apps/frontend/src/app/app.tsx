import styled from '@emotion/styled';

import NxWelcome from './nx-welcome';
import { useEffect } from 'react';
import axios from 'axios';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  useEffect(() => {
    axios('/version').then(r => console.log(r));
  }, []);

  return (
    <StyledApp>
      <NxWelcome title="frontend" />
    </StyledApp>
  );
}

export default App;
