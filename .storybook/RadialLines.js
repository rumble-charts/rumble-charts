import React from 'react';
import { storiesOf } from '@storybook/react';
const {Chart, RadialLines, Transform} = require('../src');

const series = [{
    data: [1, 3, 2, 5, 7]
}, {
    data: [5, 11, 7, 13, 19]
}, {
    data: [13, 19, 17, 23, 29]
}];

storiesOf('RadialLines', module)
    .add('default', () =>
        <Chart width={600} height={400} series={series} minY={0}>
            <RadialLines
                lineWidth={2}
            />
        </Chart>
    )
    .add('linear interpolation', () =>
        <Chart width={600} height={400} series={series} minY={0}>
            <RadialLines
                interpolation='linear-closed'
                lineWidth={2}
            />
        </Chart>
    )
    .add('areas', () =>
        <Chart width={600} height={400} series={series} minY={0}>
            <Transform method='stack'>
                <RadialLines
                    asAreas={true}
                    innerRadius='20%'
                    interpolation='linear-closed'
                />
            </Transform>
        </Chart>
    )
;
