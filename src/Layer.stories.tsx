import type {ComponentMeta, ComponentStory} from '@storybook/react';
import type {LayerProps} from './Layer';

import React from 'react';

import {Chart} from './Chart';
import {Layer} from './Layer';
import {Transform} from './Transform';
import {Pies} from './Pies';
import {Bars} from './Bars';

export default {
    title: 'Components/Wrappers/Layer',
    component: Layer
} as ComponentMeta<typeof Layer>;

const series = [{
    data: [1, 2, 4]
}];

export const Story1: ComponentStory<typeof Layer> = ({...args}: LayerProps) => (
    <Chart width={600} height={300} series={series} minY={0}>
        <Transform method={['transpose']}>
            <Layer width='80%' height='80%'>
                <Bars />
            </Layer>
            <Layer {...args}>
                <Transform method='stack'>
                    <Pies
                        combined={true} colors='category10'
                        pieStyle={{opacity: 0.8}}
                    />
                </Transform>
            </Layer>
        </Transform>
    </Chart>
);
Story1.storyName = 'default';
Story1.args = {
    width: '33%',
    height: '33%',
    position: 'right bottom'
};
