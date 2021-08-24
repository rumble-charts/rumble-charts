import type {ComponentStory, ComponentMeta} from '@storybook/react';
import type {LinesProps} from './Lines';

import React from 'react';

import {Chart} from './Chart';
import {Transform} from './Transform';
import {Ticks} from './Ticks';
import {Layer} from './Layer';
import {Lines} from './Lines';

export default {
    title: 'Components/Graphics/Lines',
    component: Lines
} as ComponentMeta<typeof Lines>;

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

const Template: ComponentStory<typeof Lines> = ({series, minY, scaleX, scaleY, ...args}: LinesProps) => (
    <Chart width={600} height={300} series={series} minY={minY} scaleX={scaleX} scaleY={scaleY}>
        <Lines {...args} />
    </Chart>
);

export const Story1 = Template.bind({});
Story1.storyName = 'default';
Story1.args = {
    series: series,
    minY: 0
};


export const Story2 = Template.bind({});
Story2.storyName = 'using scaleX and scaleY';
Story2.args = {
    series: series,
    minY: 0,
    scaleX: {paddingStart: 0, paddingEnd: 0},
    scaleY: {paddingTop: 10},
};

export const Story3: ComponentStory<typeof Lines> = ({series, minY, scaleX, scaleY, ...args}: LinesProps) => (
    <Chart width={600} height={300} series={series} minY={minY} scaleX={scaleX} scaleY={scaleY}>
        <Transform method='stack'>
            <Lines {...args} />
        </Transform>
    </Chart>
);
Story3.storyName = 'stacked area chart';
Story3.args = {
    series: series,
    minY: 0,
    scaleX: {paddingStart: 0, paddingEnd: 0},
    scaleY: {paddingTop: 10},
    asAreas: true,
};

export const Story4: ComponentStory<typeof Lines> = ({series, minY, scaleX, scaleY, ...args}: LinesProps) => (
    <Chart width={600} height={300} series={series} minY={minY} scaleX={scaleX} scaleY={scaleY}>
        <Layer height='80%' width='90%' seriesIndex={[2, 1, 0]}>
            <Lines {...args} />
            <Ticks
                axis='y'
                labelAttributes={{fontFamily: 'sans-serif', x: -5}}
                labelStyle={{textAnchor: 'end', dominantBaseline: 'middle'}}
                lineVisible={({index}) => index === 0}
                lineStyle={{stroke: 'rgba(255,255,255,0.3)'}}
                lineLength='100%'
            />
        </Layer>
    </Chart>
);
Story4.storyName = 'area chart with minY = 0';
Story4.args = {
    series: series,
    minY: 0,
    scaleX: {paddingStart: 0, paddingEnd: 0},
    scaleY: {paddingTop: 10},
    asAreas: true,
};
