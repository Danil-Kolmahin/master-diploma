import styled from '@emotion/styled';
import axios from 'axios';
import { useCallback, useState } from 'react';
import {
  extractPrivateKey,
  extractPublicKey,
  generateKeyPair,
} from './utils/key-pair';
import { saveFile } from './utils/file-management';
import { useNavigate, useParams } from 'react-router-dom';

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

const Input = styled.input`
  padding: 7px;
  margin-right: 25px;
  width: calc(40ch + 20px);
  border: 1px solid #ccc;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border: 1px solid #ccc;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
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

const Divider = styled.span`
  margin: 0 15px;
`;

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const { inviteToken } = useParams();
  const navigate = useNavigate();

  const signIn = useCallback(
    async (email: string, projectName: string) => {
      try {
        navigate(`/private-key-catcher/${email}/${projectName}`);
      } catch (error) {
        console.error(error);
      }
    },
    [navigate]
  );

  const signUp = useCallback(
    async (email: string, projectName: string) => {
      try {
        let keyPair: CryptoKeyPair | null = await generateKeyPair();
        await axios.post(
          inviteToken ? `/sign-up/from-invite/${inviteToken}` : '/sign-up',
          {
            email,
            publicKey: await extractPublicKey(keyPair.publicKey),
            projectName,
          }
        );
        saveFile(
          await extractPrivateKey(keyPair.privateKey),
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
      <Form>
        <FormGroup>
          <Label htmlFor="email">email</Label>
          <Input
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
