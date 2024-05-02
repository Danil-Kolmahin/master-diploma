import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import {
  symmetricStrDecrypt,
  symmetricStrEncrypt,
  genSymmetricKey,
  str2asymmetricPubKey,
  symmetricKey2str,
  asymmetricStrEncrypt,
  asymmetricStrDecrypt,
  str2symmetricKey,
} from './utils/key-pair';
import { useOutletContext } from 'react-router-dom';
import { getFromDB } from './utils/indexed-db';
import {
  AuthDataI,
  MembersDtoI,
  NamespaceDtoI,
  SecretI,
} from '@master-diploma/shared-resources';
import { Button, Input } from './styles/styles';

const Page = styled.div`
  margin-left: 5px;
`;

const NamespaceTitle = styled.div`
  margin-top: 10px;
  margin-bottom: 4px;
`;

const NamespacePath = styled.span`
  font-size: 18px;
  color: blue;
`;

const NamespaceName = styled(NamespacePath)`
  font-weight: bold;
`;

const NewNamespace = styled.div`
  margin-top: 10px;
  margin-bottom: 4px;
`;

const Indent = styled.div`
  margin-left: ${(props: { level: number }) => props.level * 15}px;
`;

const Secrets = styled.div`
  margin-top: 3px;
  & > * {
    font-size: 14px;
  }
`;

const AddNew = styled.div`
  & > * {
    margin-right: 15px;
    margin-top: 5px;
  }
`;

const SecretName = styled.span`
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
        const user = members.find((member) => member.id === sub);
        setPublicKey(user?.publicKey || '');
      } catch (error) {
        console.error(error);
      }
    })();
  }, [sub]);

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

  const createNamespace = useCallback(
    async (name: string, publicKey: string, parentId?: string) => {
      const symmetricKey = await genSymmetricKey();
      const strSymmetricKey = await symmetricKey2str(symmetricKey);
      const encryptedSecurityKey = await asymmetricStrEncrypt(
        strSymmetricKey,
        await str2asymmetricPubKey(publicKey)
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
      const securityKey = await asymmetricStrDecrypt(
        encryptedSecurityKey,
        await getFromDB()
      );
      const symmetricKey = await str2symmetricKey(securityKey);
      const encryptedValue = await symmetricStrEncrypt(data, symmetricKey);
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
      const securityKey = await asymmetricStrDecrypt(
        encryptedSecurityKey,
        await getFromDB()
      );
      const symmetricKey = await str2symmetricKey(securityKey);
      const decryptedValue = await symmetricStrDecrypt(
        encryptedValue,
        symmetricKey
      );
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
          <NamespaceTitle>
            <NamespacePath>{path}/</NamespacePath>
            <NamespaceName>{namespace.name}</NamespaceName>
          </NamespaceTitle>
          <Indent level={level}>
            {namespace.secrets.map((secret) => (
              <Secrets
                key={secret.id}
                onClick={() =>
                  decryptAndShowSecret(
                    secret.encryptedValue,
                    namespace.encryptedSecurityKey,
                    secret.id
                  )
                }
              >
                <SecretName>{secret.name}</SecretName> |{' '}
                {decryptedSecrets[secret.id] || secret.encryptedValue} |{' '}
                {secret.createdAt?.toString()}
              </Secrets>
            ))}
            <AddNew>
              <Input
                widthCharsNum={20}
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
            </AddNew>
            {namespace.children.map((child) =>
              renderNamespace(child, level + 1, path + '/' + namespace.name)
            )}
          </Indent>
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

  return (
    <Page>
      {namespacesTree.map((child) => renderNamespace(child))}
      <NewNamespace>
        <Input
          widthCharsNum={20}
          value={newNamespaceName}
          onChange={(e) => setNewNamespaceName(e.target.value)}
          placeholder="name"
        />
        <Button onClick={() => createNamespace(newNamespaceName, publicKey)}>
          add namespace
        </Button>
      </NewNamespace>
    </Page>
  );
};
