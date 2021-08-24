import type {ComponentStory, ComponentMeta} from '@storybook/react';
import type {LabelsProps} from './Labels';

import React from 'react';

import {Chart} from './Chart';
import {Dots} from './Dots';
import {Layer} from './Layer';
import {Labels} from './Labels';

export default {
    title: 'Components/Graphics/Labels',
    component: Labels
} as ComponentMeta<typeof Labels>;

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

const Template: ComponentStory<typeof Labels> = ({series, minY, ...args}: LabelsProps) => (
    <Chart width={600} height={300} series={series} minY={minY}>
        <Layer width='95%' height='85%' position='center bottom'>
            <Dots />
            <Labels {...args} />
        </Layer>
    </Chart>
);

export const Story1 = Template.bind({});
Story1.storyName = 'default';
Story1.args = {
    series: series,
    minY: 0,
    label: ({point}) => ('y=' + point.y),
    dotStyle: {
        textAnchor: 'middle',
        dominantBaseline: 'text-after-edge',
        fontFamily: 'sans-serif',
        fontSize: '0.65em'
    },
    labelAttributes: {
        y: -4
    }
};
