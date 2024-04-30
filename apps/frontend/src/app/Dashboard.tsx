import styled from '@emotion/styled';
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
  const [namespaces, setNamespaces] = useState<
    { id: string; name: string; parentId: string }[]
  >([]);
  const [secrets, setSecrets] = useState<
    { name: string; namespaceId: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      const allNamespacesRes = await axios('/namespaces');
      const allSecretsRes = await axios('/secrets');

      setNamespaces(allNamespacesRes.data);
      setSecrets(allSecretsRes.data);
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
