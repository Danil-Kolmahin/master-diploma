import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsAccessibility from 'highcharts/modules/accessibility.js';
import HighchartsVenn from 'highcharts/modules/venn.js';

HighchartsAccessibility(Highcharts);
HighchartsVenn(Highcharts);

const options = {
  title: { text: '' },
  credits: { enabled: false },
  tooltip: {
    headerFormat:
      '<span style="color:{point.color}">\u2022</span><span style="font-size: 14px"> {point.point.name}</span><br/>',
    pointFormat: '{point.longDescription}',
  },
  series: [
    {
      type: 'venn',
      data: [
        {
          sets: ['local'],
          value: 100,
          longDescription: 'PORT=8090\nPV_KEY=test',
        },
        {
          sets: ['qa'],
          value: 100,
        },
        {
          sets: ['prod'],
          value: 100,
        },
        {
          sets: ['local', 'qa'],
          value: 50,
        },
        {
          sets: ['qa', 'prod'],
          value: 50,
        },
        {
          sets: ['prod', 'local'],
          value: 50,
        },
        {
          sets: ['local', 'qa', 'prod'],
          value: 50,
        },
        {
          sets: ['dev1'],
          value: 10,
        },
        {
          sets: ['dev2'],
          value: 10,
        },
        {
          sets: ['dev3'],
          value: 10,
        },
        {
          sets: ['local', 'dev1'],
          value: 10,
        },
        {
          sets: ['local', 'dev2'],
          value: 10,
        },
        {
          sets: ['local', 'dev3'],
          value: 10,
        },
        {
          sets: ['dev1', 'dev2'],
          value: 5,
        },
        {
          sets: ['dev2', 'dev3'],
          value: 5,
        },
        {
          sets: ['dev3', 'dev1'],
          value: 5,
        },
        {
          sets: ['dev1', 'dev2', 'dev3'],
          value: 5,
        },
      ],
    },
  ],
};

export const Chart = () => {
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
