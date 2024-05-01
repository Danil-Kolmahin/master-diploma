import styled from '@emotion/styled';
import { NamespaceDtoI, SecretI } from '@master-diploma/shared-resources';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const PlotContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Dashboard = () => {
  const [namespaces, setNamespaces] = useState<NamespaceDtoI[]>([]);
  const [secrets, setSecrets] = useState<SecretI[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const namespacesResponse = await axios('/namespaces');
        const secretsResponse = await axios('/secrets');

        setNamespaces(namespacesResponse.data);
        setSecrets(secretsResponse.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  if (!namespaces.length) return <PlotContainer>no data</PlotContainer>;
  return (
    <PlotContainer>
      <Plot
        data={[
          {
            type: 'treemap',
            labels: namespaces.map(({ name }) => name),
            parents: namespaces.map(
              ({ parentId }) =>
                namespaces.find(({ id }) => parentId === id)?.name || ''
            ),
            text: namespaces.map(({ id }) =>
              secrets
                .filter(({ namespaceId }) => namespaceId === id)
                .reduce((acc, { name }) => acc + '<br>' + name, '')
            ),
            textinfo: 'label+text',
          },
        ]}
        layout={{
          modebar: { remove: ['toImage'] },
          colorway: ['lightgray', 'darkblue', 'gray', 'blue', 'darkgray'],
          margin: { t: 0, b: 0, l: 0, r: 0, pad: 0 },
        }}
        config={{ displaylogo: false }}
        useResizeHandler={true}
        style={{ width: '80%', height: '80%' }}
      />
    </PlotContainer>
  );
};
