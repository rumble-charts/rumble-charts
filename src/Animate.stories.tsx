import type {ComponentMeta, ComponentStory} from '@storybook/react';
import type {AnimateProps} from './Animate';

import React, {useState} from 'react';

import {Chart, Bars, Layer, Animate, Ticks, Lines, Dots, Labels} from './index';
import {eases, generateRandomSeries} from './helpers';

export default {
    title: 'Components/Wrappers/Animate',
    component: Animate,
    argTypes: {
        ease: {
            options: Object.keys(eases)
        }
    }
} as ComponentMeta<typeof Animate>;

const generateSeries = () => generateRandomSeries(3, 7, {type: 'number', max: 100, float: true});

export const Story1: ComponentStory<typeof Animate> = ({...args}: AnimateProps) => {
    const [series, setSeries] = useState(generateSeries);
    return (
        <Chart
            onClick={() => setSeries(generateSeries())}
            width={600} height={400} series={series} minY={0} maxY={100}>
            <Layer width='90%' height='90%' position='middle center'>
                <Animate {...args}>
                    <Bars
                        groupPadding='2.5%'
                        innerPadding='0.25%'
                    />
                </Animate>
            </Layer>
        </Chart>
    );
};
Story1.storyName = 'default';
Story1.args = {
    duration: 250,
    logFPS: true,
    interpolateProps: ['series'],
};

export const Story2: ComponentStory<typeof Animate> = ({...args}: AnimateProps) => {
    const [series, setSeries] = useState(generateSeries);
    return (
        <Chart
            onClick={() => setSeries(generateSeries())}
            width='100%' height='100%'
            layerWidth={600} layerHeight={400} series={series} minY={0} maxY={100}>
            <Layer width='90%' height='90%' position='middle center'>
                <Animate {...args}>
                    <Ticks
                        className='yt'
                        axis='y'
                        ticks={{maxTicks: 4}}
                        tickVisible={({tick}) => tick.y > 0}
                        lineLength='100%'
                        lineVisible={true}
                        lineStyle={{stroke: 'lightgray'}}
                        labelStyle={{
                            textAnchor: 'end',
                            dominantBaseline: 'middle',
                            fontSize: '0.75em',
                            fill: 'lightgray'
                        }}
                        labelAttributes={{x: -5}}
                    />
                    <Ticks
                        axis='x'
                        label={({tick}) => tick.x + 1}
                        labelStyle={{
                            textAnchor: 'middle',
                            dominantBaseline: 'text-before-edge',
                            fontSize: '0.75em',
                            fill: 'lightgray'
                        }}
                        labelAttributes={{y: 3}}
                    />
                    <Bars
                        groupPadding='2%'
                        innerPadding='0.5%'
                    />
                    <Lines />
                    <Dots />
                    <Labels
                        label={({point}) => Math.round(point.y)}
                        dotStyle={{
                            dominantBaseline: 'text-after-edge',
                            textAnchor: 'middle'
                        }}
                    />
                </Animate>
            </Layer>
        </Chart>
    );
};
Story2.storyName = 'complex';
Story2.args = {
    duration: 1000,
    ease: 'elastic',
    logFPS: true,
    interpolateProps: ['series', 'maxY'],
};
