import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {Chart} from './Chart';
import {Layer} from './Layer';
import {Dots} from './Dots';

export default {
    title: 'Components/Graphics/Dots',
    component: Dots
} as ComponentMeta<typeof Dots>;

const series1 = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

const series2 = [{
    data: [{y: 1, weight: 2}, {y: 2, weight: 3}, {y: 3, weight: 2}]
}, {
    data: [{y: 5, weight: 13}, {y: 7, weight: 7}, {y: 11, weight: 2}]
}, {
    data: [{y: 13, weight: 9}, {y: 17, weight: 6}, {y: 19, weight: 4}]
}];

const Template: ComponentStory<typeof Dots> = (args) => <Chart width={600} height={300}>
    <Layer width='90%' height='90%'>
        <Dots {...args} />
    </Layer>
</Chart>;

export const Story1 = Template.bind({});
Story1.storyName = 'default';
Story1.args = {
    series: series1,
    minY: 0
};

export const Story2 = Template.bind({});
Story2.storyName = 'scatter plot';
Story2.args = {
    series: series2,
    minY: 0,
    circleRadius: ({point}) => point.weight
};

export const Story3 = Template.bind({});
Story3.storyName = 'combined types';
Story3.args = {
    series: series1,
    minY: 0,
    dotType: ['circle', 'symbol'],
    symbolType: 'cross',
    symbolAttributes: {fill: 'white'},
    circleRadius: 6
};

