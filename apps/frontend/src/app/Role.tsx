import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import {
  NamespaceDtoI,
  POLICY_ACTIONS,
  RoleContentDtoI,
} from '@master-diploma/shared-resources';

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

type FormattedNamespacePermissionsI = {
  [key in POLICY_ACTIONS]: boolean;
};

interface FormattedNamespaceI extends NamespaceDtoI {
  permissions: FormattedNamespacePermissionsI;
}

export const Role = () => {
  const [namespaces, setNamespaces] = useState<FormattedNamespaceI[]>([]);
  const { roleName } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const namespacesResponse: AxiosResponse<NamespaceDtoI[]> = await axios(
          '/namespaces'
        );
        const rolesContentResponse: AxiosResponse<RoleContentDtoI> =
          await axios(`/roles/${roleName}`);
        const { policies } = rolesContentResponse.data;
        const formattedNamespaces = namespacesResponse.data.map(
          (namespace) => ({
            ...namespace,
            permissions: Object.values(POLICY_ACTIONS).reduce(
              (acc, cur) => ({
                ...acc,
                [cur]: !!policies.find(
                  ([object, action]) =>
                    object === namespace.id && action === cur
                ),
              }),
              {}
            ) as FormattedNamespacePermissionsI,
          })
        );
        setNamespaces(formattedNamespaces);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [roleName]);

  const togglePermission = useCallback(
    (id: string, action: POLICY_ACTIONS) =>
      setNamespaces(
        namespaces.map((namespace) =>
          namespace.id === id
            ? {
                ...namespace,
                permissions: {
                  ...namespace.permissions,
                  [action]: !namespace.permissions[action],
                },
              }
            : namespace
        )
      ),
    [namespaces]
  );

  return (
    <div>
      <Table>
        <thead>
          <Tr>
            <Th>object</Th>
            {Object.values(POLICY_ACTIONS).map((action) => (
              <Th key={action}>{action}</Th>
            ))}
          </Tr>
        </thead>
        <tbody>
          {namespaces.map((namespace) => (
            <Tr key={namespace.id}>
              <Td>{namespace.name}</Td>
              {Object.values(POLICY_ACTIONS).map((action) => (
                <Td key={action}>
                  <Input
                    type="checkbox"
                    checked={namespace.permissions[action as POLICY_ACTIONS]}
                    onChange={() =>
                      togglePermission(namespace.id, action as POLICY_ACTIONS)
                    }
                  />
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
      <Button
        onClick={async () => {
          const policies: string[][] = [];
          for (const { id, permissions } of namespaces)
            Object.values(POLICY_ACTIONS).forEach((action) => {
              if (permissions[action as POLICY_ACTIONS])
                policies.push([id, action]);
            });
          await axios.post('/roles', { roleName, policies });
        }}
      >
        save
      </Button>
    </div>
  );
};
