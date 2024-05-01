import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { POLICY_ACTIONS } from '@master-diploma/shared-resources';

const Table = styled.table`
  width: 80%;
  margin: 20px auto;
`;

const Th = styled.th`
  border: 1px solid #ccc; // Light grey border for header cells
  background-color: #f4f4f4; // Light background for headers
  padding: 8px; // Padding inside the header cells
  text-align: left; // Aligns text to the left
`;

const Td = styled.td`
  border: 1px solid #ccc; // Light grey border for data cells
  padding: 8px; // Padding inside data cells
  text-align: center; // Centers the content of the cell
`;

const Tr = styled.tr`
  &:nth-of-type(even) {
    background-color: #f9f9f9; // Zebra striping for rows
  }
`;

const Input = styled.input`
  padding: 0px;
  margin: 0px;
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

export const Role = () => {
  const [namespaces, setNamespaces] = useState<any[]>([]);
  const { roleName } = useParams();

  useEffect(() => {
    const fetchNamespaces = async () => {
      try {
        const { data: namespaces } = await axios('/namespaces');
        const {
          data: { policies },
        } = await axios(`/roles/${roleName}`);
        const formattedNamespaces = namespaces.map((namespace: any) => ({
          ...namespace,
          permissions: {
            [POLICY_ACTIONS.READ]: !!policies.find(
              (policy: any) =>
                policy[0] === namespace.id && policy[1] === POLICY_ACTIONS.READ
            ),
            [POLICY_ACTIONS.WRITE]: !!policies.find(
              (policy: any) =>
                policy[0] === namespace.id && policy[1] === POLICY_ACTIONS.WRITE
            ),
            [POLICY_ACTIONS.DELETE]: !!policies.find(
              (policy: any) =>
                policy[0] === namespace.id &&
                policy[1] === POLICY_ACTIONS.DELETE
            ),
          },
        }));
        setNamespaces(formattedNamespaces);
      } catch (error) {
        console.error('Error fetching namespaces:', error);
      }
    };

    fetchNamespaces();
  }, []);

  const togglePermission = (id: string, permission: any) => {
    setNamespaces(
      namespaces.map((namespace: any) => {
        if (namespace.id === id) {
          return {
            ...namespace,
            permissions: {
              ...namespace.permissions,
              [permission]: !namespace.permissions[permission],
            },
          };
        }
        return namespace;
      })
    );
  };

  return (
    <div>
      <Table>
        <thead>
          <Tr>
            <Th>object</Th>
            <Th>{POLICY_ACTIONS.READ}</Th>
            <Th>{POLICY_ACTIONS.WRITE}</Th>
            <Th>{POLICY_ACTIONS.DELETE}</Th>
          </Tr>
        </thead>
        <tbody>
          {namespaces.map((namespace) => (
            <Tr key={namespace.id}>
              <Td>{namespace.name}</Td>
              <Td>
                <Input
                  type="checkbox"
                  checked={namespace.permissions[POLICY_ACTIONS.READ]}
                  onChange={() =>
                    togglePermission(namespace.id, POLICY_ACTIONS.READ)
                  }
                />
              </Td>
              <Td>
                <Input
                  type="checkbox"
                  checked={namespace.permissions[POLICY_ACTIONS.WRITE]}
                  onChange={() =>
                    togglePermission(namespace.id, POLICY_ACTIONS.WRITE)
                  }
                />
              </Td>
              <Td>
                <Input
                  type="checkbox"
                  checked={namespace.permissions[POLICY_ACTIONS.DELETE]}
                  onChange={() =>
                    togglePermission(namespace.id, POLICY_ACTIONS.DELETE)
                  }
                />
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      <Button
        onClick={async () => {
          const policies = [];
          for (const { id, permissions } of namespaces) {
            if (permissions[POLICY_ACTIONS.READ])
              policies.push([id, POLICY_ACTIONS.READ]);
            if (permissions[POLICY_ACTIONS.WRITE])
              policies.push([id, POLICY_ACTIONS.WRITE]);
            if (permissions[POLICY_ACTIONS.DELETE])
              policies.push([id, POLICY_ACTIONS.DELETE]);
          }
          await axios.post('/roles', { roleName, policies });
        }}
      >
        save
      </Button>
    </div>
  );
};
