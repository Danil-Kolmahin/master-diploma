import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';

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

const Sidebar = styled.div`
  display: table-cell;
  width: 300px;
  border-right: 1px solid rgb(192, 192, 192);
  box-shadow: 0.25px 0px 0px 0px rgb(192, 192, 192);
  padding: 10px;

  hr {
    margin-bottom: 10px;
  }
`;

const Content = styled.div`
  display: table-cell;
  padding: 10px;
`;

const SidebarItem = styled.span`
  display: block;
  margin-bottom: 10px;
  text-align: center;
`;

export function App() {
  return (
    <>
      <Global styles={GlobalStyle} />
      <StyledApp>
        <Sidebar>
          <SidebarItem>some.user@example.com</SidebarItem>
          <SidebarItem>MyProject</SidebarItem>
          <hr />
          <b><SidebarItem>namespaces - secrets-variables</SidebarItem></b>
          <SidebarItem>applications - integrations-bridges</SidebarItem>
          <SidebarItem>members</SidebarItem>
          <SidebarItem>roles - permissions</SidebarItem>
          <SidebarItem>projects</SidebarItem>
          <SidebarItem>log out</SidebarItem>
        </Sidebar>
        <Content>
          <span>Test.</span>
        </Content>
      </StyledApp>
    </>
  );
}

export default App;
