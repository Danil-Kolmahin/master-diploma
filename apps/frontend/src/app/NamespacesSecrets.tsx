import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';

const NamespaceName = styled.span`
  margin-bottom: 10px;
  font-size: 18px;
  text-decoration: underline;
  color: blue;
`;

const ActualNamespaceName = styled(NamespaceName)`
  font-weight: bold;
`;

const renderNamespace = (namespace: any) => (
  <div key={namespace.name}>
    <NamespaceName>/</NamespaceName>
    <ActualNamespaceName>{namespace.name}</ActualNamespaceName>
    <br />
    {namespace.secrets.map((secret: any) => (
      <div key={namespace.name + secret.name}>
        <span>* {secret.name}</span>
        <br />
      </div>
    ))}
    <br />
    {namespace.children.map(renderNamespace)}
  </div>
);

export const NamespacesSecrets = () => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    (async () => {
      try {
        const namespaces = (await axios('/namespaces/all')).data;
        const secretsResult = await Promise.all(
          namespaces.map((namespace: any) =>
            axios(`/secrets/all/${namespace.id}`)
          )
        );
        const secrets = secretsResult.map(({ data }) => data).flat();

        const namespaceMap: any = new Map(
          namespaces.map((ns: any) => [
            ns.id,
            { ...ns, children: [], secrets: [] },
          ])
        );

        secrets.forEach((secret) => {
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
        console.log(error);
      }
    })();
  }, []);

  return <>{data.map(renderNamespace)}</>;
};
