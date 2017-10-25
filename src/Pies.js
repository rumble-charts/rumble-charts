import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {scaleLinear} from 'd3-scale';
import {arc as d3Arc} from 'd3-shape';
import {interpolate} from 'd3-interpolate';

import normalizeNumber from './helpers/normalizeNumber';
import value from './helpers/value';
import colorFunc from './helpers/colorFunc';
import getCoords from './helpers/getCoords';
import propTypes from './helpers/propTypes';

const maxAngle = 2 * Math.PI;

/**
 * Renders pies for you pie chart or donut chart
 *
 * @example ../docs/examples/Pies.md
 */
export default class Pies extends Component {

    constructor(props) {
        super(props);

        this.getInnerRadius = this.getInnerRadius.bind(this);
        this.getPaddings = this.getPaddings.bind(this);
        this.getPieWidth = this.getPieWidth.bind(this);
        this.renderArc = this.renderArc.bind(this);
    }

    // helpers

    getOuterRadius(props) {
        return Math.min(props.layerWidth, props.layerHeight) / 2;
    }

    getInnerRadius(props) {
        return normalizeNumber(props.innerRadius, this.getOuterRadius(props));
    }

    getPaddings(props) {
        let {innerPadding, groupPadding} = props;
        const outerRadius = this.getOuterRadius(props);
        innerPadding = normalizeNumber(innerPadding, outerRadius) || 0;
        groupPadding = normalizeNumber(groupPadding, outerRadius) || 0;
        return {
            innerPadding,
            groupPadding
        };
    }

    getPieWidth(x, props) {
        let {pieWidth} = props;
        const {innerPadding, groupPadding} = this.getPaddings(props);
        if (pieWidth) {
            return normalizeNumber(pieWidth, this.getOuterRadius(props));
        } else {
            const baseWidth = Math.abs(x(1) - x(0));
            if (props.combined) {
                return baseWidth - innerPadding;
            } else {
                let seriesCount = _.isEmpty(props.series) ? 1 : props.series.length;
                return (baseWidth - groupPadding) / seriesCount - innerPadding;
            }
        }
    }

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
    }

    renderArc(startAngle, endAngle, radius, pieWidth, seriesIndex, pointIndex, point) {
        const {props} = this;
        const {className} = props;
        let {pieVisible, pieAttributes, pieStyle, groupStyle, cornerRadius} = props;
        const series = props.series[seriesIndex];

        pieVisible = value(pieVisible, {seriesIndex, pointIndex, point, series, props});
        if (!pieVisible) {
            return;
        }

        const halfWidth = pieWidth / 2;

        cornerRadius = value(cornerRadius, {seriesIndex, pointIndex, point, series, props});

        const arc = d3Arc()
            .cornerRadius(normalizeNumber(cornerRadius, pieWidth))
            .padRadius(10)
            .innerRadius(radius - halfWidth)
            .outerRadius(radius + halfWidth);

        let fillColor = point.color || series.color || this.color(seriesIndex);
        if (_.isArray(fillColor) && _.uniq(fillColor).length === 1) {
            fillColor = fillColor[0];
        }

        pieStyle = value([point.style, series.style, pieStyle], {
            seriesIndex,
            pointIndex,
            point,
            series,
            props
        });
        pieAttributes = value(pieAttributes, {seriesIndex, pointIndex, point, series, props});

        const pathProps = _.assign({
            style: pieStyle,
            fill: fillColor,
            fillOpacity: point.opacity
        }, pieAttributes);

        let pathList = [];
        // fill color interpolation
        if (_.isArray(fillColor)) {

            const interpolateAngle = interpolate(startAngle, endAngle);
            _.forEach(fillColor, (color, index) => {

                if (index === fillColor.length - 1) {
                    return;
                }

                const interpolateFillColor = interpolate(color, fillColor[index + 1]);
                const step = 1 / ((endAngle - startAngle) / this.props.gradientStep);

                _.forEach(_.range(0, 1, step), (i) => {

                    pathProps.fill = interpolateFillColor(i);
                    const angleIndex = (index + i) / (fillColor.length - 1);
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

        groupStyle = value(groupStyle, {seriesIndex, pointIndex, point, series, props});

        return <g
            key={pointIndex}
            className={className && (className + '-pie ' + className + '-pie-' + pointIndex)}
            style={groupStyle}>
            {pathList}
        </g>;
    }

    render() {
        const {props} = this;
        const {className, style, minX, maxX, minY, maxY, position, layerWidth, layerHeight, colors, opacity} = props;

        const innerRadius = this.getInnerRadius(props);
        const outerRadius = this.getOuterRadius(props);

        const radialScale = scaleLinear()
            .range([outerRadius, innerRadius])
            .domain(props.scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

        const circularScale = scaleLinear()
            .range([props.startAngle, props.endAngle])
            .domain(props.scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);

        const {series} = props;

        const {innerPadding} = this.getPaddings(props);
        const pieWidth = this.getPieWidth(radialScale, props);
        const _startAngle = circularScale(0);
        this.color = colorFunc(colors);

        const coords = getCoords(position || '', layerWidth, layerHeight, outerRadius * 2, outerRadius * 2);

        const halfPadAngle = props.padAngle / 2 || 0;

        return <g
            className={className}
            style={style}
            transform={'translate(' + (coords.x + outerRadius) + ' ' + (coords.y + outerRadius) + ')'}
            opacity={opacity}>
            {_.map(series, (series, index) => {

                let {seriesVisible, seriesAttributes, seriesStyle} = props;

                seriesVisible = value(seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = value(seriesAttributes, {seriesIndex: index, series, props});
                seriesStyle = value(seriesStyle, {seriesIndex: index, series, props});

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

}

Pies.displayName = 'Pies';

Pies.propTypes = {
    colors: PropTypes.oneOfType([
        PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.array, PropTypes.string])),
        PropTypes.func
    ]),
    opacity: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
    position: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),

    innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    cornerRadius: PropTypes.oneOfType([
        PropTypes.number, PropTypes.string, PropTypes.func
    ]),
    innerPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    groupPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    combined: PropTypes.bool,
    startAngle: PropTypes.number,
    endAngle: PropTypes.number,
    padAngle: PropTypes.number,
    gradientStep: PropTypes.number,

    seriesVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    seriesAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    seriesStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    groupStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    pieVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    pieAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    pieStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    pieWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    seriesIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array,
        PropTypes.func
    ]),
    series: propTypes.series,
    minX: PropTypes.number,
    maxX: PropTypes.number,
    minY: PropTypes.number,
    maxY: PropTypes.number,
    layerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    layerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

Pies.defaultProps = {
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
