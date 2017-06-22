import React from 'react';
import { storiesOf } from '@storybook/react';
const {Chart, Transform, Layer, Bars, Pies} = require('../src');

const series = [{
    data: [1, 2, 4]
}];

storiesOf('Layer', module)
    .add('default', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Transform method={['transpose']}>
                <Layer width='80%' height='80%'>
                    <Bars />
                </Layer>
                <Layer width='33%' height='33%' position='right bottom'>
                    <Transform method='stack'>
                        <Pies
                            combined={true} colors='category10'
                            pieStyle={{opacity: 0.8}}
                        />
                    </Transform>
                </Layer>
            </Transform>
        </Chart>
    )
;
