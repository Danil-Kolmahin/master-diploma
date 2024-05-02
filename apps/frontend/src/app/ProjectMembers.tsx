import styled from '@emotion/styled';
import axios, { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  asymmetricStrDecrypt,
  asymmetricStrEncrypt,
  str2asymmetricPubKey,
  str2symmetricKey,
  symmetricKey2str,
} from './utils/key-pair';
import { getFromDB } from './utils/indexed-db';
import {
  MembersDtoI,
  EntitiesToReEncryptDtoI,
} from '@master-diploma/shared-resources';

const PlotContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const NamespaceBlock = styled.div`
  margin-top: 10px;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 3px;
  margin-right: 15px;
  margin-top: 5px;
  width: calc(40ch + 20px);
  border: 1px solid #ccc;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border: 1px solid #ccc;
  }
`;

const NamespaceNameInput = styled(Input)`
  width: calc(20ch + 20px);
`;

const Button = styled.button`
  margin-right: 15px;
  margin-top: 5px;
  border: none;
  background: none;
  cursor: pointer;
  color: black;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: blue;
    outline: none;
  }
`;

const SecretTextDiv = styled.div`
  margin-top: 3px;
`;

const SecretText = styled.span`
  font-size: 14px;
`;

const SecretNameText = styled(SecretText)`
  font-weight: bold;
`;

export const ProjectMembers = () => {
  const [members, setMembers] = useState<MembersDtoI[]>([]);
  const [newNamespaceName, setNewNamespaceName] = useState('');
  const [roleName, setRoleName] = useState('');
  const { projectName } = useOutletContext<{ projectName: string }>();

  useEffect(() => {
    (async () => {
      try {
        const membersResponse: AxiosResponse<MembersDtoI[]> = await axios.get(
          '/members'
        );
        setMembers(membersResponse.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const setRole = useCallback(async () => {
    const user = members.find(
      (member) => member.email === newNamespaceName
    ) as MembersDtoI;
    const entities: EntitiesToReEncryptDtoI[] = (
      await axios(`/roles/${roleName}/access-requirements`)
    ).data;
    const reEntities = await Promise.all(
      entities.map(async (entity) => {
        const securityKey = await asymmetricStrDecrypt(
          entity.encryptedSecurityKey,
          await getFromDB()
        );
        const symmetricKey = await str2symmetricKey(securityKey);
        const strSymmetricKey = await symmetricKey2str(symmetricKey);
        const reEncryptedSecurityKey = await asymmetricStrEncrypt(
          strSymmetricKey,
          await str2asymmetricPubKey(user.publicKey)
        );
        return {
          entityId: entity.entityId,
          encryptedSecurityKey: reEncryptedSecurityKey,
        };
      })
    );
    await axios.patch('/members/role', {
      userId: user.id,
      roleName,
      entities: reEntities,
    });
  }, [newNamespaceName, roleName, members]);

  return (
    <PlotContainer>
      {members.map((user) => (
        <SecretTextDiv key={user.id}>
          <SecretText>
            <SecretNameText>{user.email}</SecretNameText> | {user.roleName} |{' '}
            {user.createdAt?.toString()}
          </SecretText>
        </SecretTextDiv>
      ))}
      <NamespaceBlock>
        <NamespaceNameInput
          value={newNamespaceName}
          onChange={(e) => setNewNamespaceName(e.target.value)}
          placeholder="email"
          type="email"
        />
        <Button
          onClick={async () => {
            const { data } = await axios.post('/members/invites', {
              email: newNamespaceName,
              projectName,
            });
            const link = `${window.location.protocol}//${window.location.host}${data}`;
            await navigator.clipboard.writeText(link);
            alert(`invite link: ${link}`);
          }}
        >
          invite
        </Button>
        <NamespaceNameInput
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="role"
          type="text"
        />
        <Button onClick={() => setRole()}>set role</Button>
      </NamespaceBlock>
    </PlotContainer>
  );
};
