import type {TicksProps} from './Ticks';

import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {Chart} from './Chart';
import {Bars} from './Bars';
import {Layer} from './Layer';
import {Ticks} from './Ticks';

export default {
    title: 'Components/Graphics/Ticks',
    component: Ticks
} as ComponentMeta<typeof Ticks>;

const series = [{
    name: 'John',
    data: [1, 2, 3]
}, {
    name: 'Jane',
    data: [5, 7, 11]
}, {
    name: 'James',
    data: [13, 17, 19]
}];

const Template: ComponentStory<typeof Ticks> = ({series, minY, ...args}: TicksProps) => (
    <Chart width={600} height={300} series={series} minY={minY} style={{fontFamily: 'sans-serif', fontSize: '0.75em'}}>
        <Layer width='80%' height='90%' position='top center'>
            <Ticks
                {...args}
            />
            <Ticks
                axis='x'
                label={({index, props}) => props.series[index].name}
                labelStyle={{textAnchor: 'middle', dominantBaseline: 'text-before-edge', fill: 'lightgray'}}
                labelAttributes={{y: 3}}
            />
            <Bars
                groupPadding='3%'
                innerPadding='0.5%'
            />
        </Layer>
    </Chart>
);

export const Story1 = Template.bind({});
Story1.storyName = 'default';
Story1.args = {
    series: series,
    minY: 0,
    axis: 'y',
    lineLength: '100%',
    lineVisible: true,
    lineStyle: {stroke: 'lightgray'},
    labelStyle: {textAnchor: 'end', dominantBaseline: 'middle', fill: 'lightgray'},
    labelAttributes: {x: -5}
};
