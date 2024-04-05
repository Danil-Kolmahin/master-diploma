import styled from '@emotion/styled';

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
  font-family: 'Courier', monospace;
  font-size: 12px;
  font-weight: 400;

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
  return (
    <Container>
      <Form>
        <FormGroup>
          <Label htmlFor="email">email</Label>
          <Input id="email" type="email" required />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="project">project</Label>
          <Input id="project" type="text" required />
        </FormGroup>
        <ButtonGroup>
          <Button type="submit">sign up</Button>
          <Divider>/</Divider>
          <Button type="submit">sign in</Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};
