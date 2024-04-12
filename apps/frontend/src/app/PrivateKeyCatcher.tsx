import { ChangeEvent, useCallback, DragEvent } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { getTextFromFile } from './utils/file-management';
import { getPrivateKeyFromFile } from './utils/key-pair';
import { getFromDB, saveToDB } from './utils/indexed-db';
import { useNavigate, useParams } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Box = styled.div`
  border: 1px solid;
  border-image: repeating-linear-gradient(
      135deg,
      #ccc,
      #ccc 10px,
      transparent 10px,
      transparent 20px
    )
    1 round;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 175px;
  height: 175px;
`;

const KeyButton = styled.label`
  font-family: 'Courier', monospace;
  font-size: 12px;
  font-weight: 400;

  border: none;
  background: none;
  color: black;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: blue;
    outline: none;
  }
`;

export const PrivateKeyCatcher = () => {
  const { email, projectName } = useParams();
  const navigate = useNavigate();

  const catchFiles = useCallback(
    async (fileList: FileList) => {
      try {
        if (fileList.length < 1) return;
        const file = fileList.item(0) as File;
        if (file.name.slice(-4) !== '.pem') return;
        const fileText = await getTextFromFile(file);
        const privateKey = await getPrivateKeyFromFile(fileText);
        saveToDB(privateKey);

        const encryptedChallenge = (
          await axios.post('/sign-in/challenge-request', {
            email,
            projectName,
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
          email,
          projectName,
          challenge,
        });

        navigate('/');
      } catch (error) {
        navigate('/auth');
      }
    },
    [email, projectName, navigate]
  );

  return (
    <Container
      onDrop={(event: DragEvent<HTMLDivElement>) =>
        catchFiles(event.dataTransfer.files)
      }
    >
      <HiddenFileInput
        type="file"
        id="privateKey"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          event.target.files ? catchFiles(event.target.files) : undefined
        }
        multiple={false}
      />
      <Box>
        <KeyButton htmlFor="privateKey">private key</KeyButton>
      </Box>
    </Container>
  );
};
