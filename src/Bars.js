import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import value from './helpers/value';
import normalizeNumber from './helpers/normalizeNumber';
import colorFunc from './helpers/colorFunc';
import propTypes from './helpers/propTypes';

/**
 * Renders bars for your bar chart.
 *
 * @example ../docs/examples/Bars.md
 */
export default class Bars extends Component {

    constructor(props) {
        super(props);

        this.getPaddings = this.getPaddings.bind(this);
        this.getBarWidth = this.getBarWidth.bind(this);

        this.renderSeries = this.renderSeries.bind(this);
        this.renderBar = this.renderBar.bind(this);
    }

    // helpers

    getPaddings() {
        const {props} = this;
        let {innerPadding, groupPadding, layerWidth} = props;
        innerPadding = value(innerPadding, props);
        innerPadding = normalizeNumber(innerPadding, layerWidth);
        groupPadding = value(groupPadding, props);
        groupPadding = normalizeNumber(groupPadding, layerWidth);
        return {
            innerPadding,
            groupPadding
        };
    }

    getBarWidth() {
        const {props, x} = this;
        let {barWidth, layerWidth} = props;
        let {innerPadding, groupPadding} = this.getPaddings(props);
        if (barWidth) {
            barWidth = value(barWidth, props);
            return normalizeNumber(barWidth, layerWidth);
        } else {
            const baseWidth = Math.abs(x(1) - x(0));
            if (props.combined) {
                return baseWidth - innerPadding;
            } else {
                return (baseWidth - groupPadding) / (props.series || []).length - innerPadding;
            }
        }
    }

    // render

    renderSeries(series, index) {
        const {x, y, barWidth, props} = this;
        const {scaleX, scaleY, className} = props;
        let {seriesVisible, seriesStyle, seriesAttributes} = props;

        seriesVisible = value(seriesVisible, {seriesIndex: index, series, props});
        if (!seriesVisible) {
            return;
        }

        seriesAttributes = value(seriesAttributes, {seriesIndex: index, series, props});
        seriesStyle = value(seriesStyle, {seriesIndex: index, series, props});

        let deltaX = 0;
        if (!props.combined) {
            deltaX = barWidth * index -
                (props.series.length - 1) * 0.5 * barWidth +
                (index - (props.series.length - 1) / 2) * this.innerPadding;
        }


        return <g
            key={index}
            className={className && (className + '-series ' + className + '-series-' + index)}
            opacity={series.opacity}
            style={seriesStyle}
            {...seriesAttributes}>

            {series && _.map(series.data, (point, pointIndex) => {
                let y0 = point.y0 ? y(point.y0) : this._y0;
                let y1 = y(point.y);
                let x1 = x(point.x) + deltaX * (scaleX.direction || 1);

                if (scaleX.swap || scaleY.swap) {
                    return this.renderBar(y1, x1, y0 - y1, barWidth, index, pointIndex, point);
                } else {
                    return this.renderBar(x1, y1, barWidth, y0 - y1, index, pointIndex, point);
                }
            })}

        </g>;

    }

    renderBar(x, y, width, height, seriesIndex, pointIndex, point) {
        let {props} = this;
        const {className, scaleX, scaleY} = props;
        let {barVisible, barAttributes, barStyle, groupStyle} = props;
        const series = props.series[seriesIndex];

        barVisible = value(barVisible, {seriesIndex, pointIndex, point, series, props});
        if (!barVisible) {
            return;
        }

        groupStyle = value(groupStyle, {seriesIndex, pointIndex, point, series, props});

        const d = (scaleX.swap || scaleY.swap) ?
            ('M0,' + (-height / 2) + ' h' + (width) + ' v' + height + ' h' + (-width) + ' Z') :
            ('M' + (-width / 2) + ',0 v' + height + ' h' + width + ' v' + (-height) + ' Z');

        barAttributes = value(barAttributes, {seriesIndex, pointIndex, point, series, props});
        barStyle = value([point.style, series.style, barStyle], {
            seriesIndex, pointIndex, point, series, props
        });

        return <g
            key={pointIndex}
            className={className && (className + '-bar ' + className + '-bar-' + pointIndex)}
            transform={'translate(' + x + ' ' + y + ')'}
            style={groupStyle}>
            <path
                style={barStyle}
                fill={point.color || series.color || this.color(seriesIndex)}
                fillOpacity={point.opacity}
                d={d}
                {...barAttributes}/>
        </g>;
    }

    render() {
        const {props} = this;
        const {className, style, colors, opacity} = props;

        this.x = props.scaleX.factory(props);
        this.y = props.scaleY.factory(props);

        let domainX = this.x.domain();
        let naturalDirection = domainX[1] > domainX[0];
        if (domainX[0] === props.minX || domainX[0] === props.maxX) {
            this.x.domain([domainX[0] + (naturalDirection ? -0.5 : 0.5), domainX[1]]);
            domainX = this.x.domain();
        }
        if (domainX[1] === props.minX || domainX[1] === props.maxX) {
            this.x.domain([domainX[0], domainX[1] + (naturalDirection ? 0.5 : -0.5)]);
        }

        this.innerPadding = this.getPaddings().innerPadding;
        this.barWidth = this.getBarWidth();
        this._y0 = this.y(0);
        this.color = colorFunc(colors);

        return <g
            className={className}
            style={style}
            opacity={opacity}>
            {_.map(props.series, this.renderSeries)}
        </g>;

    }

}

Bars.displayName = 'Bars';

Bars.propTypes = {
    className: PropTypes.string,
    /**
     * Colors
     */
    colors: PropTypes.oneOfType([
        PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.func
    ]),
    opacity: PropTypes.number,
    style: PropTypes.object,

    combined: PropTypes.bool,
    groupPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]),
    innerPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]),

    seriesVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    seriesAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    seriesStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    groupStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    barVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    barAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    barStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    barWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]),

    layerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    layerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    seriesIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array,
        PropTypes.func
    ]),
    series: propTypes.series,
    scaleX: PropTypes.object,
    scaleY: PropTypes.object,
    minX: PropTypes.number,
    maxX: PropTypes.number,
    minY: PropTypes.number,
    maxY: PropTypes.number
};

Bars.defaultProps = {
    groupPadding: 0,
    innerPadding: 0,
    colors: 'category20',
    seriesVisible: true,
    barVisible: true
};
