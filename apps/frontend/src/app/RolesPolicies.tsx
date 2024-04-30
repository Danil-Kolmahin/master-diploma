import styled from '@emotion/styled';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export const RolesPolicies = () => {
  const [data, setData] = useState<string[]>([]);
  const [newNamespaceName, setNewNamespaceName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/roles');
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <PlotContainer>
      {data.map((role: string) => (
        <SecretTextDiv
          key={role}
          onClick={() => navigate(`/roles-policies/${role}`)}
        >
          <SecretText>
            <SecretNameText>{role}</SecretNameText>
          </SecretText>
        </SecretTextDiv>
      ))}
      <NamespaceBlock>
        <NamespaceNameInput
          value={newNamespaceName}
          onChange={(e) => setNewNamespaceName(e.target.value)}
          placeholder="role name"
          type="text"
        />
        <Button onClick={() => navigate(`/roles-policies/${newNamespaceName}`)}>
          create
        </Button>
      </NamespaceBlock>
    </PlotContainer>
  );
};
