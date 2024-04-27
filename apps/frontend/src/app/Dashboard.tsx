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
  const [secrets, setSecrets] = useState<{ name: string }[][]>([]);

  useEffect(() => {
    (async () => {
      const allNamespacesRes = await axios('/namespaces/all');
      const allSecretsRes = await Promise.all(
        allNamespacesRes.data.map(
          (namespace: { id: string; name: string; parentId: string }) =>
            axios(`/secrets/all/${namespace.id}`)
        )
      );

      setNamespaces(allNamespacesRes.data);
      setSecrets(allSecretsRes.map((res) => res.data));
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
            text: secrets.map((namespaceSecrets) =>
              namespaceSecrets.reduce(
                (acc, { name }) => acc + '<br>' + name,
                ''
              )
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
