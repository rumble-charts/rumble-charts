'use strict';

var React = require('react'),
    PropTypes = require('prop-types'),
    d3 = require('d3'),
    _ = require('lodash');

var limitsPropNames = ['maxX', 'maxY', 'minX', 'minY'];

var isInvalidLimit = value => {
    return _.isUndefined(value) || value === Infinity || value === -Infinity;
};

var helpers = {

    normalizeSeries(props) {
        var maxX = -Infinity,
            maxY = -Infinity,
            minX = Infinity,
            minY = Infinity;

        var series = _.map(props.series, series => {

            let data = _.map(series.data, (item, index) => {

                var d;
                if (!props.seriesNormalized) {
                    d = {};
                    if (_.isNumber(item)) {
                        d.x = index;
                        d.y = item;
                    } else if (_.isArray(item)) {
                        d.x = item[0];
                        d.y = item[1];
                    } else {
                        d = item || {};
                        if (_.isUndefined(d.x)) {
                            d.x = index;
                        }
                    }
                } else {
                    d = item;
                }
                if (_.isUndefined(props.maxX)) {
                    maxX = Math.max(maxX, d.x || 0);
                }
                if (_.isUndefined(props.maxY)) {
                    maxY = Math.max(maxY, d.y || 0);
                }
                if (_.isUndefined(props.minX)) {
                    minX = Math.min(minX, d.x || 0);
                }
                if (_.isUndefined(props.minY)) {
                    minY = Math.min(minY, d.y || 0);
                }

                return d;
            });

            return _.defaults({data}, series);
        });
        if (_.isEmpty(series)) {
            series = undefined;
        }
        if (!_.isUndefined(props.maxX)) {
            maxX = props.maxX;
        }
        if (!_.isUndefined(props.maxY)) {
            maxY = props.maxY;
        }
        if (!_.isUndefined(props.minX)) {
            minX = props.minX;
        }
        if (!_.isUndefined(props.minY)) {
            minY = props.minY;
        }

        return _.omitBy({
            seriesNormalized: true,
            series,
            maxX,
            maxY,
            minX,
            minY
        }, isInvalidLimit);
    },

    normalizeNumber(number, absolute = null) {
        if (_.isString(number)) {
            if (number.substr(-1, 1) === '%') {
                number = ((parseFloat(number) || 0) / 100) * absolute;
            } else if (number === 'left' || number === 'top') {
                number = 0;
            } else if (number === 'right' || number === 'bottom') {
                number = 1;
            } else if (number === 'middle' || number === 'center') {
                number = 0.5;
            } else {
                number = parseFloat(number) || 0;
            }
        }
        let absNumber = Math.abs(number);
        if (absNumber > 0 && absNumber <= 1) {
            number = number * absolute;
        }
        return number;
    },

    getCoords(position, layerWidth, layerHeight, width = 0, height = 0) {

        if (_.isString(position)) {
            position = position.split(' ');
        }
        if (_.isArray(position)) {
            position = _.map(position, pos => pos.toLowerCase ? pos.toLowerCase() : pos);
            var [x, y] = position;
            if (['top', 'bottom', 'middle'].indexOf(position[0]) !== -1) {
                y = position[0];
            }
            if (['left', 'right', 'center'].indexOf(position[1]) !== -1) {
                x = position[1];
            }
            if (_.isString(x)) {
                if (x === 'left') {
                    x = 0;
                } else if (x === 'right') {
                    x = layerWidth - width;
                } else if (x === 'center') {
                    x = (layerWidth - width) / 2;
                } else {
                    x = helpers.normalizeNumber(x, layerWidth);
                }
            } else if (_.isUndefined(x)) {
                x = 0;
            }
            if (_.isString(y)) {
                if (y === 'top') {
                    y = 0;
                } else if (y === 'bottom') {
                    y = layerHeight - height;
                } else if (y === 'middle') {
                    y = (layerHeight - height) / 2;
                } else {
                    y = helpers.normalizeNumber(y, layerHeight);
                }
            } else if (_.isUndefined(y)) {
                y = 0;
            }
            return {x, y};
        }

    },

    proxyChildren(children, seriesProps = null, extraProps = {}) {

        var limits = _.pick(seriesProps, limitsPropNames);
        seriesProps = helpers.normalizeSeries(seriesProps);
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
            var childSeriesProps = helpers.normalizeSeries(_.defaults(child.props, {
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
    },

    transforms: {
        stack(props, options) {
            var {normalize} = options || {};

            let {series, seriesNormalized, maxX, maxY, minX, minY} = props;

            var stackedY = [], lowestY = [];
            series = _.map(series, series => {
                var newSeries = {};
                newSeries.data = _.map(series.data, (point, pointIndex) => {
                    stackedY[pointIndex] = stackedY[pointIndex] || 0;
                    if (_.isUndefined(lowestY[pointIndex])) {
                        lowestY[pointIndex] = stackedY[pointIndex];
                    }
                    var newPoint = {
                        y0: stackedY[pointIndex],
                        y: stackedY[pointIndex] + point.y
                    };
                    stackedY[pointIndex] = newPoint.y;

                    return _.defaults(newPoint, point);
                });
                return _.defaults(newSeries, series);
            });
            minY = _.min(lowestY);
            var stackedMaxY = _.max(stackedY);
            maxY = Math.max(stackedMaxY, maxY);

            if (normalize) {

                var ratios = _.map(stackedY, y => stackedMaxY / y);
                series = _.map(series, series => {
                    var newSeries = {};
                    newSeries.data = _.map(series.data, (point, pointIndex) => {
                        var newPoint = {
                            y0: point.y0 * ratios[pointIndex],
                            y: point.y * ratios[pointIndex]
                        };
                        return _.defaults(newPoint, point);
                    });
                    return _.defaults(newSeries, series);
                });

            }

            return {
                series,
                seriesNormalized,
                maxX,
                maxY,
                minX,
                minY
            };
        },

        stackNormalized(props) {
            return helpers.transforms.stack(props, {
                normalize: true
            });
        },

        sort(props, options) {
            var {direction} = options || {};
            direction = ('' + direction).toLowerCase() || 'asc';

            let {series, seriesNormalized, maxX, maxY, minX, minY} = props;

            series = _.map(series, series => {
                var newSeries = {};
                newSeries.data = _.sortBy(series.data, 'y');
                if (direction === 'desc') {
                    newSeries.data.reverse();
                }
                newSeries.data = _.map(newSeries.data, (point, pointIndex) => {
                    var newPoint = {
                        realX: point.x,
                        x: pointIndex
                    };
                    return _.defaults(newPoint, point);
                });
                newSeries.data = _.sortBy(newSeries.data, 'realX');
                return _.defaults(newSeries, series);
            });

            return {
                series,
                seriesNormalized,
                maxX,
                maxY,
                minX,
                minY
            };
        },

        unstack(props) {

            let {series, seriesNormalized, maxX, maxY, minX, minY} = props;

            series = _.map(series, series => {
                var newSeries = {};
                newSeries.data = _.map(series.data, point => {
                    var newPoint = {
                        y0: 0
                    };
                    return _.defaults(newPoint, point);
                });
                return _.defaults(newSeries, series);
            });

            return {
                series,
                seriesNormalized,
                maxX,
                maxY,
                minX,
                minY
            };
        },

        transpose(props) {

            let {series, seriesNormalized, minX, maxY, minY} = props;

            var maxX = 0;
            let newSeries = [];
            _.forEach(series, (series, seriesIndex) => {
                _.forEach(series.data, (point, pointIndex) => {
                    newSeries[pointIndex] = newSeries[pointIndex] || {data: []};
                    maxX = Math.max(maxX, seriesIndex);
                    newSeries[pointIndex].data[seriesIndex] = _.defaults({
                        realX: point.x,
                        x: seriesIndex
                    }, point);
                });
            });

            return {
                series: newSeries,
                seriesNormalized,
                maxX,
                maxY,
                minX,
                minY
            };
        },

        rotate(props) {
            let {series, seriesNormalized, minX, maxX, maxY, minY, scaleX, scaleY} = props;

            let {paddingLeft, paddingRight} = scaleX;
            let {paddingTop, paddingBottom} = scaleY;
            scaleX = _.cloneDeep(scaleX);
            scaleY = _.cloneDeep(scaleY);
            scaleX.paddingLeft = paddingTop;
            scaleX.paddingRight = paddingBottom;
            scaleX.swap = !scaleX.swap;
            scaleY.paddingTop = paddingLeft;
            scaleY.paddingBottom = paddingRight;
            scaleY.swap = !scaleY.swap;
            scaleY.direction = -1;

            return {
                series,
                seriesNormalized,
                maxX,
                maxY,
                minX,
                minY,
                scaleX,
                scaleY
            };

        },

        reverse({series, seriesNormalized, minX, maxX, maxY, minY}) {
            if (_.isArray(series)) {
                series = _.cloneDeep(series).reverse();
            }
            return {
                series,
                seriesNormalized,
                maxX,
                maxY,
                minX,
                minY
            };
        }

    },

    transform(props, method, options = null) {
        if (!_.isArray(method)) {
            method = [method];
        }

        return _.reduce(method, (props, method) => {
            if (_.isString(method)) {
                if (helpers.transforms[method]) {
                    return _.defaults(helpers.transforms[method](props, options), props);
                } else {
                    return props;
                }
            } else if (_.isFunction(method)) {
                return _.defaults(method(props, options), props);
            } else if (_.isObject(method)) {
                return helpers.transform(props, method.method, method.options);
            } else {
                return props;
            }
        }, props);
    },

    value(attribute, args) {
        if (_.isArray(attribute)) {
            var result;
            _.forEach(attribute, attr => {
                attr = _.isFunction(attr) ? attr(args) : attr;
                if (_.isPlainObject(attr) && _.isUndefined(attr._owner) && _.isUndefined(attr.props)) {
                    result = _.defaults(result || {}, attr);
                } else if (!_.isUndefined(attr)) {
                    result = attr;
                    return false;
                }
            });
            return result;
        } else {
            return _.isFunction(attribute) ? attribute(args) : attribute;
        }
    },

    colorFunc(colors) {
        if (_.isFunction(colors)) {
            return colors;
        } else if (_.isEmpty(colors)) {
            return d3.scale.category20();
        } else if (_.isString(colors)) {
            return d3.scale[colors]();
        } else {
            return d3.scale.ordinal().range(colors);
        }
    },

    propTypes: {
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
                    y: PropTypes.number,
                    color: PropTypes.string,
                    opacity: PropTypes.number,
                    style: PropTypes.object
                })
            ]))
        }))
    }

};

module.exports = helpers;
