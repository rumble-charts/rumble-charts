import React from 'react';
import {storiesOf} from '@storybook/react';
import {Chart, Layer, Dots, Labels} from '../src';

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

storiesOf('Labels', module)
    .add('default', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Layer width='95%' height='85%' position='center bottom'>
                <Dots />
                <Labels
                    label={({point}) => ('y=' + point.y)}
                    dotStyle={{
                        textAnchor: 'middle',
                        dominantBaseline: 'text-after-edge',
                        fontFamily: 'sans-serif',
                        fontSize: '0.65em'
                    }}
                    labelAttributes={{
                        y: -4
                    }}
                />
            </Layer>
        </Chart>
    )
;
