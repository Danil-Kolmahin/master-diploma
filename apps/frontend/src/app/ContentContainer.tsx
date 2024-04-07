import styled from '@emotion/styled';
import { NavLink, Outlet } from 'react-router-dom';

const Sidebar = styled.div`
  display: table-cell;
  width: 300px;
  border-right: 1px solid rgb(192, 192, 192);
  box-shadow: 0.25px 0px 0px 0px rgb(192, 192, 192);
  padding: 10px;
  vertical-align: top;

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

const SidebarItemLink = styled(NavLink)`
  display: block;
  margin-bottom: 10px;
  text-align: center;

  &.active {
    font-weight: bold;
  }

  text-decoration: none;
  color: black;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: blue;
    outline: none;
  }
`;

export const ContentContainer = () => {
  return (
    <>
      <Sidebar>
        <SidebarItem>some.user@example.com</SidebarItem>
        <SidebarItem>MyProject</SidebarItem>
        <hr />
        <SidebarItemLink to="/">namespaces - secrets-variables</SidebarItemLink>
        <SidebarItemLink to="/not-implemented">applications - integrations-bridges</SidebarItemLink>
        <SidebarItemLink to="/not-implemented">members</SidebarItemLink>
        <SidebarItemLink to="/not-implemented">roles - permissions</SidebarItemLink>
        <SidebarItemLink to="/not-implemented">projects</SidebarItemLink>
        <SidebarItemLink to="/auth">log out</SidebarItemLink>
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </>
  );
};
