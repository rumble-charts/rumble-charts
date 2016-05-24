'use strict';

const React = require('react'),
    _ = require('./_'),
    d3 = require('d3'),
    helpers = require('./helpers');

const maxAngle = 2 * Math.PI;

/**
 * Renders pies for you pie chart or donut chart
 *
 * @example ../docs/examples/Pies.md
 */
const Pies = React.createClass({

    displayName: 'Pies',

    propTypes: {
        colors: React.PropTypes.oneOfType([
            React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            React.PropTypes.arrayOf(React.PropTypes.string),
            React.PropTypes.func
        ]),
        opacity: React.PropTypes.number,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),

        innerRadius: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        cornerRadius: React.PropTypes.oneOfType([
            React.PropTypes.number, React.PropTypes.string, React.PropTypes.func
        ]),
        innerPadding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        groupPadding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        combined: React.PropTypes.bool,
        startAngle: React.PropTypes.number,
        endAngle: React.PropTypes.number,
        padAngle: React.PropTypes.number,
        gradientStep: React.PropTypes.number,

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        groupStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        pieVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        pieAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        pieStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        pieWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),

        seriesIndex: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.array,
            React.PropTypes.func
        ]),
        series: helpers.propTypes.series,
        minX: React.PropTypes.number,
        maxX: React.PropTypes.number,
        minY: React.PropTypes.number,
        maxY: React.PropTypes.number,
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
    },

    // init

    getDefaultProps() {
        return {
            colors: 'category20',
            seriesVisible: true,
            pieVisible: true,
            startAngle: 0,
            endAngle: maxAngle,
            padAngle: 0,
            innerRadius: 0,
            cornerRadius: 0,
            groupPadding: 0,
            innerPadding: 0,
            position: 'center middle',
            gradientStep: 0.01
        };
    },

    // helpers

    getOuterRadius(props) {
        return Math.min(props.layerWidth, props.layerHeight) / 2;
    },

    getInnerRadius(props) {
        return helpers.normalizeNumber(props.innerRadius, this.getOuterRadius(props));
    },

    getPaddings(props) {
        let {innerPadding, groupPadding} = props;
        const outerRadius = this.getOuterRadius(props);
        innerPadding = helpers.normalizeNumber(innerPadding, outerRadius) || 0;
        groupPadding = helpers.normalizeNumber(groupPadding, outerRadius) || 0;
        return {
            innerPadding,
            groupPadding
        };
    },

    getPieWidth(x, props) {
        let {pieWidth} = props;
        const {innerPadding, groupPadding} = this.getPaddings(props);
        if (pieWidth) {
            return helpers.normalizeNumber(pieWidth, this.getOuterRadius(props));
        } else {
            const baseWidth = Math.abs(x(1) - x(0));
            if (props.combined) {
                return baseWidth - innerPadding;
            } else {
                let seriesCount = _.isEmpty(props.series) ? 1 : props.series.length;
                return (baseWidth - groupPadding) / seriesCount - innerPadding;
            }
        }
    },

    // render

    renderArcPart({startAngle, endAngle, maxAngle, pathProps, arc, key}) {
        let pathList = [];
        let lapIndex = 0;
        while (endAngle >= 4 * Math.PI) {
            endAngle -= 2 * Math.PI;
            if (endAngle < startAngle) {
                startAngle -= 2 * Math.PI;
            }
        }
        const lapsCount = Math.abs((endAngle - startAngle) / maxAngle);
        while (lapIndex < lapsCount) {

            let d = arc({
                startAngle: startAngle,
                endAngle: Math.min(startAngle + maxAngle, endAngle)
            });
            startAngle += maxAngle;


            pathList.push(<path
                key={'' + key + lapIndex}
                {...pathProps}
                d={d}
            />);

            lapIndex++;
        }
        return pathList;
    },

    renderArc(startAngle, endAngle, radius, pieWidth, seriesIndex, pointIndex, point) {
        const {props} = this;
        const {className} = props;
        let {pieVisible, pieAttributes, pieStyle, groupStyle, cornerRadius} = props;
        const series = props.series[seriesIndex];

        pieVisible = helpers.value(pieVisible, {seriesIndex, pointIndex, point, series, props});
        if (!pieVisible) {
            return;
        }

        const halfWidth = pieWidth / 2;

        cornerRadius = helpers.value(cornerRadius, {seriesIndex, pointIndex, point, series, props});

        const arc = d3.svg.arc()
            .cornerRadius(helpers.normalizeNumber(cornerRadius, pieWidth))
            .padRadius(10)
            .innerRadius(radius - halfWidth)
            .outerRadius(radius + halfWidth);

        let fillColor = point.color || series.color || this.color(seriesIndex);
        if (_.isArray(fillColor) && _.uniq(fillColor).length === 1) {
            fillColor = fillColor[0];
        }

        pieStyle = helpers.value([point.style, series.style, pieStyle], {seriesIndex, pointIndex, point, series, props});
        pieAttributes = helpers.value(pieAttributes, {seriesIndex, pointIndex, point, series, props});

        // Used for setting `transform` (positioning) on the <path>
        const {position, layerWidth, layerHeight} = props;
        const innerRadius = this.getInnerRadius(props);
        const outerRadius = this.getOuterRadius(props);
        const coords = helpers.getCoords(position || '', layerWidth, layerHeight, outerRadius * 2, outerRadius * 2);
        const transform = 'translate(' + (coords.x + outerRadius) + ',' + (coords.y + outerRadius) + ')';

        const pathProps = _.assign({
            style: pieStyle,
            fill: fillColor,
            fillOpacity: point.opacity,
            transform: transform,
        }, pieAttributes);

        let pathList = [];
        // fill color interpolation
        if (_.isArray(fillColor)) {

            let interpolateAngle = d3.interpolate(startAngle, endAngle);
            _.forEach(fillColor, (color, index) => {

                if (index === fillColor.length - 1) {
                    return;
                }

                let interpolateFillColor = d3.interpolate(color, fillColor[index + 1]);
                let step = 1 / ((endAngle - startAngle) / this.props.gradientStep);

                _.forEach(_.range(0, 1, step), (i) => {

                    pathProps.fill = interpolateFillColor(i);
                    let angleIndex = (index + i) / (fillColor.length - 1);
                    pathList = pathList.concat(this.renderArcPart({
                        startAngle: interpolateAngle(angleIndex),
                        endAngle: interpolateAngle(angleIndex + step),
                        maxAngle,
                        pathProps,
                        arc,
                        key: i
                    }));

                });
            });

        } else {

            pathList = this.renderArcPart({
                startAngle,
                endAngle,
                maxAngle,
                pathProps,
                arc,
                key: pointIndex
            });

        }

        groupStyle = helpers.value(groupStyle, {seriesIndex, pointIndex, point, series, props});

        return <g
            key={pointIndex}
            className={className && (className + '-pie ' + className + '-pie-' + pointIndex)}
            style={groupStyle}>
            {pathList}
        </g>;

    },

    render: function () {
        const {props} = this;
        const {className, style, minX, maxX, minY, maxY, position, layerWidth, layerHeight, colors, opacity} = props;

        const innerRadius = this.getInnerRadius(props);
        const outerRadius = this.getOuterRadius(props);

        const radialScale = d3.scale.linear()
            .range([outerRadius, innerRadius])
            .domain(props.scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

        const circularScale = d3.scale.linear()
            .range([props.startAngle, props.endAngle])
            .domain(props.scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);

        const {series} = props;

        const {innerPadding} = this.getPaddings(props);
        const pieWidth = this.getPieWidth(radialScale, props);
        const _startAngle = circularScale(0);
        this.color = helpers.colorFunc(colors);

        const halfPadAngle = props.padAngle / 2 || 0;

        return <g className={className} style={style} opacity={opacity}>
            {_.map(series, (series, index) => {

                let {seriesVisible, seriesAttributes, seriesStyle} = props;

                seriesVisible = helpers.value(seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, {seriesIndex: index, series, props});
                seriesStyle = helpers.value(seriesStyle, {seriesIndex: index, series, props});

                let deltaRadial = 0;
                if (!props.combined) {
                    deltaRadial = pieWidth * index - (props.series.length - 1) * 0.5 * pieWidth +
                        (index - (props.series.length - 1) / 2) * innerPadding;
                }

                return <g
                    key={index}
                    className={className && (className + '-series ' + className + '-series-' + index)}
                    style={seriesStyle}
                    opacity={series.opacity}
                    {...seriesAttributes}>

                    {_.map(series.data, (point, pointIndex) => {
                        let startAngle = (point.y0 ? circularScale(point.y0) : _startAngle) + halfPadAngle;
                        let endAngle = circularScale(point.y) - halfPadAngle;
                        let radius = radialScale(point.x) - deltaRadial * (props.scaleX.direction || 1);

                        return this.renderArc(startAngle, endAngle, radius, pieWidth, index, pointIndex, point);
                    })}
                </g>;
            })}
        </g>;
    }

});

module.exports = Pies;
