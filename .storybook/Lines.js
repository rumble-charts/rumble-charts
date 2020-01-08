import React from 'react';
import {storiesOf} from '@storybook/react';
import {Chart, Lines, Transform, Layer, Ticks} from '../src';

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
                <Lines asAreas={true} />
            </Transform>
        </Chart>
    )
    .add('area chart with minY = 0', () =>
        <Chart
            width={600} height={300} series={series} minY={1}
            scaleX={{paddingStart: 0, paddingEnd: 0}}
            scaleY={{paddingTop: 10}}>
            <Layer height='80%' seriesIndex={[2, 1, 0]}>
                <Lines asAreas={true} />
                <Ticks
                    axis='y'
                    labelAttributes={{fontFamily: 'sans-serif'}}
                    lineVisible={({index}) => index === 0}
                    lineStyle={{stroke: 'black'}}
                    lineLength='100%'
                />
            </Layer>
        </Chart>
    )
;
