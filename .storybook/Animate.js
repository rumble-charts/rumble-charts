import React from 'react';
import _ from 'lodash';
import { storiesOf } from '@storybook/react';
const {Chart, Bars, Layer, Animate, Ticks, Lines, Dots, Labels} = require('../src');

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

const generateSeries = () => {
    return _.map(_.range(3), index => ({
        data: _.map(_.range(7), index => Math.random() * 100)
    }));
};

const Simple = React.createClass({
    getInitialState() {
        return {
            series: series1
        };
    },
    render() {
        return <Chart
            onClick={() => this.setState({series: generateSeries()})}
            width={600} height={300} series={this.state.series} minY={0}>
            <Layer width='90%' height='90%' position='middle center'>
                <Animate duration={250} logFPS={true}>
                    <Bars
                        groupPadding='2.5%'
                        innerPadding='0.25%'
                    />
                </Animate>
            </Layer>
        </Chart>;
    }
});

const Complex = React.createClass({
    getInitialState() {
        return {
            series: series2
        };
    },

    render() {
        return <Chart
            onClick={() => this.setState({series: generateSeries()})}
            width={600} height={300} series={this.state.series} minY={0}>
            <Layer width='90%' height='90%' position='middle center'>
                <Animate duration={1000} ease='elastic' logFPS={true}>
                    <Ticks
                        axis='y'
                        ticks={{maxTicks: 4}}
                        tickVisible={({tick}) => tick.y > 0}
                        lineLength='100%'
                        lineVisible={true}
                        lineStyle={{stroke: 'lightgray'}}
                        labelStyle={{
                            textAnchor: 'end',
                            dominantBaseline: 'middle',
                            fontSize: '0.75em',
                            fill: 'lightgray'
                        }}
                        labelAttributes={{x: -5}}
                    />
                    <Ticks
                        axis='x'
                        label={({tick}) => tick.x + 1}
                        labelStyle={{
                            textAnchor: 'middle',
                            dominantBaseline: 'text-before-edge',
                            fontSize: '0.75em',
                            fill: 'lightgray'
                        }}
                        labelAttributes={{y: 3}}
                    />
                    <Bars
                        groupPadding='3%'
                        innerPadding='0.5%'
                    />
                    <Lines />
                    <Dots />
                    <Labels
                        label={({point}) => Math.round(point.y)}
                        dotStyle={{
                            dominantBaseline: 'text-after-edge',
                            textAnchor: 'middle'
                        }}
                    />
                </Animate>
            </Layer>
        </Chart>;
    }
});

storiesOf('Animate', module)
    .add('default', () =>
        <Simple />
    )
    .add('complex', () =>
        <Complex />
    )
;
