import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { Dashboard } from './Dashboard';
import { Auth } from './Auth';
import { NotFound } from './NotFound';
import { PrivateKeyCatcher } from './PrivateKeyCatcher';
import { Route, Routes } from 'react-router-dom';
import { ContentContainer } from './ContentContainer';
import { NamespacesSecrets } from './NamespacesSecrets';
import { ProjectMembers } from './ProjectMembers';
import { RolesPolicies } from './RolesPolicies';
import { Role } from './Role';
import { Audit } from './Audit';
import { Button } from './styles/styles';
import axios from 'axios';

const GlobalStyle = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    font-family: 'Courier', monospace;
    font-size: 12px;
    font-weight: 400;
  }

  html,
  body,
  #root {
    height: 100%;
  }
`;

const StyledApp = styled.div`
  display: table;
  width: 100%;
  height: 100vh;
`;

export const App = () => {
  return (
    <>
      <Global styles={GlobalStyle} />
      <Button
        style={{
          position: 'absolute',
          top: '35px',
          right: '40px',
          textDecoration: 'underline',
          color: 'blue',
        }}
        onClick={() => window.open(axios.defaults.baseURL, '_blank')?.focus()}
      >
        API
      </Button>
      <StyledApp>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/from-invite/:inviteToken" element={<Auth />} />
          <Route
            path="/private-key-catcher/:email/:projectName"
            element={<PrivateKeyCatcher />}
          />
          <Route element={<ContentContainer />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/namespaces-secrets" element={<NamespacesSecrets />} />
            <Route path="/roles-policies" element={<RolesPolicies />} />
            <Route path="/roles-policies/:roleName" element={<Role />} />
            <Route path="/project-members" element={<ProjectMembers />} />
            <Route path="/audit" element={<Audit />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </StyledApp>
    </>
  );
};
