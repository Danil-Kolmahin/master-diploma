import styled from '@emotion/styled';
import axios from 'axios';
import { useCallback, useState } from 'react';
import {
  asymmetricPrivKey2str,
  asymmetricPubKey2str,
  genAsymmetricKeyPair,
} from './utils/key-pair';
import { saveFile } from './utils/file-management';
import { useNavigate, useParams } from 'react-router-dom';
import { Bold, BoldNRed, Button, Input, WarningMessage } from './styles/styles';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Form = styled.form`
  border: 1px solid #ccc;
  width: 450px;
  height: 215px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const FormGroup = styled.div`
  display: flex;
  justify-content: space-between; // Separate label and input
  align-items: center;
  width: 100%;
`;

const Label = styled.label`
  text-align: center;
  flex: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Divider = styled.span`
  margin: 0 15px;
`;

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const { inviteToken } = useParams();
  const navigate = useNavigate();

  const signIn = useCallback(
    (email: string, projectName: string) =>
      navigate(`/private-key-catcher/${email}/${projectName}`),
    [navigate]
  );

  const signUp = useCallback(
    async (email: string, projectName: string) => {
      try {
        let keyPair: CryptoKeyPair | null = await genAsymmetricKeyPair();
        await axios.post(
          'members',
          {
            email,
            publicKey: await asymmetricPubKey2str(keyPair.publicKey),
            projectName,
          },
          { params: { inviteToken } }
        );
        saveFile(
          await asymmetricPrivKey2str(keyPair.privateKey),
          'private_key.pem',
          'application/pem-certificate-chain'
        );
        keyPair = null;

        await signIn(email, projectName);
      } catch (error) {
        console.error(error);
      }
    },
    [signIn, inviteToken]
  );

  return (
    <Container>
      <WarningMessage>
        <Bold>
          Important: Ensure your environment is secure before proceeding.
        </Bold>{' '}
        Do not use shared or public computers. Verify that your browser and any
        extensions are secure and up to date.{' '}
        <BoldNRed>Never share your private keys with anyone.</BoldNRed> Failure
        to follow these guidelines may compromise your data security.
      </WarningMessage>
      <Form>
        <FormGroup>
          <Label htmlFor="email">email</Label>
          <Input
            padding={7}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="project">project</Label>
          <Input
            padding={7}
            id="project"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </FormGroup>
        <ButtonGroup>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              if (email && projectName) signUp(email, projectName);
            }}
          >
            sign up
          </Button>
          <Divider>/</Divider>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              if (email && projectName) signIn(email, projectName);
            }}
          >
            sign in
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};
