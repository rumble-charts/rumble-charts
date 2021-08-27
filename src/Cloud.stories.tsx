import type {ComponentMeta, ComponentStory} from '@storybook/react';
import type {CloudProps} from './Cloud';

import React from 'react';

import {Chart} from './Chart';
import {Cloud} from './Cloud';
import {Transform} from './Transform';

export default {
    title: 'Components/Graphics/Cloud',
    component: Cloud
} as ComponentMeta<typeof Cloud>;

const series = [{
    data: [
        {label: 'Highcharts', y: 30},
        {label: 'amCharts', y: 13},
        {label: 'Google Charts', y: 31},
        {label: 'ChartJS', y: 15},
        {label: 'TauCharts', y: 8},
        {label: 'FusionCharts', y: 2},
        {label: 'ZingChart', y: 2},
        {label: 'uvCharts', y: 1},
        {label: 'jQuery Sparklines', y: 1},
        {label: 'Ember Charts', y: 2},
        {label: 'Canvas.js', y: 16},
        {label: 'Flot', y: 1},
        {label: 'D3.js', y: 27},
        {label: 'n3-charts', y: 3},
        {label: 'NVD3', y: 3},
        {label: 'Chartist.js', y: 3},
        {label: 'C3.js', y: 14},
        {label: 'Cubism.js', y: 1},
        {label: 'Rickshaw', y: 2}
    ]
}];

export const General: ComponentStory<typeof Cloud> = ({series, ...args}: CloudProps) => (
    <Chart width={400} height={400} series={series} minY={0}>
        <Transform method='transpose'>
            <Cloud {...args} />
        </Transform>
    </Chart>
);
General.storyName = 'default';
General.args = {
    series: series,
    font: 'sans-serif',
    minFontSize: 24,
    maxFontSize: 72,
    padding: 2,
};
