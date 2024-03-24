import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

require('highcharts/modules/accessibility.js')(Highcharts)
require('highcharts/modules/venn.js')(Highcharts)

const options = {
  title: { text: '' },
  credits: { enabled: false },
  series: [{
    type: 'venn',
    data: [{
      sets: ['A'],
      value: 4,
      name: 'Euler diagrams',
    }, {
      sets: ['B'],
      value: 1,
      name: 'Venn diagrams',
    }, {
      sets: ['A', 'B'],
      value: 1
    }]
  }],
}

const GlobalStyle = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }
`;

const StyledApp = styled.div`
  font-family: 'Courier', monospace;
  font-size: 12px;
  font-weight: 400;
  display: table;
  width: 100%;
  height: 100vh;
`;

const Sidebar = styled.div`
  display: table-cell;
  width: 300px;
  border-right: 1px solid rgb(192, 192, 192);
  box-shadow: 0.25px 0px 0px 0px rgb(192, 192, 192);
  padding: 10px;
  vertical-align: top;

  hr {
    margin-bottom: 10px;
  }
`;

const Content = styled.div`
  display: table-cell;
  padding: 10px;
`;

const SidebarItem = styled.span`
  display: block;
  margin-bottom: 10px;
  text-align: center;
`;

export function App() {
  return (
    <>
      <Global styles={GlobalStyle} />
      <StyledApp>
        <Sidebar>
          <SidebarItem>some.user@example.com</SidebarItem>
          <SidebarItem>MyProject</SidebarItem>
          <hr />
          <b>
            <SidebarItem>namespaces - secrets-variables</SidebarItem>
          </b>
          <SidebarItem>applications - integrations-bridges</SidebarItem>
          <SidebarItem>members</SidebarItem>
          <SidebarItem>roles - permissions</SidebarItem>
          <SidebarItem>projects</SidebarItem>
          <SidebarItem>log out</SidebarItem>
        </Sidebar>
        <Content>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        </Content>
      </StyledApp>
    </>
  );
}

export default App;
