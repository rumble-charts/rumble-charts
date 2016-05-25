import React from 'react';
import _ from 'lodash';
import { storiesOf, action } from '@kadira/storybook';
const {Chart, Transform, Pies} = require('../src');

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

storiesOf('Pies', module)
    .add('default', () =>
        <Chart width={600} height={400} series={series1}>
            <Transform method={['transpose', 'stack']}>
                <Pies combined={true}/>
            </Transform>
        </Chart>
    )
    .add('three series', () =>
        <Chart width={600} height={400} series={series2} minY={0}>
            <Transform method={['transpose', 'stack']}>
                <Pies
                    combined={true}
                    innerPadding='3%'
                    innerRadius='20%'
                />
            </Transform>
        </Chart>
    )
    .add('conical gradient emulation', () =>
        <Chart width={600} height={400} series={series1}>
            <Transform method={['transpose', 'stack']}>
                <Pies
                    combined={true} barWidth='50%'
                    colors={['red', ['green', 'blue'], 'blue']}
                />
            </Transform>
        </Chart>
    )
    .add('fancy and mouse events', () =>
        <Chart width={600} height={400} series={series2}>
            <Transform method={['transpose', 'stackNormalized']}>
                <Pies
                    colors='category10'
                    combined={true}
                    innerRadius='33%'
                    padAngle={0.025}
                    cornerRadius={5}
                    innerPadding={2}
                    pieAttributes={{
                        onMouseMove: (e) => e.target.style.opacity = 1,
                        onMouseLeave: (e) => e.target.style.opacity = 0.5
                    }}
                    pieStyle={{opacity: 0.5}}
                />
            </Transform>
        </Chart>
    )
;
