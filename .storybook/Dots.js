import React from 'react';
import { storiesOf } from '@storybook/react';
const {Chart, Dots, Layer} = require('../src');

const series1 = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

const series2 = [{
    data: [{y: 1, weight: 2}, {y: 2, weight: 3}, {y: 3, weight: 2}]
}, {
    data: [{y: 5, weight: 13}, {y: 7, weight: 7}, {y: 11, weight: 2}]
}, {
    data: [{y: 13, weight: 9}, {y: 17, weight: 6}, {y: 19, weight: 4}]
}];


storiesOf('Dots', module)
    .add('default', () =>
        <Chart width={600} height={300} series={series1} minY={0}>
            <Layer width='90%' height='90%'>
                <Dots />
            </Layer>
        </Chart>
    )
    .add('scatter plot', () =>
        <Chart width={600} height={300} series={series2} minY={0}>
            <Layer width='90%' height='90%'>
                <Dots circleRadius={({point}) => point.weight}/>
            </Layer>
        </Chart>
    )
    .add('combined types', () =>
        <Chart width={600} height={300} series={series1} minY={0}>
            <Layer width='90%' height='90%'>
                <Dots
                    dotType={['circle', 'symbol']}
                    symbolType='cross'
                    symbolAttributes={{fill: 'white'}}
                    circleRadius={6}
                />
            </Layer>
        </Chart>
    )
;
