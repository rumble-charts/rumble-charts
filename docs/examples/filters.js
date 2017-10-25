'use strict';

const React = require('react');
const {scaleOrdinal, schemeCategory10} = require('d3-scale');
const _ = require('lodash');
const {Chart, Pies, Bars, Layer, Transform, Ticks, Labels, Title, Animate} = require('../../src/index');

const points = [{
    country: 'UA',
    title: 'SE',
    value: 2
}, {
    country: 'UA',
    title: 'QA',
    value: 1
}, {
    country: 'IL',
    title: 'QA',
    value: 4
}, {
    country: 'IL',
    title: 'SE',
    value: 12
}, {
    country: 'IL',
    title: 'Manager',
    value: 3
}, {
    country: 'IL',
    title: 'Sales',
    value: 6
}, {
    country: 'US',
    title: 'Manager',
    value: 3
}, {
    country: 'US',
    title: 'Sales',
    value: 2
}];

const metrics = ['country', 'title'];
const groups = {};
metrics.forEach(metric => {
    groups[metric] = _.groupBy(points, metric);
});

const colors = scaleOrdinal(schemeCategory10);

const getSeriesByGroup = (groups, mainMetric, filter) => {
    const group = groups[mainMetric];
    const series = [{data: []}];
    const keys = Object.keys(group);
    keys.forEach(key => {
        let sum = 0;
        group[key].forEach(point => {
            if (!filter[0] || mainMetric === filter[0] || point[filter[0]] === filter[1]) {
                sum += point.value;
            }
        });
        series[0].data.push({
            label: key,
            y: sum
        });
    });
    return series;
};

class Demo extends React.Component {

    constructor() {
        super();

        this.state = {filter: []};

        this.clickFactory = (metric, value) => {
            return () => {
                const {filter} = this.state;
                if (filter[0] === metric && filter[1] === value) {
                    this.setState({filter: []});
                } else {
                    this.setState({filter: [metric, value]});
                }
            };
        };

        this.getPointOpacity = (groupName, point) => {
            const {filter} = this.state;
            return filter[0] === groupName && filter[1] !== point.label ?
                0.25 : (filter[0] === groupName && filter[1] === point.label ? 1 : 0.75);
        };

    }

    render() {
        const {filter} = this.state;

        return <Chart width={600} height={400} minY={0}>
            <Layer
                width='80%' height='80%'
                series={getSeriesByGroup(groups, 'country', filter)}
                position='left middle'>
                <Animate ease='bounce'>
                    <Bars
                        innerPadding='10%'
                        barStyle={({pointIndex, point}) => ({
                            transition: 'fill-opacity 250ms',
                            fill: colors(pointIndex),
                            fillOpacity: this.getPointOpacity('country', point)
                        })}
                        barAttributes={({point}) => ({
                            onClick: this.clickFactory('country', point.label),
                            onMouseMove: e => e.target.style.fillOpacity = 1,
                            onMouseLeave: e => e.target.style.fillOpacity = this.getPointOpacity('country', point)
                        })}
                    />
                    <Labels
                        label={({point}) => Math.round(point.y)}
                        dotStyle={{
                            textAnchor: 'middle'
                        }}
                        dotAttributes={({pointIndex}) => ({
                            fill: colors(pointIndex)
                        })}
                    />
                    <Ticks
                        axis='x'
                        ticks={({series}) => series[0].data}
                        labelStyle={{
                            dominantBaseline: 'text-before-edge',
                            textAnchor: 'middle'
                        }}
                    />
                </Animate>
            </Layer>
            <Layer
                width='30%' height='30%' position='right bottom'
                series={getSeriesByGroup(groups, 'title', filter)}>
                {filter[0] === 'title' && <Title position='center middle'>
                    <text style={{textAnchor: 'middle', dominantBaseline: 'middle'}}>{filter[1]}</text>
                </Title>}
                <Transform method={['transpose', 'stack']}>
                    <Animate ease='bounce'>
                        <Pies
                            combined={true}
                            innerRadius='25%'
                            cornerRadius='0.15%'
                            colors='category20'
                            pieStyle={({point}) => ({
                                transition: 'fill-opacity 250ms',
                                fillOpacity: this.getPointOpacity('title', point)
                            })}
                            pieAttributes={({point}) => ({
                                onClick: this.clickFactory('title', point.label),
                                onMouseMove: e => e.target.style.fillOpacity = 1,
                                onMouseLeave: e => e.target.style.fillOpacity = this.getPointOpacity('title', point)
                            })}
                        />
                    </Animate>
                </Transform>
            </Layer>
        </Chart>;
    }
}

module.exports = Demo;
