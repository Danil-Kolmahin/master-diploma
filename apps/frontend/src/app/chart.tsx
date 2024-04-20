import styled from '@emotion/styled';
import Plot from 'react-plotly.js';

const PlotContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Chart = () => {
  return (
    <PlotContainer>
      <Plot
        data={[
          {
            type: 'treemap',
            labels: [
              'namespace1',
              'namespace2',
              'namespace3',
              'namespace4',
              'namespace5',
            ],
            parents: ['', 'namespace1', 'namespace1', 'namespace2', ''],
            text: [
              'APP_PORT1 APP_PORT1<br>APP_PORT1 APP_PORT1<br>APP_PORT1',
              'APP_PORT2 APP_PORT2<br>APP_PORT2 APP_PORT2<br>APP_PORT2',
              'APP_PORT3 APP_PORT3<br>APP_PORT3 APP_PORT3<br>APP_PORT3',
              'APP_PORT4 APP_PORT4<br>APP_PORT4 APP_PORT4<br>APP_PORT4',
              'APP_PORT5 APP_PORT5<br>APP_PORT5 APP_PORT5<br>APP_PORT5',
            ],
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
