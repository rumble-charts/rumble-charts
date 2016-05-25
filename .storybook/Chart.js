import React from 'react';
import _ from 'lodash';
import { storiesOf, action } from '@kadira/storybook';
const {Chart, Bars, Lines} = require('../src');
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
;
