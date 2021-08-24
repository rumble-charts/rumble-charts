import type {ComponentStory, ComponentMeta} from '@storybook/react';
import type {RadialLinesProps} from './RadialLines';

import React from 'react';

import {Chart} from './Chart';
import {Transform} from './Transform';
import {RadialLines} from './RadialLines';

export default {
    title: 'Components/Graphics/RadialLines',
    component: RadialLines
} as ComponentMeta<typeof RadialLines>;

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

const Template: ComponentStory<typeof RadialLines> = ({series, minY, ...args}: RadialLinesProps) => (
    <Chart width={600} height={400} series={series} minY={minY}>
        <RadialLines {...args} />
    </Chart>
);

export const Story1 = Template.bind({});
Story1.storyName = 'default';
Story1.args = {
    series: series,
    minY: 0,
    lineWidth: 2
};

export const Story2 = Template.bind({});
Story2.storyName = 'linear interpolation';
Story2.args = {
    series: series,
    minY: 0,
    lineWidth: 2,
    interpolation: 'linear-closed'
};

export const Story3: ComponentStory<typeof RadialLines> = ({series, minY, ...args}: RadialLinesProps) => (
    <Chart width={600} height={400} series={series} minY={minY}>
        <Transform method='stack'>
            <RadialLines {...args} />
        </Transform>
    </Chart>
);
Story3.storyName = 'areas';
Story3.args = {
    series: series,
    minY: 0,
    asAreas: true,
    innerRadius: '20%',
    interpolation: 'linear-closed',
};
