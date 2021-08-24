import type {ComponentMeta, ComponentStory} from '@storybook/react';
import type {HandlersProps} from './Handlers';

import React from 'react';

import {Chart, Layer, Handlers, Lines, Dots} from './index';

export default {
    title: 'Components/Wrappers/Handlers',
    component: Handlers
} as ComponentMeta<typeof Handlers>;

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

export const Story1: ComponentStory<typeof Handlers> = ({...args}: HandlersProps) => {
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

    function handleMouseMove({closestPoints}) {
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

    return (
        <Chart width='100%' height='100%' layerWidth={600} layerHeight={400} series={series} minY={0}>
            <Layer width='100%' height='90%' position='bottom center'>
                <Handlers {...args} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                    <Lines lineWidth={2} />
                    <Dots className='dots' dotStyle={{transition: 'all 250ms', fillOpacity: 0}} />
                </Handlers>
            </Layer>
        </Chart>
    );
};
Story1.storyName = 'onMouseMove and onMouseLeave';
Story1.args = {
    optimized: false,
};
