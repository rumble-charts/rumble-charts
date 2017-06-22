'use strict';

const React = require('react'),
    PropTypes = require('prop-types'),
    d3 = require('d3'),
    _isUndefined = require('lodash/isUndefined'),
    _map = require('lodash/map'),
    _isNumber = require('lodash/isNumber'),
    _isArray = require('lodash/isArray'),
    _defaults = require('lodash/defaults'),
    _isEmpty = require('lodash/isEmpty'),
    _omitBy = require('lodash/omitBy'),
    _isString = require('lodash/isString'),
    _pick = require('lodash/pick'),
    _assign = require('lodash/assign'),
    _defaultsDeep = require('lodash/defaultsDeep'),
    _isFunction = require('lodash/isFunction'),
    _filter = require('lodash/filter'),
    _min = require('lodash/min'),
    _max = require('lodash/max'),
    _sortBy = require('lodash/sortBy'),
    _forEach = require('lodash/forEach'),
    _cloneDeep = require('lodash/cloneDeep'),
    _reduce = require('lodash/reduce'),
    _isObject = require('lodash/isObject'),
    _isPlainObject = require('lodash/isPlainObject');

const limitsPropNames = ['maxX', 'maxY', 'minX', 'minY'];

const isInvalidLimit = value => {
    return _isUndefined(value) || value === Infinity || value === -Infinity;
};

