import React from 'react';
import _ from 'lodash';

import normalizeSeries from './normalizeSeries';

const limitsPropNames = ['maxX', 'maxY', 'minX', 'minY'];

export default function proxyChildren(children, seriesProps = null, extraProps = {}) {

    var limits = _.pick(seriesProps, limitsPropNames);
    seriesProps = normalizeSeries(seriesProps);
    var limitsCalculated = _.pick(seriesProps, limitsPropNames);
    var {series} = seriesProps;

    return React.Children.map(children, child => {

        if (!child) {
            return child;
        }

        var props = {};
        _.assign(props, child.props);
        _.defaultsDeep(props, _.isFunction(extraProps) ? extraProps(child) : extraProps);

        var childLimits = _.pick(child.props, limitsPropNames);
        var childSeriesProps = normalizeSeries(_.defaults(child.props, {
            layerWidth: props.layerWidth,
            layerHeight: props.layerHeight
        }));
        var childLimitsCalculated = _.pick(childSeriesProps, limitsPropNames);

        _.defaults(props, childLimits, limits, childLimitsCalculated, limitsCalculated);

        if (!child.props.series) {
            if (_.isUndefined(child.props.seriesIndex)) {
                props.series = series;
            } else if (_.isNumber(child.props.seriesIndex)) {
                props.series = [series[child.props.seriesIndex]];
            } else if (_.isArray(child.props.seriesIndex)) {
                props.series = _.map(child.props.seriesIndex, index => series[index]);
            } else if (_.isFunction(child.props.seriesIndex)) {
                props.series = _.filter(series, child.props.seriesIndex);
            }
        } else {
            props.series = childSeriesProps.series;
        }
        props.seriesNormalized = true;

        props = _.omitBy(props, _.isUndefined);

        return React.cloneElement(child, props);

    });
}
