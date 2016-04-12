'use strict';

const React = require('react'),
    _ = require('lodash'),
    d3 = require('d3'),
    cloud = require('d3-cloud'),
    helpers = require('./helpers');

const Dots = React.createClass({

    displayName: 'Cloud',

    propTypes: {
        seriesIndex: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.array,
            React.PropTypes.func
        ]),
        series: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            color: React.PropTypes.string,
            opacity: React.PropTypes.number,
            style: React.PropTypes.object,
            data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
                React.PropTypes.number,
                React.PropTypes.arrayOf(React.PropTypes.number),
                React.PropTypes.shape({
                    x: React.PropTypes.number,
                    y: React.PropTypes.number,
                    color: React.PropTypes.string,
                    opacity: React.PropTypes.number,
                    style: React.PropTypes.object
                })
            ]))
        })),
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        colors: React.PropTypes.oneOfType([
            React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            React.PropTypes.arrayOf(React.PropTypes.string),
            React.PropTypes.func
        ]),
        opacity: React.PropTypes.number,
        style: React.PropTypes.object,
        className: React.PropTypes.string,

        font: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        minFontSize: React.PropTypes.number,
        maxFontSize: React.PropTypes.number,
        fontStyle: React.PropTypes.oneOfType([React.PropTypes.oneOf([
            'normal', 'italic', 'oblique', 'inherit'
        ]), React.PropTypes.func]),
        fontWeight: React.PropTypes.oneOfType([React.PropTypes.oneOf([
            'normal', 'bold', 'bolder', 'lighter', 'normal',
            '100', '200', '300', '400', '500', '600', '700', '800', '900'
        ]), React.PropTypes.func]),
        rotate: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.func]),
        spiral: React.PropTypes.oneOfType([React.PropTypes.oneOf([
            'archimedean', 'rectangular'
        ]), React.PropTypes.func]),
        padding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.func]),
        random: React.PropTypes.func,

        label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        labelFormat: React.PropTypes.func,

        labelVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        labelAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        labelStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        minX: React.PropTypes.number,
        maxX: React.PropTypes.number,
        minY: React.PropTypes.number,
        maxY: React.PropTypes.number
    },

    // init

    getInitialState() {
        return {
            labels: [],
            series: []
        };
    },

    getDefaultProps() {
        return {
            colors: 'category20',
            seriesVisible: true,
            labelVisible: true,

            font: 'serif',
            minFontSize: 10,
            maxFontSize: 100,
            fontStyle: 'normal',
            fontWeight: 'normal',
            rotate: 0,
            spiral: 'archimedean',
            padding: 1,
            random: Math.random
        };
    },

    // helpers

    buildCloud(props) {
        const {layerWidth, layerHeight, series} = props;
        const {font, fontStyle, fontWeight, rotate, spiral, padding, random} = props;

        const scale = d3.scale.linear()
            .range([props.minFontSize, props.maxFontSize])
            .domain([props.minY, props.maxY]);

        let words = _.reduce(series, (words, {data}, seriesIndex) => {
            _.each(data, (point, pointIndex) => {
                words.push(_.defaults({
                    text: point.label,
                    size: point.y,
                    seriesIndex,
                    pointIndex
                }, point));
            });
            return words;
        }, []);

        cloud()
            .size([layerWidth, layerHeight])
            .words(words)
            .font(font)
            .fontStyle(fontStyle)
            .fontWeight(fontWeight)
            .rotate(rotate)
            .spiral(spiral)
            .padding(padding)
            .random(random)
            .timeInterval(15)
            .fontSize(d => scale(d.size))
            .on('end', function (series, labels) {
                labels = _.map(
                    _.groupBy(labels, 'seriesIndex'),
                    labels => _.sortBy(labels, 'pointIndex')
                );
                this.setState({series, labels});
            }.bind(this, series))
            .start();
    },

    // lifecycle

    componentWillMount() {
        try {
            this.buildCloud(this.props);
        } catch (e) {
            console.warn(e);
        }
    },

    componentWillReceiveProps(nextProps) {
        try {
            this.buildCloud(nextProps);
        } catch (e) {
            console.warn(e);
        }
    },

    // render

    render: function () {
        const {props, state} = this;
        const {className, style, layerWidth, layerHeight, opacity} = props;

        const color = helpers.colorFunc(props.colors);

        return <g className={className} style={style} opacity={opacity}
                  transform={'translate(' + (layerWidth / 2) + ',' + (layerHeight / 2) + ')'}>
            {_.map(state.series, (series, seriesIndex) => {

                let {seriesVisible, seriesStyle, seriesAttributes} = props;

                seriesVisible = helpers.value(seriesVisible, {seriesIndex, series, props});
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, {seriesIndex, series, props});
                seriesStyle = helpers.value(seriesStyle, {seriesIndex, series, props});

                return <g
                    key={seriesIndex}
                    className={className && (className + '-series ' + className + '-series-' + seriesIndex)}
                    style={seriesStyle}
                    opacity={series.opacity}
                    {...seriesAttributes}>
                    {_.map(series.data, (point, pointIndex) => {

                        let {labelVisible, labelAttributes, labelStyle} = props;
                        let label = state.labels[seriesIndex][pointIndex];
                        if (!label) {
                            return;
                        }

                        labelVisible = helpers.value(labelVisible, {
                            seriesIndex, pointIndex, point, label, series, props
                        });

                        if (!labelVisible) {
                            return;
                        }

                        labelAttributes = helpers.value(labelAttributes, {
                            seriesIndex, pointIndex, point, label, series, props
                        });
                        labelStyle = helpers.value([point.style, series.style, labelStyle],
                            {seriesIndex, pointIndex, point, label, series, props}
                        );

                        return <g
                            key={pointIndex}
                            className={className && (className + '-label ' + className + '-label-' + + pointIndex)}
                            style={{
                                fontSize: label.size + 'px',
                                fontFamily: label.font
                            }}>
                            <text
                                transform={'translate(' + label.x + ',' + label.y + ')'}
                                fill={point.color || series.color || color(seriesIndex)}
                                fillOpacity={point.opacity}
                                textAnchor='middle'
                                style={labelStyle}
                                {...labelAttributes}>
                                {label.text}
                            </text>
                        </g>;
                    })}

                </g>;
            })}
        </g>;
    }

});

module.exports = Dots;
