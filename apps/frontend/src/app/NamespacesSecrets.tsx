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

const IndentDiv: any = styled.div`
  margin-left: ${(props: any) => props.level * 15}px;
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

export const NamespacesSecrets = () => {
  const [data, setData] = useState<any>([]);
  const [inputs, setInputs] = useState({});
  const [newNamespaceName, setNewNamespaceName] = useState('');
  const { sub } = useOutletContext<{ sub: string }>();
  const [decryptedSecrets, setDecryptedSecrets] = useState<{
    [key: string]: string;
  }>({});
  const [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const members = (await axios(`/members`)).data;
        const user = members.find((member: any) => member.id === sub);
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
    (namespace: any, level: number, path: string) => {
      const handleChange = (id: any, type: any, value: any) => {
        setInputs((prev: any) => ({
          ...prev,
          [id]: { ...prev[id], [type]: value },
        }));
      };

      const handleCreateNamespace = (namespaceId: string) =>
        createNamespace(
          (inputs as any)[namespaceId]?.name,
          publicKey,
          namespaceId
        );

      const handleCreateSecret = (namespaceId: string) =>
        createSecret(
          (inputs as any)[namespaceId]?.name,
          (inputs as any)[namespaceId]?.value,
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
            {namespace.secrets.map((secret: any) => (
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
                  {secret.createdAt}
                </SecretText>
              </SecretTextDiv>
            ))}
            <div>
              <NamespaceNameInput
                value={(inputs as any)[namespace.id]?.name || ''}
                onChange={(e) =>
                  handleChange(namespace.id, 'name', e.target.value)
                }
                placeholder="name"
              />
              <Button onClick={() => handleCreateNamespace(namespace.id)}>
                add namespace
              </Button>
              <Input
                value={(inputs as any)[namespace.id]?.value || ''}
                onChange={(e) =>
                  handleChange(namespace.id, 'value', e.target.value)
                }
                placeholder="value"
              />
              <Button onClick={() => handleCreateSecret(namespace.id)}>
                add secret
              </Button>
            </div>
            {namespace.children.map((child: any) =>
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
        const namespaces = (await axios('/namespaces')).data;
        const secrets = (await axios('/secrets')).data;

        const namespaceMap: any = new Map(
          namespaces.map((ns: any) => [
            ns.id,
            { ...ns, children: [], secrets: [] },
          ])
        );

        secrets.forEach((secret: any) => {
          if (namespaceMap.has(secret.namespaceId))
            namespaceMap.get(secret.namespaceId).secrets.push(secret);
        });

        const tree: any = [];
        namespaceMap.forEach((ns: any) => {
          if (ns.parentId === null) tree.push(ns);
          else {
            if (namespaceMap.has(ns.parentId)) {
              const parentNs = namespaceMap.get(ns.parentId);
              if (!parentNs.children) parentNs.children = [];
              parentNs.children.push(ns);
            }
          }
        });

        setData(tree);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <PageBock>
      {data.map((child: any) => renderNamespace(child, 1, ''))}
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
