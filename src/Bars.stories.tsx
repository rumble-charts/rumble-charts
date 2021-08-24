import type {ComponentStory, ComponentMeta} from '@storybook/react';
import type {BarsProps} from './Bars';

import React from 'react';

import {Chart} from './Chart';
import {Bars} from './Bars';
import {Transform} from './Transform';

export default {
    title: 'Components/Graphics/Bars',
    component: Bars
} as ComponentMeta<typeof Bars>;

const series1 = [{
    data: [1, 2, 4]
}];

const series2 = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

const series3 = [{
    data: [1, 2, 3]
}, {
    data: [5, {y: 7, color: 'violet'}, 11]
}, {
    data: [13, 17, 19]
}];

const Template: ComponentStory<typeof Bars> = (args) => <Chart width={600} height={300}>
    <Bars {...args} />
</Chart>;

export const Story1 = Template.bind({});
Story1.storyName = 'default';
Story1.args = {
    series: series1,
    minY: 0
};

export const Story2 = Template.bind({});
Story2.storyName = 'three series';
Story2.args = {
    series: series2,
    minY: 0
};

export const Story3 = Template.bind({});
Story3.storyName = 'without minY';
Story3.args = {
    series: series2
};

export const Story4 = Template.bind({});
Story4.storyName = 'bar styles and mouse events';
Story4.args = {
    series: series2,
    minY: 0,
    groupPadding: '3%',
    innerPadding: '0.5%',
    barAttributes: {
        onMouseMove: e => e.target.style.fillOpacity = 1,
        onMouseLeave: e => e.target.style.fillOpacity = 0.25
    },
    barStyle: {
        fillOpacity: 0.25,
        transition: 'all 250ms'
    }
};
Story4.parameters = {
    playroom: {
        code: `
<Chart
  layerWidth={600}
  layerHeight={300}
  series={${JSON.stringify(series2)}}
  minY={0}
>
  <Bars
    groupPadding="3%"
    innerPadding="0.5%"
    barAttributes={{
      onMouseMove: e => e.target.style.fillOpacity = 1,
      onMouseLeave: e => e.target.style.fillOpacity = 0.25
    }}
    barStyle={{
      fillOpacity: 0.25,
      transition: 'all 250ms'
    }}
  />
</Chart>
`.trim()
    }
};

export const Story5 = Template.bind({});
Story5.storyName = 'colors';
Story5.args = {
    series: series3,
    minY: 0,
    colors: 'category10',
    innerPadding: '0.5%',
    groupPadding: '3%'
};

export const Story6: ComponentStory<typeof Bars> = ({series, ...args}: BarsProps) => (
    <Chart width={600} height={300} series={series}>
        <Transform method='stack'>
            <Bars {...args} />
        </Transform>
    </Chart>
);
Story6.storyName = 'stacked';
Story6.args = {
    series: series2,
    combined: true,
    innerPadding: '2%'
};

export const Story7: ComponentStory<typeof Bars> = ({series, ...args}: BarsProps) => (
    <Chart width={600} height={300} series={series}>
        <Transform method='stack'>
            <Bars {...args} />
        </Transform>
    </Chart>
);
Story7.storyName = 'stacked and not-combined';
Story7.args = {
    series: series2,
    innerPadding: '2%'
};

export const Story8: ComponentStory<typeof Bars> = ({series, ...args}: BarsProps) => (
    <Chart width={600} height={300} series={series}>
        <Transform method={['stack', 'rotate']}>
            <Bars {...args} />
        </Transform>
    </Chart>
);
Story8.storyName = 'horizontal stacked';
Story8.args = {
    series: series2,
    combined: true,
    innerPadding: '2%'
};
