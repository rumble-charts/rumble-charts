import React from 'react';
import {storiesOf} from '@storybook/react';
const {Chart, Bars, Lines, Layer, Handlers, Dots, Ticks} = require('../src');
const Filters = require('../docs/examples/filters');

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

const series3 = [{
    data: [10, 11, 12, 13, 12, 12, 15, 16, 15, 17, 18, 20]
}];

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
    const circle = document.querySelector(`circle.dots-circle-${seriesIndex}-${pointIndex}`);
    if (!circle) {
        return;
    }
    hideHovered();
    const label = document.querySelector(`.labels-label-${seriesIndex}-${pointIndex}`);
    hovered = {circle, label, radius: circle.getAttribute('r'), opacity: circle.style.fillOpacity};
    circle.setAttribute('r', 5);
    circle.style.fillOpacity = 1;
    if (label) {
        label.style.display = 'block';
    }
}

function handleMouseLeave() {
    hideHovered();
}

const months = ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN']

storiesOf('Chart', module)
    .add('default', () =>
        <Chart width={600} height={300} series={series2}>
            <Bars />
        </Chart>
    )
    .add('using scaleX and scaleY', () =>
        <Chart
            width={600} height={300} series={series2} minY={0}
            scaleX={{paddingStart: 0, paddingEnd: 0}}
            scaleY={{paddingTop: 10}}>
            <Lines />
        </Chart>
    )
    .add('filters', () =>
        <Filters />
    )
    .add('responsive', () =>
        <div style={{paddingLeft: '10em', marginTop: '5em'}}>
            <Chart viewBox='0 0 300 150' series={series3}>
                <Layer width='100%' height='68%' position='middle center'>
                    <Handlers onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} optimized={false}>
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
                    </Handlers>
                </Layer>
            </Chart>
        </div>
    );
