import React from 'react';
import {ComponentMeta, Story} from '@storybook/react';
import Filters from '../docs/examples/filters';

import type {MouseEvent} from './index';

import {Chart, Bars, Lines, Layer, Handlers, Dots, Ticks, ChartProps} from './index';

const series2 = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

const series3 = [{
    data: [10, 11, 12, 13, 12, 12, 15, 16, 15, 17, 18, 20]
}];

export default {
    title: 'Components/Chart',
    component: Chart
} as ComponentMeta<typeof Chart>;

export const General: Story<ChartProps> = (args) => (
    <Chart {...args}>
        <Bars />
    </Chart>
);
General.storyName = 'General';
General.args = {
    width: 600,
    height: 300,
    series: series2,
    minY: 0
};
General.parameters = {
    playroom: {
        code: `
<Chart layerWidth={600} layerHeight={400} minY={0} series={${JSON.stringify(series2)}}>
  <Bars />
</Chart>
`.trim()
    }
};

export const Story2: Story<ChartProps> = (args) => (
    <Chart {...args}>
        <Lines />
    </Chart>
);
Story2.storyName = 'Using scaleX and scaleY';
Story2.args = {
    width: 600,
    height: 300,
    series: series2,
    minY: 0,
    scaleX: {paddingStart: 0, paddingEnd: 0},
    scaleY: {paddingTop: 10}
};

export const Story3: Story<ChartProps> = (args) => {
    let hovered = null;

    function hideHovered() {
        if (hovered && hovered.circle) {
            hovered.circle.setAttribute('r', hovered.radius);
            hovered.circle.style.fillOpacity = hovered.opacity;
            if (hovered.label) {
                hovered.label.style.display = 'none';
            }
        }
    }

    function handleMouseMove({closestPoints}: MouseEvent) {
        const closest = closestPoints[0];
        if (!closest) {
            return;
        }
        const {seriesIndex, pointIndex} = closest;
        const circle = document.querySelector(`circle.dots-circle-${seriesIndex}-${pointIndex}`) as SVGCircleElement;
        if (!circle) {
            return;
        }
        hideHovered();
        const label = document.querySelector(`.labels-label-${seriesIndex}-${pointIndex}`) as SVGTextElement;
        hovered = {circle, label, radius: circle.getAttribute('r'), opacity: circle.style.fillOpacity};
        circle.setAttribute('r', '5');
        circle.style.fillOpacity = '1';
        if (label) {
            label.style.display = 'block';
        }
    }

    function handleMouseLeave() {
        hideHovered();
    }

    const months = ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];

    return (
        <Chart {...args}>
            <Handlers onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} optimized={false} distance='x'>
                <Layer width='100%' height='68%' position='middle center'>
                    <Bars
                        colors={['#03a9f4']}
                        groupPadding='1%'
                        innerPadding='0%'
                        barWidth='0%'
                        barAttributes={{
                            strokeLinejoin: 'round',
                            strokeWidth: 21,
                            stroke: '#f5f5f6',
                            transform: 'translate(0 12)'
                        }}
                    />
                    <Lines
                        colors={['#007696']}
                        lineWidth={0}
                        interpolation='cardinal'
                        lineAttributes={{
                            strokeLinecap: 'round',
                            strokeWidth: 5
                        }}
                    />
                    <Dots
                        className='dots'
                        colors={['#007696']}
                        dotStyle={{transition: 'all 250ms', fillOpacity: 0}}
                    />
                    <Ticks
                        axis='x'
                        ticks={months.map((label, x) => ({x, label}))}
                        lineVisible={false}
                        labelStyle={{
                            textAnchor: 'middle',
                            dominantBaseline: 'text-after-edge',
                            fill: '#000',
                            fontFamily: 'sans-serif',
                            fontWeight: 'normal',
                            fontSize: 10
                        }}
                        labelAttributes={{y: '2.5em'}}
                    />
                </Layer>
            </Handlers>
        </Chart>
    );
};
Story3.storyName = 'responsive';
Story3.args = {
    viewBox: '0 0 300 150',
    series: series3
};

export const Story4: Story<ChartProps> = (args) => (
    <Filters args={args} />
);
Story4.storyName = 'filters';
Story4.args = {
    width: 600,
    height: 400,
    minY: 0
};
