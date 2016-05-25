import React from 'react';
import _ from 'lodash';
import { storiesOf, action } from '@kadira/storybook';
const {Chart, Transform, Bars, Title} = require('../src');

const series = [{
    data: [1, 2, 4]
}];

storiesOf('Title', module)
    .add('default', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Transform method={['transpose']}>
                <Bars />
                <Title position='middle center' style={{textAnchor:'middle'}}>
                    Chart Title
                </Title>
            </Transform>
        </Chart>
    )
    .add('callback title', () =>
        <Chart width={600} height={300}>
            <Title position='center middle'>
                {props => <text style={{textAnchor:'middle'}}>
                    {props.layerWidth + 'x' + props.layerHeight}
                </text>}
            </Title>
        </Chart>
    )
;
