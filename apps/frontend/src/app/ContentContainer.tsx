import styled from '@emotion/styled';
import axios, { isAxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { deleteFromDB, getFromDB } from './utils/indexed-db';

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
  const [data, setData] = useState({});

  const logout = useCallback(async () => {
    await deleteFromDB();
    await axios('/logout');
    navigate('/auth');
  }, [navigate]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/profile');
        setData(response.data);
      } catch (error) {
        if (isAxiosError(error)) navigate('/auth');
      }
    })();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const privateKeyExists = await getFromDB();
      if (privateKeyExists) {
        const encryptedChallenge = (
          await axios.post('/sign-in/challenge-request', {
            email: (data as any).email,
            projectName: (data as any).projectName,
          })
        ).data;

        const challenge = new TextDecoder().decode(
          await window.crypto.subtle.decrypt(
            { name: 'RSA-OAEP' },
            await getFromDB(),
            Uint8Array.from(window.atob(encryptedChallenge), (c) =>
              c.charCodeAt(0)
            )
          )
        );

        await axios.post('/sign-in/challenge-response', {
          email: (data as any).email,
          projectName: (data as any).projectName,
          challenge,
        });
      } else logout();
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [logout, data]);

  useEffect(() => {
    let logoutTimer = setTimeout(logout, 5 * 60 * 1000);

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(logout, 5 * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      clearTimeout(logoutTimer);
    };
  }, [logout]);

  return (
    <>
      <Sidebar>
        <SidebarItem>{(data as any).email}</SidebarItem>
        <SidebarItem>{(data as any).projectName}</SidebarItem>
        <hr />
        <SidebarItemLink to="/">dashboard</SidebarItemLink>
        <SidebarItemLink to="/namespaces-secrets">
          namespaces-secrets
        </SidebarItemLink>
        <SidebarItemLink to="/roles-policies">roles-policies</SidebarItemLink>
        <SidebarItemLink to="/project-members">project-members</SidebarItemLink>
        <SidebarItemLink to="/auth" onClick={logout}>
          log out
        </SidebarItemLink>
      </Sidebar>
      <Content>
        <Outlet context={data} />
      </Content>
    </>
  );
};
