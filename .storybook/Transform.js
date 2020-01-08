import React from 'react';
import {storiesOf} from '@storybook/react';
import {Chart, Bars, Transform} from '../src';

const series = [{
    data: [1, 3, 2]
}, {
    data: [5, 11, 7]
}, {
    data: [13, 19, 17]
}];

const props = {
    innerPadding: '0.5%',
    groupPadding: '3%'
};

storiesOf('Transform', module)
    .add('default', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Bars {...props} />
        </Chart>
    )
    .add('transpose', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Transform method='transpose'>
                <Bars {...props} />
            </Transform>
        </Chart>
    )
    .add('rotate', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Transform method='rotate'>
                <Bars {...props} />
            </Transform>
        </Chart>
    )
    .add('transpose + rotate', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Transform method={['transpose', 'rotate']}>
                <Bars {...props} />
            </Transform>
        </Chart>
    )
    .add('reverse', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Transform method='reverse'>
                <Bars {...props} />
            </Transform>
        </Chart>
    )
    .add('transpose + reverse', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Transform method={['transpose', 'reverse']}>
                <Bars {...props} />
            </Transform>
        </Chart>
    )
    .add('stack', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Transform method={['stack']}>
                <Bars {...props} combined={true} />
            </Transform>
        </Chart>
    )
    .add('transpose + stack', () =>
        <Chart width={600} height={300} series={series} minY={0}>
            <Transform method={['transpose', 'stack']}>
                <Bars {...props} combined={true} />
            </Transform>
        </Chart>
    )
;
