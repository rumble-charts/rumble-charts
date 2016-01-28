'use strict';

var React = require('react'),
    _ = require('lodash'),
    d3 = require('d3'),
    helpers = require('./helpers');

var Lines = React.createClass({

    displayName: 'Lines',

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
                    y: React.PropTypes.number
                })
            ]))
        })),
        colors: React.PropTypes.oneOfType([
            React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            React.PropTypes.arrayOf(React.PropTypes.string),
            React.PropTypes.func
        ]),

        asAreas: React.PropTypes.bool,
        interpolation: React.PropTypes.oneOf([
            'linear', 'linear-close', 'step', 'step-before', 'step-after',
            'basis', 'basis-open', 'basis-closed', 'bundle',
            'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone'
        ]),

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        lineVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        lineAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        lineStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        lineWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func])
    },

    // init

    getDefaultProps() {
        return {
            colors: 'category20',
            interpolation: 'monotone',
            seriesVisible: true,
            lineVisible: true,
            lineWidth: 3
        };
    },

    // render

    render: function () {
        let { props } = this;
        let { className, style, scaleX, scaleY, asAreas, colors, series } = props;

        let rotate = scaleX.swap || scaleY.swap;

        let x = scaleX.factory(props);
        let y = scaleY.factory(props);

        let _y0 = y(0);
        let color = helpers.colorFunc(colors);

        /* jshint ignore:start */
        return <g className={className} style={style}>
            {_.map(series, (series, index) => {

                let { seriesVisible, seriesStyle, seriesAttributes } = props;
                let { lineVisible, lineStyle, lineAttributes, lineWidth } = props;

                seriesVisible = helpers.value(seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }
                lineVisible = helpers.value(lineVisible, {seriesIndex: index, series, props});
                if (!lineVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, {seriesIndex: index, series, props});
                seriesStyle = helpers.value([series.style, seriesStyle], {seriesIndex: index, series, props});

                var line;
                if (rotate) {
                    line = asAreas ?
                        d3.svg.area()
                            .x0(point => point.y0 ? y(point.y0) : _y0)
                            .x1(point => y(point.y)) :
                        d3.svg.line()
                            .x(point => y(point.y));

                    line.y(point => x(point.x));
                } else {
                    line = asAreas ?
                        d3.svg.area()
                            .y0(point => point.y0 ? y(point.y0) : _y0)
                            .y1(point => y(point.y)) :
                        d3.svg.line()
                            .y(point => y(point.y));

                    line.x(point => x(point.x));
                }

                let lineColor = series.color || color(index);

                line.defined(point => _.isNumber(point.y))
                    .interpolate(this.props.interpolation);

                lineAttributes = helpers.value(lineAttributes, {seriesIndex: index, series, props});
                lineStyle = helpers.value([series.style, lineStyle], {seriesIndex: index, series, props});
                lineWidth = helpers.value(lineWidth, {seriesIndex: index, series, props});

                return <g
                    key={index}
                    className={className && (className + '-series ' + className + '-series-' + index)}
                    style={seriesStyle}
                    {...seriesAttributes}>
                    <path
                        style={lineStyle}
                        fill={asAreas ? lineColor : 'transparent'}
                        fillOpacity={series.opacity}
                        stroke={asAreas ? 'transparent' : lineColor}
                        strokeOpacity={series.opacity}
                        strokeWidth={lineWidth}
                        d={line(series.data)}
                        {...lineAttributes}
                        />
                </g>;
            })}
        </g>;
        /* jshint ignore:end */
    }

});

module.exports = Lines;
