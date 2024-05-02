import styled from '@emotion/styled';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from './styles/styles';

const NamespaceBlock = styled.div`
  margin-top: 10px;
  margin-bottom: 4px;
  & > * {
    margin-right: 15px;
    margin-top: 5px;
  }
`;

const Role = styled.div`
  font-size: 14px;
  margin-top: 3px;
  font-weight: bold;
`;

export const RolesPolicies = () => {
  const [rolesNames, setRolesNames] = useState<string[]>([]);
  const [newNamespaceName, setNewNamespaceName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/roles/names');
        setRolesNames(response.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <>
      {rolesNames.map((roleName) => (
        <Role
          key={roleName}
          onClick={() => navigate(`/roles-policies/${roleName}`)}
        >
          {roleName}
        </Role>
      ))}
      <NamespaceBlock>
        <Input
          widthCharsNum={20}
          value={newNamespaceName}
          onChange={(e) => setNewNamespaceName(e.target.value)}
          placeholder="role name"
          type="text"
        />
        <Button onClick={() => navigate(`/roles-policies/${newNamespaceName}`)}>
          create
        </Button>
      </NamespaceBlock>
    </>
  );
};
