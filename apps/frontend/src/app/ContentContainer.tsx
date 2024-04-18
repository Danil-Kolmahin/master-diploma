import styled from '@emotion/styled';
import axios, { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { deleteFromDB } from './utils/indexed-db';

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
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/profile');
        setEmail(response.data.email);
        setProjectName(response.data.projectName);
      } catch (error) {
        if (isAxiosError(error)) navigate('/auth');
      }
    })();
  }, [navigate]);

  return (
    <>
      <Sidebar>
        <SidebarItem>{email}</SidebarItem>
        <SidebarItem>{projectName}</SidebarItem>
        <hr />
        <SidebarItemLink to="/">dashboard</SidebarItemLink>
        <SidebarItemLink to="/namespaces-secrets">
          namespaces-secrets
        </SidebarItemLink>
        <SidebarItemLink to="/roles-polices">roles-polices</SidebarItemLink>
        <SidebarItemLink
          to="/project-members"
          onClick={async () =>
            console.log(
              (
                await axios.post('/invite', {
                  email: 'test+600@example.com',
                  projectName: 'p1',
                })
              ).data
            )
          }
        >
          project-members
        </SidebarItemLink>
        <SidebarItemLink
          to="/auth"
          onClick={() => {
            deleteFromDB();
            axios('/logout');
          }}
        >
          log out
        </SidebarItemLink>
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </>
  );
};
