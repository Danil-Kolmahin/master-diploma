import styled from '@emotion/styled';

export const Button = styled.button`
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

export const Input = styled.input<{ padding?: number; widthCharsNum?: number }>`
  padding: ${(props) => props.padding || 3}px;
  width: calc(${(props) => props.widthCharsNum || 40}ch + 20px);
  border: 1px solid #ccc;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border: 1px solid #ccc;
  }
`;

export const Table = styled.table`
  width: 80%;
  margin: 20px auto;
`;

export const Th = styled.th`
  border: 1px solid #ccc;
  background-color: #f4f4f4;
  padding: 8px;
  text-align: left;
`;

export const Td = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
`;

export const Tr = styled.tr`
  &:nth-of-type(even) {
    background-color: #f9f9f9;
  }
`;
