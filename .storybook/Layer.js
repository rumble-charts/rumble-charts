import React from 'react';
import _ from 'lodash';
import { storiesOf, action } from '@kadira/storybook';
const {Chart, Lines} = require('../src');

const series = [{
    data: [1, 3, 2]
}, {
    data: [5, 11, 7]
}, {
    data: [13, 19, 17]
}];

storiesOf('Layer', module)
    .add('default', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Lines />
        </Chart>
    )
;
