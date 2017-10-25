import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {area as d3Area, line as d3Line} from 'd3-shape';

import curves from './helpers/curves';
import value from './helpers/value';
import colorFunc from './helpers/colorFunc';
import propTypes from './helpers/propTypes';

/**
 * Renders lines for your line chart.
 *
 * @example ../docs/examples/Lines.md
 */
export default function Lines(props) {
    const {className, style, scaleX, scaleY, minY, asAreas, colors, series, opacity} = props;

    const rotate = scaleX.swap || scaleY.swap;

    const x = scaleX.factory(props);
    const y = scaleY.factory(props);

    const _y0 = y(minY || 0);
    const color = colorFunc(colors);

    return <g className={className} style={style} opacity={opacity}>
        {_.map(series, (series, index) => {

            let {seriesVisible, seriesStyle, seriesAttributes} = props;
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
                let line;
                if (rotate) {
                    line = asAreas ?
                        d3Area()
                            .x0(point => point.y0 ? y(point.y0) : _y0)
                            .x1(point => y(point.y)) :
                        d3Line()
                            .x(point => y(point.y));

                    line.y(point => x(point.x));
                } else {
                    line = asAreas ?
                        d3Area()
                            .y0(point => point.y0 ? y(point.y0) : _y0)
                            .y1(point => y(point.y)) :
                        d3Line()
                            .y(point => y(point.y));

                    line.x(point => x(point.x));
                }

                let lineColor = series.color || color(index);

                const curve = _.isString(props.interpolation) ?
                    curves[props.interpolation] :
                    props.interpolation;

                line.defined(point => _.isNumber(point.y)).curve(curve);

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

Lines.displayName = 'Lines';

Lines.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    colors: PropTypes.oneOfType([
        PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.func
    ]),
    opacity: PropTypes.number,

    asAreas: PropTypes.bool,
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

    lineWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]),

    scaleX: PropTypes.object,
    scaleY: PropTypes.object,
    minX: PropTypes.number,
    maxX: PropTypes.number,
    minY: PropTypes.number,
    maxY: PropTypes.number,
    seriesIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array,
        PropTypes.func
    ]),
    series: propTypes.series
};

Lines.defaultProps = {
    colors: 'category20',
    interpolation: 'monotone',
    seriesVisible: true,
    lineVisible: true,
    lineWidth: 3
};
