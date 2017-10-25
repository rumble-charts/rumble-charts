import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {scaleLinear} from 'd3-scale';
import {areaRadial, lineRadial} from 'd3-shape';

import curves from './helpers/curves';
import normalizeNumber from './helpers/normalizeNumber';
import value from './helpers/value';
import colorFunc from './helpers/colorFunc';
import getCoords from './helpers/getCoords';

/**
 * Renders radial lines for your radar chart
 *
 * @example ../docs/examples/RadialLines.md
 */
export default class RadialLines extends Component {

    constructor(props) {
        super(props);

        this.getInnerRadius = this.getInnerRadius.bind(this);
    }

    // helpers

    getOuterRadius(props) {
        return Math.min(props.layerWidth, props.layerHeight) / 2;
    }

    getInnerRadius(props) {
        return normalizeNumber(props.innerRadius, this.getOuterRadius(props));
    }

    render() {
        const {props} = this;
        const {
            className, style, asAreas, colors, minX, maxX, minY, maxY,
            position, layerWidth, layerHeight, opacity
        } = props;

        const innerRadius = this.getInnerRadius(props);
        const outerRadius = this.getOuterRadius(props);

        const radialScale = scaleLinear()
            .range([innerRadius, outerRadius])
            .domain(props.scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);

        const circularScale = scaleLinear()
            .range([props.startAngle, props.endAngle])
            .domain(props.scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

        const {series} = props;

        const _radius0 = radialScale(0);

        const coords = getCoords(position || '', layerWidth, layerHeight, outerRadius * 2, outerRadius * 2);

        const color = colorFunc(colors);

        return <g
            className={className}
            style={style}
            transform={'translate(' + (coords.x + outerRadius) + ' ' + (coords.y + outerRadius) + ')'}
            opacity={opacity}>

            {_.map(series, (series, index) => {

                let {seriesVisible, seriesAttributes, seriesStyle} = props;
                let {lineVisible, lineStyle, lineAttributes, lineWidth} = props;

                seriesVisible = value(seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = value(seriesAttributes, {seriesIndex: index, series, props});
                seriesStyle = value(seriesStyle, {seriesIndex: index, series, props});

                let linePath;
                lineVisible = value(lineVisible, {seriesIndex: index, series, props});
                if (lineVisible) {
                    const line = asAreas ?
                        areaRadial()
                            .innerRadius(point => point.y0 ? radialScale(point.y0) : _radius0)
                            .outerRadius(point => radialScale(point.y)) :
                        lineRadial()
                            .radius(point => radialScale(point.y));

                    const lineColor = series.color || color(index);

                    const curve = _.isString(props.interpolation) ?
                        curves[props.interpolation] :
                        props.interpolation;

                    line.angle(point => circularScale(point.x))
                        .defined(point => _.isNumber(point.y))
                        .curve(curve);

                    lineAttributes = value(lineAttributes, {seriesIndex: index, series, props});
                    lineStyle = value([series.style, lineStyle], {seriesIndex: index, series, props});
                    lineWidth = value(lineWidth, {seriesIndex: index, series, props});

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

}

RadialLines.displayName = 'RadialLines';

RadialLines.propTypes = {
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
    interpolation: PropTypes.oneOfType([
        PropTypes.oneOf([
            'linear', 'linear-closed', 'step', 'step-before', 'step-after',
            'basis', 'basis-open', 'basis-closed', 'bundle',
            'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone'
        ]),
        PropTypes.func
    ]),

    seriesVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    seriesAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    seriesStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    lineVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    lineAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    lineStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    lineWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func])
};

RadialLines.defaultProps = {
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
