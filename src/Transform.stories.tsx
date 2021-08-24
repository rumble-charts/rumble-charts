import type {TransformProps} from './Transform';

import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {Chart} from './Chart';
import {Bars} from './Bars';
import {Transform} from './Transform';

export default {
    title: 'Components/Wrappers/Transform',
    component: Transform,
} as ComponentMeta<typeof Transform>;

const series = [{
    data: [1, 3, 2]
}, {
    data: [5, 11, 7]
}, {
    data: [13, 19, 17]
}];

const Template: ComponentStory<typeof Transform> = ({series, minY, combined, ...args}: TransformProps) => (
    <Chart width={600} height={300} series={series} minY={minY}>
        <Transform {...args}>
            <Bars
                innerPadding={'0.5%'}
                groupPadding={'3%'}
                combined={combined}
            />
        </Transform>
    </Chart>
);

export const Story1 = Template.bind({});
Story1.storyName = 'default';
Story1.args = {
    series: series,
    minY: 0
};

export const Story2 = Template.bind({});
Story2.storyName = 'transpose';
Story2.args = {
    series: series,
    minY: 0,
    method: 'transpose'
};

export const Story3 = Template.bind({});
Story3.storyName = 'rotate';
Story3.args = {
    series: series,
    minY: 0,
    method: 'rotate'
};

export const Story4 = Template.bind({});
Story4.storyName = 'transpose + rotate';
Story4.args = {
    series: series,
    minY: 0,
    method: ['transpose', 'rotate']
};

export const Story5 = Template.bind({});
Story5.storyName = 'reverse';
Story5.args = {
    series: series,
    minY: 0,
    method: 'reverse'
};

export const Story6 = Template.bind({});
Story6.storyName = 'transpose + reverse';
Story6.args = {
    series: series,
    minY: 0,
    method: ['transpose', 'reverse']
};

export const Story7 = Template.bind({});
Story7.storyName = 'stack';
Story7.args = {
    series: series,
    minY: 0,
    method: 'stack',
    combined: true,
};

export const Story8 = Template.bind({});
Story8.storyName = 'transpose + stack';
Story8.args = {
    series: series,
    minY: 0,
    method: ['transpose', 'stack'],
    combined: true,
};

export const Story9 = Template.bind({});
Story9.storyName = 'transpose + rotate + stack';
Story9.args = {
    series: series,
    minY: 0,
    method: ['transpose', 'rotate', 'stack'],
    combined: true,
};
