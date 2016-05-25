import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
const {Chart, Bars, Transform} = require('../src');

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
    data: [1, 2, 3]
}, {
    data: [5, {y: 7, color: 'violet'}, 11]
}, {
    data: [13, 17, 19]
}];


storiesOf('Bars', module)
    .add('default', () => (
        <Chart width={600} height={300} series={series1} minY={0}>
            <Bars />
        </Chart>
    ))
    .add('three series', () =>
        <Chart width={600} height={300} series={series2} minY={0}>
            <Bars />
        </Chart>
    )
    .add('bar styles and mouse events', () =>
        <Chart width={600} height={300} series={series2} minY={0}>
            <Bars
                groupPadding='3%'
                innerPadding='0.5%'
                barAttributes={{
                    onMouseMove: e => e.target.style.fillOpacity = 1,
                    onMouseLeave: e => e.target.style.fillOpacity = 0.25
                }}
                barStyle={{
                    fillOpacity: 0.25,
                    transition: 'all 250ms'
                }}
            />
        </Chart>
    )
    .add('colors', () =>
        <Chart width={600} height={300} series={series3} minY={0}>
            <Bars
                colors='category10'
                innerPadding='0.5%'
                groupPadding='3%'
            />
        </Chart>
    )
    .add('stacked', () =>
        <Chart width={600} height={300} series={series2}>
            <Transform method='stack'>
                <Bars combined={true} innerPadding='2%'/>
            </Transform>
        </Chart>
    )
    .add('stacked and not-combined', () =>
        <Chart width={600} height={300} series={series2}>
            <Transform method='stack'>
                <Bars innerPadding='2%'/>
            </Transform>
        </Chart>
    )
    .add('horizontal stacked', () =>
        <Chart width={600} height={300} series={series2}>
            <Transform method={['stack', 'rotate']}>
                <Bars combined={true} innerPadding='2%'/>
            </Transform>
        </Chart>
    )
;
