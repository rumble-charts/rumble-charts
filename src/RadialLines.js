'use strict';

const React = require('react'),
    PropTypes = require('prop-types'),
    _ = require('./_'),
    d3 = require('d3'),
    helpers = require('./helpers');

/**
 * Renders radial lines for your radar chart
 *
 * @example ../docs/examples/RadialLines.md
 */
const RadialLines = React.createClass({

    displayName: 'RadialLines',

    propTypes: {
        className: PropTypes.string,
        style: PropTypes.object,
        scaleX: PropTypes.object,
        scaleY: PropTypes.object,
        minX: PropTypes.number,
        maxX: PropTypes.number,
        minY: PropTypes.number,
        maxY: PropTypes.number,
        layerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        layerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        seriesIndex: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.array,
            PropTypes.func
        ]),
        series: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            color: PropTypes.string,
            opacity: PropTypes.number,
            style: PropTypes.object,
            data: PropTypes.arrayOf(PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.arrayOf(PropTypes.number),
                PropTypes.shape({
                    x: PropTypes.number,
                    y: PropTypes.number
                })
            ]))
        })),
        colors: PropTypes.oneOfType([
            PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.func
        ]),
        position: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),

        opacity: PropTypes.number,
        asAreas: PropTypes.bool,
        innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        startAngle: PropTypes.number,
        endAngle: PropTypes.number,
        interpolation: PropTypes.oneOf([
            'linear', 'linear-closed', 'step', 'step-before', 'step-after',
            'basis', 'basis-open', 'basis-closed', 'bundle',
            'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone'
        ]),

        seriesVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        seriesAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
        seriesStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

        lineVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        lineAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
        lineStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

        lineWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func])
    },

    // init

    getDefaultProps() {
        return {
            colors: 'category20',
            seriesVisible: true,
            lineVisible: true,
            lineWidth: 3,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            innerRadius: 0,
            position: 'center middle',
            interpolation: 'cardinal-closed'
        };
    },

    // helpers

    getOuterRadius(props) {
        return Math.min(props.layerWidth, props.layerHeight) / 2;
    },

    getInnerRadius(props) {
        return helpers.normalizeNumber(props.innerRadius, this.getOuterRadius(props));
    },

    render: function () {
        let {props} = this;
        let {
            className, style, asAreas, colors, minX, maxX, minY, maxY,
            position, layerWidth, layerHeight, opacity
        } = props;

        let innerRadius = this.getInnerRadius(props);
        let outerRadius = this.getOuterRadius(props);

        let radialScale = d3.scale.linear()
            .range([innerRadius, outerRadius])
            .domain(props.scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);

        let circularScale = d3.scale.linear()
            .range([props.startAngle, props.endAngle])
            .domain(props.scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

        let {series} = props;

        let _radius0 = radialScale(0);

        let coords = helpers.getCoords(position || '', layerWidth, layerHeight, outerRadius * 2, outerRadius * 2);

        let color = helpers.colorFunc(colors);

        return <g
            className={className}
            style={style}
            transform={'translate(' + (coords.x + outerRadius) + ' ' + (coords.y + outerRadius) + ')'}
            opacity={opacity}>

            {_.map(series, (series, index) => {

                let {seriesVisible, seriesAttributes, seriesStyle} = props;
                let {lineVisible, lineStyle, lineAttributes, lineWidth} = props;

                seriesVisible = helpers.value(seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, {seriesIndex: index, series, props});
                seriesStyle = helpers.value(seriesStyle, {seriesIndex: index, series, props});

                let linePath;
                lineVisible = helpers.value(lineVisible, {seriesIndex: index, series, props});
                if (lineVisible) {
                    let line = asAreas ?
                        d3.svg.area.radial()
                            .innerRadius(point => point.y0 ? radialScale(point.y0) : _radius0)
                            .outerRadius(point => radialScale(point.y)) :
                        d3.svg.line.radial()
                            .radius(point => radialScale(point.y));

                    let lineColor = series.color || color(index);

                    line.angle(point => circularScale(point.x))
                        .defined(point => _.isNumber(point.y))
                        .interpolate(this.props.interpolation);

                    lineAttributes = helpers.value(lineAttributes, {seriesIndex: index, series, props});
                    lineStyle = helpers.value([series.style, lineStyle], {seriesIndex: index, series, props});
                    lineWidth = helpers.value(lineWidth, {seriesIndex: index, series, props});

                    linePath = <path
                        style={lineStyle}
                        fill={asAreas ? lineColor : 'transparent'}
                        stroke={asAreas ? 'transparent' : lineColor}
                        strokeWidth={lineWidth}
                        d={line(series.data)}
                        {...lineAttributes}
                    />;
                }

                return <g
                    key={index}
                    className={className && (className + '-series ' + className + '-series-' + index)}
                    style={seriesStyle}
                    opacity={series.opacity}
                    {...seriesAttributes}>
                    {linePath}
                </g>;
            })}
        </g>;

    }

});

module.exports = RadialLines;
