import type {ComponentStory, ComponentMeta} from '@storybook/react';
import type {PiesProps} from './Pies';

import React from 'react';

import {Chart} from './Chart';
import {Transform} from './Transform';
import {Pies} from './Pies';

export default {
    title: 'Components/Graphics/Pies',
    component: Pies
} as ComponentMeta<typeof Pies>;

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

const Template: ComponentStory<typeof Pies> = ({series, minY, transformMethod, ...args}: PiesProps) => (
    <Chart width={600} height={400} series={series} minY={minY}>
        <Transform method={transformMethod}>
            <Pies {...args} />
        </Transform>
    </Chart>
);

export const Story1 = Template.bind({});
Story1.storyName = 'default';
Story1.args = {
    series: series1,
    className: 'pie',
    transformMethod: ['transpose', 'stack'],
    combined: true,
};

export const Story2 = Template.bind({});
Story2.storyName = 'three series';
Story2.args = {
    series: series2,
    minY: 0,
    transformMethod: ['transpose', 'stack'],
    combined: true,
    innerPadding: '3%',
    innerRadius: '20%',
};

export const Story3 = Template.bind({});
Story3.storyName = 'conical gradient emulation';
Story3.args = {
    series: series1,
    transformMethod: ['transpose', 'stack'],
    combined: true,
    barWidth: '50%',
    colors: ['red', ['green', 'blue'], 'blue'],
};

export const Story4 = Template.bind({});
Story4.storyName = 'fancy and mouse events';
Story4.args = {
    series: series2,
    transformMethod: ['transpose', 'stackNormalized'],
    colors: 'category10',
    combined: true,
    innerRadius: '33%',
    padAngle: 0.025,
    cornerRadius: 5,
    innerPadding: 2,
    pieAttributes: {
        onMouseMove: (e) => e.target.style.opacity = 1,
        onMouseLeave: (e) => e.target.style.opacity = 0.5
    },
    pieStyle: {opacity: 0.5}
};
