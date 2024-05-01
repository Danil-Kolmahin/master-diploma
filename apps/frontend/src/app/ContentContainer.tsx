import styled from '@emotion/styled';
import axios, { isAxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { deleteFromDB, getFromDB } from './utils/indexed-db';
import { ACCESS_TIME, AuthDataI } from '@master-diploma/shared-resources';

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
  const [session, setSession] = useState<AuthDataI>();

  const signOut = useCallback(async () => {
    await deleteFromDB();
    await axios.delete('/auth/session');
    navigate('/auth');
  }, [navigate]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/auth/session');
        setSession(response.data);
      } catch (error) {
        if (isAxiosError(error) && error.status === 401) navigate('/auth');
        else console.error(error);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const privateKeyExists = await getFromDB();
      if (privateKeyExists) {
        const encryptedChallenge = (
          await axios.post('/auth/challenge', {
            email: session?.email,
            projectName: session?.projectName,
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

        await axios.post('/auth/session', {
          email: session?.email,
          projectName: session?.projectName,
          challenge,
        });
      } else signOut();
    }, ACCESS_TIME - 60 * 1000);

    return () => clearInterval(interval);
  }, [signOut, session]);

  useEffect(() => {
    let logoutTimer = setTimeout(signOut, ACCESS_TIME);

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(signOut, ACCESS_TIME);
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
  }, [signOut]);

  return (
    <>
      <Sidebar>
        <SidebarItem>{session?.email}</SidebarItem>
        <SidebarItem>{session?.projectName}</SidebarItem>
        <hr />
        <SidebarItemLink to="/">dashboard</SidebarItemLink>
        <SidebarItemLink to="/namespaces-secrets">
          namespaces-secrets
        </SidebarItemLink>
        <SidebarItemLink to="/roles-policies">roles-policies</SidebarItemLink>
        <SidebarItemLink to="/project-members">project-members</SidebarItemLink>
        <SidebarItemLink to="/audit">audit</SidebarItemLink>
        <SidebarItemLink to="/auth" onClick={signOut}>
          log out
        </SidebarItemLink>
      </Sidebar>
      <Content>
        <Outlet context={session} />
      </Content>
    </>
  );
};