const helpers = {

    normalizeSeries(props) {
        var maxX = -Infinity,
            maxY = -Infinity,
            minX = Infinity,
            minY = Infinity;

        var series = _map(props.series, series => {

            let data = _map(series.data, (item, index) => {

                var d;
                if (!props.seriesNormalized) {
                    d = {};
                    if (_isNumber(item)) {
                        d.x = index;
                        d.y = item;
                    } else if (_isArray(item)) {
                        d.x = item[0];
                        d.y = item[1];
                    } else {
                        d = item || {};
                        if (_isUndefined(d.x)) {
                            d.x = index;
                        }
                    }
                } else {
                    d = item;
                }
                if (_isUndefined(props.maxX)) {
                    maxX = Math.max(maxX, d.x || 0);
                }
                if (_isUndefined(props.maxY)) {
                    maxY = Math.max(maxY, d.y || 0);
                }
                if (_isUndefined(props.minX)) {
                    minX = Math.min(minX, d.x || 0);
                }
                if (_isUndefined(props.minY)) {
                    minY = Math.min(minY, d.y || 0);
                }

                return d;
            });

            return _defaults({data}, series);
        });
        if (_isEmpty(series)) {
            series = undefined;
        }
        if (!_isUndefined(props.maxX)) {
            maxX = props.maxX;
        }
        if (!_isUndefined(props.maxY)) {
            maxY = props.maxY;
        }
        if (!_isUndefined(props.minX)) {
            minX = props.minX;
        }
        if (!_isUndefined(props.minY)) {
            minY = props.minY;
        }

        return _omitBy({
            seriesNormalized: true,
            series,
            maxX,
            maxY,
            minX,
            minY
        }, isInvalidLimit);
    },

    normalizeNumber(number, absolute = null) {
        if (_isString(number)) {
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

        if (_isString(position)) {
            position = position.split(' ');
        }
        if (_isArray(position)) {
            position = _map(position, pos => pos.toLowerCase ? pos.toLowerCase() : pos);
            var [x, y] = position;
            if (['top', 'bottom', 'middle'].indexOf(position[0]) !== -1) {
                y = position[0];
            }
            if (['left', 'right', 'center'].indexOf(position[1]) !== -1) {
                x = position[1];
            }
            if (_isString(x)) {
                if (x === 'left') {
                    x = 0;
                } else if (x === 'right') {
                    x = layerWidth - width;
                } else if (x === 'center') {
                    x = (layerWidth - width) / 2;
                } else {
                    x = helpers.normalizeNumber(x, layerWidth);
                }
            } else if (_isUndefined(x)) {
                x = 0;
            }
            if (_isString(y)) {
                if (y === 'top') {
                    y = 0;
                } else if (y === 'bottom') {
                    y = layerHeight - height;
                } else if (y === 'middle') {
                    y = (layerHeight - height) / 2;
                } else {
                    y = helpers.normalizeNumber(y, layerHeight);
                }
            } else if (_isUndefined(y)) {
                y = 0;
            }
            return {x, y};
        }

    },

    proxyChildren(children, seriesProps = null, extraProps = {}) {

        var limits = _pick(seriesProps, limitsPropNames);
        seriesProps = helpers.normalizeSeries(seriesProps);
        var limitsCalculated = _pick(seriesProps, limitsPropNames);
        var {series} = seriesProps;

        return React.Children.map(children, child => {

            if (!child) {
                return child;
            }

            var props = {};
            _assign(props, child.props);
            _defaultsDeep(props, _isFunction(extraProps) ? extraProps(child) : extraProps);

            var childLimits = _pick(child.props, limitsPropNames);
            var childSeriesProps = helpers.normalizeSeries(_defaults(child.props, {
                layerWidth: props.layerWidth,
                layerHeight: props.layerHeight
            }));
            var childLimitsCalculated = _pick(childSeriesProps, limitsPropNames);

            _defaults(props, childLimits, limits, childLimitsCalculated, limitsCalculated);

            if (!child.props.series) {
                if (_isUndefined(child.props.seriesIndex)) {
                    props.series = series;
                } else if (_isNumber(child.props.seriesIndex)) {
                    props.series = [series[child.props.seriesIndex]];
                } else if (_isArray(child.props.seriesIndex)) {
                    props.series = _map(child.props.seriesIndex, index => series[index]);
                } else if (_isFunction(child.props.seriesIndex)) {
                    props.series = _filter(series, child.props.seriesIndex);
                }
            } else {
                props.series = childSeriesProps.series;
            }
            props.seriesNormalized = true;

            props = _omitBy(props, _isUndefined);

            return React.cloneElement(child, props);

        });
    },

    transforms: {
        stack(props, options) {
            var {normalize} = options || {};

            let {series, seriesNormalized, maxX, maxY, minX, minY} = props;

            var stackedY = [], lowestY = [];
            series = _map(series, series => {
                var newSeries = {};
                newSeries.data = _map(series.data, (point, pointIndex) => {
                    stackedY[pointIndex] = stackedY[pointIndex] || 0;
                    if (_isUndefined(lowestY[pointIndex])) {
                        lowestY[pointIndex] = stackedY[pointIndex];
                    }
                    var newPoint = {
                        y0: stackedY[pointIndex],
                        y: stackedY[pointIndex] + point.y
                    };
                    stackedY[pointIndex] = newPoint.y;

                    return _defaults(newPoint, point);
                });
                return _defaults(newSeries, series);
            });
            minY = _min(lowestY);
            var stackedMaxY = _max(stackedY);
            maxY = Math.max(stackedMaxY, maxY);

            if (normalize) {

                var ratios = _map(stackedY, y => stackedMaxY / y);
                series = _map(series, series => {
                    var newSeries = {};
                    newSeries.data = _map(series.data, (point, pointIndex) => {
                        var newPoint = {
                            y0: point.y0 * ratios[pointIndex],
                            y: point.y * ratios[pointIndex]
                        };
                        return _defaults(newPoint, point);
                    });
                    return _defaults(newSeries, series);
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

            series = _map(series, series => {
                var newSeries = {};
                newSeries.data = _sortBy(series.data, 'y');
                if (direction === 'desc') {
                    newSeries.data.reverse();
                }
                newSeries.data = _map(newSeries.data, (point, pointIndex) => {
                    var newPoint = {
                        realX: point.x,
                        x: pointIndex
                    };
                    return _defaults(newPoint, point);
                });
                newSeries.data = _sortBy(newSeries.data, 'realX');
                return _defaults(newSeries, series);
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

            series = _map(series, series => {
                var newSeries = {};
                newSeries.data = _map(series.data, point => {
                    var newPoint = {
                        y0: 0
                    };
                    return _defaults(newPoint, point);
                });
                return _defaults(newSeries, series);
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
            _forEach(series, (series, seriesIndex) => {
                _forEach(series.data, (point, pointIndex) => {
                    newSeries[pointIndex] = newSeries[pointIndex] || {data: []};
                    maxX = Math.max(maxX, seriesIndex);
                    newSeries[pointIndex].data[seriesIndex] = _defaults({
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
            scaleX = _cloneDeep(scaleX);
            scaleY = _cloneDeep(scaleY);
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
            if (_isArray(series)) {
                series = _cloneDeep(series).reverse();
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
        if (!_isArray(method)) {
            method = [method];
        }

        return _reduce(method, (props, method) => {
            if (_isString(method)) {
                if (helpers.transforms[method]) {
                    return _defaults(helpers.transforms[method](props, options), props);
                } else {
                    return props;
                }
            } else if (_isFunction(method)) {
                return _defaults(method(props, options), props);
            } else if (_isObject(method)) {
                return helpers.transform(props, method.method, method.options);
            } else {
                return props;
            }
        }, props);
    },

    value(attribute, args) {
        if (_isArray(attribute)) {
            var result;
            _forEach(attribute, attr => {
                attr = _isFunction(attr) ? attr(args) : attr;
                if (_isPlainObject(attr) && _isUndefined(attr._owner) && _isUndefined(attr.props)) {
                    result = _defaults(result || {}, attr);
                } else if (!_isUndefined(attr)) {
                    result = attr;
                    return false;
                }
            });
            return result;
        } else {
            return _isFunction(attribute) ? attribute(args) : attribute;
        }
    },

    colorFunc(colors) {
        if (_isFunction(colors)) {
            return colors;
        } else if (_isEmpty(colors)) {
            return d3.scale.category20();
        } else if (_isString(colors)) {
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
