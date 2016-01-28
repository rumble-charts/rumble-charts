'use strict';

var React = require('react'),
    _ = require('lodash'),
    d3 = require('d3'),
    cloud = require('d3-cloud'),
    helpers = require('./helpers');

var Dots = React.createClass({

    displayName: 'Dots',

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
        colors: React.PropTypes.oneOfType([
            React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            React.PropTypes.arrayOf(React.PropTypes.string),
            React.PropTypes.func
        ]),
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
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func])
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
        const { layerWidth, layerHeight, series } = props;
        const { font, fontStyle, fontWeight, rotate, spiral, padding, random } = props;
        const { minFontSize, maxFontSize, minY, maxY } = props;

        const scale = d3.scale.linear().range([minFontSize, maxFontSize]).domain([minY, maxY]);

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
                this.setState({series, labels: _.groupBy(labels, 'seriesIndex')});
            }.bind(this, series))
            .start();
    },

    // lifecycle

    componentWillMount() {
        try {
            this.buildCloud(this.props);
        } catch (e) {
        }
    },

    componentWillReceiveProps(nextProps) {
        try {
            this.buildCloud(nextProps);
        } catch (e) {
        }
    },

    // render

    render: function () {
        const { props, state } = this;
        let { className, style, colors, layerWidth, layerHeight } = props;

        const color = helpers.colorFunc(colors);

        /* jshint ignore:start */
        return <g className={className} style={style}
                  transform={'translate(' + (layerWidth / 2) + ',' + (layerHeight / 2) + ')'}>
            {_.map(state.series, (series, seriesIndex) => {

                let { seriesVisible, seriesStyle, seriesAttributes } = props;

                seriesVisible = helpers.value(seriesVisible, {seriesIndex, series, props});
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, {seriesIndex, series, props});
                seriesStyle = helpers.value(seriesStyle, {seriesIndex, series, props});

                return <g
                    key={seriesIndex}
                    className={className && (className + '-series ' + className + '-series-' + index)}
                    style={seriesStyle}
                    {...seriesAttributes}>
                    {_.map(series.data, (point, pointIndex) => {

                        let { labelVisible, labelAttributes, labelStyle } = props;
                        let label = state.labels[seriesIndex][pointIndex];
                        if (!label) {
                            return;
                        }

                        labelVisible = helpers.value(labelVisible, {seriesIndex, pointIndex, point, label, props});

                        if (!labelVisible) {
                            return;
                        }

                        labelAttributes = helpers.value(labelAttributes, {
                            seriesIndex, pointIndex, point, label, props
                        });
                        labelStyle = helpers.value([{
                            fontSize: label.size + 'px',
                            fontFamily: label.font
                        }, point.style, labelStyle], {seriesIndex, pointIndex, point, label, props});

                        return <text
                            key={pointIndex}
                            className={className && (className + '-label ' +
                            className + '-label-' + seriesIndex + '-' + pointIndex)}
                            transform={'translate(' + label.x + ',' + label.y + ')'}
                            fill={point.color || series.color || color(seriesIndex)}
                            fillOpacity={_.isUndefined(point.opacity) ? series.opacity : point.opacity}
                            textAnchor='middle'
                            style={labelStyle}
                            {...labelAttributes}>
                            {label.text}
                        </text>
                    })}

                </g>;
            })}
        </g>;
        /* jshint ignore:end */
    }

});

module.exports = Dots;
