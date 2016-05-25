import React from 'react';
import _ from 'lodash';
import { storiesOf, action } from '@kadira/storybook';
const {Chart, Lines, Transform} = require('../src');

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

storiesOf('Lines', module)
    .add('default', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Lines />
        </Chart>
    )
    .add('using scaleX and scaleY', () =>
        <Chart
            width={600} height={300} series={series} minY={0}
            scaleX={{paddingStart: 0, paddingEnd: 0}}
            scaleY={{paddingTop: 10}}>
            <Lines />
        </Chart>
    )
    .add('stacked area chart', () =>
        <Chart
            width={600} height={300} series={series} minY={0}
            scaleX={{paddingStart: 0, paddingEnd: 0}}
            scaleY={{paddingTop: 10}}>
            <Transform method='stack'>
                <Lines asAreas={true}/>
            </Transform>
        </Chart>
    )
;
