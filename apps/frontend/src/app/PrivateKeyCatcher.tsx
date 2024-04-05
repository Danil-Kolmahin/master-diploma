import { ChangeEvent, useCallback } from 'react';
import styled from '@emotion/styled';

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
  ) 1 round;
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
  const onFileDrop = useCallback((event: any) => {
    const files = event.dataTransfer.files;
    // Process the files as needed
  }, []);

  const onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    // Process the files as needed
  };

  return (
    <Container onDrop={onFileDrop}>
      <HiddenFileInput
        type="file"
        id="privateKey"
        onChange={onFileSelect}
        multiple={false}
      />
      <Box>
        <KeyButton htmlFor="privateKey">private key</KeyButton>
      </Box>
    </Container>
  );
};
