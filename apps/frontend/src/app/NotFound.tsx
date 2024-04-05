import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
  width: 350px;
  height: 80px;
`;

export const NotFound = () => {
  return (
    <Container>
      <Box>
        <span>404 not found</span>
      </Box>
    </Container>
  );
};
