import React from 'react';
import {
    assign,
    defaults,
    defaultsDeep,
    filter,
    isArray,
    isFunction,
    isNumber,
    isUndefined,
    map,
    omitBy,
    pick,
} from 'lodash';

import normalizeSeries from './normalizeSeries';

const limitsPropNames = ['maxX', 'maxY', 'minX', 'minY'];

export default function proxyChildren(children, seriesProps = {}, extraProps = {}) {

    const limits = pick(seriesProps, limitsPropNames);
    seriesProps = normalizeSeries(seriesProps);
    const limitsCalculated = pick(seriesProps, limitsPropNames);
    const {series} = seriesProps;

    return React.Children.map(children, child => {

        if (!child) {
            return child;
        }

        let props = {};
        assign(props, child.props);
        defaultsDeep(props, isFunction(extraProps) ? extraProps(child) : extraProps);

        const childLimits = pick(child.props, limitsPropNames);
        const childSeriesProps = normalizeSeries(defaults(child.props, {
            layerWidth: props.layerWidth,
            layerHeight: props.layerHeight
        }));
        const childLimitsCalculated = pick(childSeriesProps, limitsPropNames);

        defaults(props, childLimits, limits, childLimitsCalculated, limitsCalculated);

        if (!child.props.series) {
            if (isUndefined(child.props.seriesIndex)) {
                props.series = series;
            } else if (isNumber(child.props.seriesIndex)) {
                props.series = [series[child.props.seriesIndex]];
            } else if (isArray(child.props.seriesIndex)) {
                props.series = map(child.props.seriesIndex, index => series[index]);
            } else if (isFunction(child.props.seriesIndex)) {
                props.series = filter(series, child.props.seriesIndex);
            } else {
                props.series = series;
            }
        } else {
            props.series = childSeriesProps.series;
        }
        props.seriesNormalized = true;

        props = omitBy(props, isUndefined);

        return React.cloneElement(child, props);

    });
}
