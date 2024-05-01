import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import {
  decryptData,
  decryptSymmetricKey,
  encryptData,
  encryptSymmetricKey,
  generateSymmetricKey,
  getPublicKeyFromString,
} from './utils/key-pair';
import { useOutletContext } from 'react-router-dom';
import { getFromDB } from './utils/indexed-db';
import {
  AuthDataI,
  MembersDtoI,
  NamespaceDtoI,
  SecretI,
} from '@master-diploma/shared-resources';

const NamespacePath = styled.span`
  font-size: 18px;
  color: blue;
`;

const NamespaceName = styled(NamespacePath)`
  font-weight: bold;
`;

const NamespaceBlock = styled.div`
  margin-top: 10px;
  margin-bottom: 4px;
`;

const PageBock = styled.div`
  margin-left: 5px;
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

const IndentDiv = styled.div`
  margin-left: ${(props: { level: number }) => props.level * 15}px;
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

interface NamespaceTreeI extends NamespaceDtoI {
  children: NamespaceTreeI[];
  secrets: SecretI[];
}

export const NamespacesSecrets = () => {
  const [namespacesTree, setNamespacesTree] = useState<NamespaceTreeI[]>([]);
  const [inputs, setInputs] = useState<{
    [key: string]: { name: string; value: string };
  }>({});
  const [newNamespaceName, setNewNamespaceName] = useState('');
  const { sub } = useOutletContext<AuthDataI>();
  const [decryptedSecrets, setDecryptedSecrets] = useState<{
    [key: string]: string;
  }>({});
  const [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const members: MembersDtoI[] = (await axios(`/members`)).data;
        const user = members.find((member) => member.id === sub) as MembersDtoI;
        setPublicKey(user.publicKey);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [sub]);

  const createNamespace = useCallback(
    async (name: string, publicKey: string, parentId?: string) => {
      const symmetricKey = await generateSymmetricKey();
      const encryptedSecurityKey = await encryptSymmetricKey(
        symmetricKey,
        await getPublicKeyFromString(publicKey)
      );
      await axios.post('/namespaces', { name, encryptedSecurityKey, parentId });
    },
    []
  );

  const createSecret = useCallback(
    async (
      name: string,
      data: string,
      namespaceId: string,
      encryptedSecurityKey: string
    ) => {
      const symmetricKey = await decryptSymmetricKey(
        encryptedSecurityKey,
        await getFromDB()
      );
      const encryptedValue = await encryptData(data, symmetricKey);
      await axios.post('/secrets', { name, encryptedValue, namespaceId });
    },
    []
  );

  const decryptAndShowSecret = useCallback(
    async (
      encryptedValue: string,
      encryptedSecurityKey: string,
      secretId: string
    ) => {
      if (decryptedSecrets[secretId]) return;

      const symmetricKey = await decryptSymmetricKey(
        encryptedSecurityKey,
        await getFromDB()
      );
      const decryptedValue = await decryptData(encryptedValue, symmetricKey);
      setDecryptedSecrets((prev) => ({ ...prev, [secretId]: decryptedValue }));
    },
    [decryptedSecrets]
  );

  const renderNamespace = useCallback(
    (namespace: NamespaceTreeI, level = 1, path = '') => {
      const handleChange = (id: string, type: string, value: string) => {
        setInputs((prev) => ({
          ...prev,
          [id]: { ...prev[id], [type]: value },
        }));
      };

      const handleCreateNamespace = (namespaceId: string) =>
        createNamespace(inputs[namespaceId]?.name, publicKey, namespaceId);

      const handleCreateSecret = (namespaceId: string) =>
        createSecret(
          inputs[namespaceId]?.name,
          inputs[namespaceId]?.value,
          namespaceId,
          namespace.encryptedSecurityKey
        );

      return (
        <div key={namespace.id}>
          <NamespaceBlock>
            <NamespacePath>{path}/</NamespacePath>
            <NamespaceName>{namespace.name}</NamespaceName>
          </NamespaceBlock>
          <IndentDiv level={level}>
            {namespace.secrets.map((secret) => (
              <SecretTextDiv key={secret.id}>
                <SecretText
                  onClick={() =>
                    decryptAndShowSecret(
                      secret.encryptedValue,
                      namespace.encryptedSecurityKey,
                      secret.id
                    )
                  }
                >
                  <SecretNameText>{secret.name}</SecretNameText> |{' '}
                  {decryptedSecrets[secret.id] || secret.encryptedValue} |{' '}
                  {secret.createdAt?.toString()}
                </SecretText>
              </SecretTextDiv>
            ))}
            <div>
              <NamespaceNameInput
                value={inputs[namespace.id]?.name || ''}
                onChange={(e) =>
                  handleChange(namespace.id, 'name', e.target.value)
                }
                placeholder="name"
              />
              <Button onClick={() => handleCreateNamespace(namespace.id)}>
                add namespace
              </Button>
              <Input
                value={inputs[namespace.id]?.value || ''}
                onChange={(e) =>
                  handleChange(namespace.id, 'value', e.target.value)
                }
                placeholder="value"
              />
              <Button onClick={() => handleCreateSecret(namespace.id)}>
                add secret
              </Button>
            </div>
            {namespace.children.map((child) =>
              renderNamespace(child, level + 1, path + '/' + namespace.name)
            )}
          </IndentDiv>
        </div>
      );
    },
    [
      inputs,
      setInputs,
      publicKey,
      createNamespace,
      createSecret,
      decryptedSecrets,
      decryptAndShowSecret,
    ]
  );

  useEffect(() => {
    (async () => {
      try {
        const namespaces: NamespaceDtoI[] = (await axios('/namespaces')).data;
        const secrets: SecretI[] = (await axios('/secrets')).data;

        const namespaceMap: Record<string, NamespaceTreeI> = namespaces.reduce(
          (acc, cur) => ({
            ...acc,
            [cur.id]: { ...cur, children: [], secrets: [] },
          }),
          {}
        );

        secrets.forEach((secret) => {
          if (namespaceMap[secret.namespaceId])
            namespaceMap[secret.namespaceId].secrets.push(secret);
        });

        const tree: NamespaceTreeI[] = [];
        Object.values(namespaceMap).forEach((ns) => {
          if (ns.parentId === null) tree.push(ns);
          else {
            if (namespaceMap[ns.parentId || '']) {
              const parentNs = namespaceMap[ns.parentId || ''];
              if (!parentNs.children) parentNs.children = [];
              parentNs.children.push(ns);
            }
          }
        });
        setNamespacesTree(tree);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <PageBock>
      {namespacesTree.map((child) => renderNamespace(child))}
      <NamespaceBlock>
        <NamespaceNameInput
          value={newNamespaceName}
          onChange={(e) => setNewNamespaceName(e.target.value)}
          placeholder="name"
        />
        <Button onClick={() => createNamespace(newNamespaceName, publicKey)}>
          add namespace
        </Button>
      </NamespaceBlock>
    </PageBock>
  );
};
