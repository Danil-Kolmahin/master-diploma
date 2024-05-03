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
import { Bold, Button, Input } from './styles/styles';

const Invite = styled.div`
  margin-top: 10px;
  margin-bottom: 4px;
  & > * {
    margin-right: 15px;
    margin-top: 5px;
  }
`;

const User = styled.div`
  margin-top: 3px;
  font-size: 14px;
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
    <>
      {members.map((user) => (
        <User key={user.id}>
          <Bold>{user.email}</Bold> | {user.roleName} |{' '}
          {user.createdAt?.toString()}
        </User>
      ))}
      <Invite>
        <Input
          widthCharsNum={20}
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
        <Input
          widthCharsNum={20}
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="role"
          type="text"
        />
        <Button onClick={() => setRole()}>set role</Button>
      </Invite>
    </>
  );
};
