'use strict';

const React = require('react'),
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
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        scaleX: React.PropTypes.object,
        scaleY: React.PropTypes.object,
        minX: React.PropTypes.number,
        maxX: React.PropTypes.number,
        minY: React.PropTypes.number,
        maxY: React.PropTypes.number,
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
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
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),

        opacity: React.PropTypes.number,
        asAreas: React.PropTypes.bool,
        innerRadius: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        startAngle: React.PropTypes.number,
        endAngle: React.PropTypes.number,
        interpolation: React.PropTypes.oneOf([
            'linear', 'linear-closed', 'step', 'step-before', 'step-after',
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

        let transform = 'translate(' + (coords.x + outerRadius) + ',' + (coords.y + outerRadius) + ')';

        let color = helpers.colorFunc(colors);

        return <g
            className={className} style={style}
            opacity={opacity}
            transform={transform}>

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

