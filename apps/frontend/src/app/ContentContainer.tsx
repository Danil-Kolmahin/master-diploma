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
        <SidebarItemLink to="/">namespaces - secrets-variables</SidebarItemLink>
        <SidebarItemLink
          to="/not-implemented"
          onClick={async () => {
            await axios.post('/namespaces', { name: 'n2' });
            const namespaces = (await axios('/namespaces/all')).data;
            await axios.post('/secrets', {
              name: 's1',
              encryptedValue: 'test',
              namespaceId: namespaces[0].id,
            });

            console.log((await axios(`/secrets/all/${namespaces[0].id}`)).data);
            console.log((await axios(`/secrets/all/${namespaces[1].id}`)).data);
          }}
        >
          applications - integrations-bridges
        </SidebarItemLink>
        <SidebarItemLink to="/not-implemented">members</SidebarItemLink>
        <SidebarItemLink
          to="/not-implemented"
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
          roles - permissions
        </SidebarItemLink>
        <SidebarItemLink to="/not-implemented">projects</SidebarItemLink>
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
