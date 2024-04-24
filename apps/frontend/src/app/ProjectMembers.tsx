import styled from '@emotion/styled';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

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
  const [data, setData] = useState<any>([]);
  const [newNamespaceName, setNewNamespaceName] = useState('');
  const [roleName, setRoleName] = useState('');
  const { projectName } = useOutletContext<{
    email: string;
    projectName: string;
  }>();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/members');
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <PlotContainer>
      {data.map((user: any) => (
        <SecretTextDiv key={user.id}>
          <SecretText>
            <SecretNameText>{user.email}</SecretNameText> | {user.roleName} |{' '}
            {user.createdAt}
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
        <NamespaceNameInput
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="role"
          type="text"
        />
        <Button
          onClick={async () => {
            const { data: link } = await axios.post('/invite', {
              email: newNamespaceName,
              projectName,
              roleName,
            });
            await navigator.clipboard.writeText(link);
            alert(`invite link: ${link}`);
          }}
        >
          invite
        </Button>
      </NamespaceBlock>
    </PlotContainer>
  );
};
