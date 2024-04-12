import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { Chart } from './Chart';
import { Auth } from './Auth';
import { NotFound } from './NotFound';
import { PrivateKeyCatcher } from './PrivateKeyCatcher';
import { Route, Routes } from 'react-router-dom';
import { ContentContainer } from './ContentContainer';

const GlobalStyle = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }
`;

const StyledApp = styled.div`
  font-family: 'Courier', monospace;
  font-size: 12px;
  font-weight: 400;
  display: table;
  width: 100%;
  height: 100vh;
`;

export const App = () => {
  return (
    <>
      <Global styles={GlobalStyle} />
      <StyledApp>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/private-key-catcher/:email/:projectName" element={<PrivateKeyCatcher />} />
          <Route element={<ContentContainer />}>
            <Route path="/" element={<Chart />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </StyledApp>
    </>
  );
};
