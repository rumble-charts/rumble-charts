'use strict';

var React = require('react'),
    _ = require('lodash'),
    d3 = require('d3'),
    helpers = require('./helpers');

var maxAngle = 2 * Math.PI;

var Pies = React.createClass({

    displayName: 'Pies',

    propTypes: {
        seriesIndex: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.array,
            React.PropTypes.func
        ]),
        series: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            color: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
            opacity: React.PropTypes.number,
            style: React.PropTypes.object,
            data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
                React.PropTypes.number,
                React.PropTypes.arrayOf(React.PropTypes.number),
                React.PropTypes.shape({
                    x: React.PropTypes.number,
                    y: React.PropTypes.number,
                    color: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
                    opacity: React.PropTypes.number,
                    style: React.PropTypes.object
                })
            ]))
        })),
        colors: React.PropTypes.oneOfType([
            React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            React.PropTypes.arrayOf(React.PropTypes.string),
            React.PropTypes.func
        ]),
        style: React.PropTypes.object,
        className: React.PropTypes.string,

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

        pieWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
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
        let { innerPadding, groupPadding } = props;
        let outerRadius = this.getOuterRadius(props);
        innerPadding = helpers.normalizeNumber(innerPadding, outerRadius) || 0;
        groupPadding = helpers.normalizeNumber(groupPadding, outerRadius) || 0;
        return {
            innerPadding,
            groupPadding
        };
    },

    getPieWidth(x, props) {
        var { pieWidth } = props;
        var { innerPadding, groupPadding } = this.getPaddings(props);
        if (pieWidth) {
            return helpers.normalizeNumber(pieWidth, this.getOuterRadius(props));
        } else {
            var baseWidth = Math.abs(x(1) - x(0));
            if (props.combined) {
                return baseWidth - innerPadding;
            } else {
                return (baseWidth - groupPadding) / props.series.length - innerPadding;
            }
        }
    },

    // render

    renderArcPart({startAngle, endAngle, maxAngle, pathProps, arc, key}) {
        var pathList = [];
        var lapIndex = 0;
        while (endAngle >= 4 * Math.PI) {
            endAngle -= 2 * Math.PI;
            if (endAngle < startAngle) {
                startAngle -= 2 * Math.PI;
            }
        }
        var lapsCount = Math.abs((endAngle - startAngle) / maxAngle);
        while (lapIndex < lapsCount) {

            let d = arc({
                startAngle: startAngle,
                endAngle: Math.min(startAngle + maxAngle, endAngle)
            });
            startAngle += maxAngle;

            /* jshint ignore:start */
            pathList.push(<path
                key={'' + key + lapIndex}
                {...pathProps}
                d={d}
            />);
            /* jshint ignore:end */
            lapIndex++;
        }
        return pathList;
    },

    renderArc(startAngle, endAngle, radius, pieWidth, seriesIndex, pointIndex, point) {
        let { props } = this;
        let { className, pieVisible, pieAttributes, pieStyle, groupStyle, cornerRadius } = props;
        let series = props.series[seriesIndex];

        pieVisible = helpers.value(pieVisible, {seriesIndex, pointIndex, point, props});
        if (!pieVisible) {
            return;
        }

        let halfWidth = pieWidth / 2;

        cornerRadius = helpers.value(cornerRadius, {seriesIndex, pointIndex, point, props});

        let arc = d3.svg.arc()
            .cornerRadius(helpers.normalizeNumber(cornerRadius, pieWidth))
            .padRadius(10)
            .innerRadius(radius - halfWidth)
            .outerRadius(radius + halfWidth);

        var fillColor = point.color || series.color || this.color(seriesIndex);
        if (_.isArray(fillColor) && _.uniq(fillColor).length === 1) {
            fillColor = fillColor[0];
        }

        pieStyle = helpers.value([point.style, pieStyle], {seriesIndex, pointIndex, point, props});
        pieAttributes = helpers.value(pieAttributes, {seriesIndex, pointIndex, point, props});

        var pathProps = _.extend({
            style: pieStyle,
            fill: fillColor,
            fillOpacity: _.isUndefined(point.opacity) ? series.opacity : point.opacity
        }, pieAttributes);

        var pathList = [];
        // fill color interpolation
        if (_.isArray(fillColor)) {

            let interpolateAngle = d3.interpolate(startAngle, endAngle);
            _.each(fillColor, (color, index) => {

                if (index === fillColor.length - 1) {
                    return;
                }

                let interpolateFillColor = d3.interpolate(color, fillColor[index + 1]);
                let step = 1 / ((endAngle - startAngle) / this.props.gradientStep);

                _.each(_.range(0, 1, step), (i) => {

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

        groupStyle = helpers.value(groupStyle, {seriesIndex, pointIndex, point, props});

        /* jshint ignore:start */
        return <g
            key={pointIndex}
            className={className && (className + '-bar')}
            style={groupStyle}>
            {pathList}
        </g>;
        /* jshint ignore:end */
    },

    render: function () {
        let { props } = this;
        let { className, style, minX, maxX, minY, maxY, position, layerWidth, layerHeight, colors } = props;

        let innerRadius = this.getInnerRadius(props);
        let outerRadius = this.getOuterRadius(props);

        let radialScale = d3.scale.linear()
            .range([outerRadius, innerRadius])
            .domain(props.scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

        let circularScale = d3.scale.linear()
            .range([props.startAngle, props.endAngle])
            .domain(props.scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);

        let { series } = props;

        let { innerPadding } = this.getPaddings(props);
        let pieWidth = this.getPieWidth(radialScale, props);
        let _startAngle = circularScale(0);
        this.color = helpers.colorFunc(colors);

        let coords = helpers.getCoords(position || '', layerWidth, layerHeight, outerRadius * 2, outerRadius * 2);

        let transform = 'translate3d(' + (coords.x + outerRadius) + 'px,' + (coords.y + outerRadius) + 'px,0px)';
        let chartStyle = _.defaults({
            transform,
            WebkitTransform: transform,
            MozTransform: transform
        }, style);

        let halfPadAngle = props.padAngle / 2 || 0;

        /* jshint ignore:start */
        return <g className={className} style={chartStyle}>
            {_.map(series, (series, index) => {

                let { seriesVisible, seriesAttributes, seriesStyle } = props;

                seriesVisible = helpers.value(seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, {seriesIndex: index, series, props});
                seriesStyle = helpers.value([series.style || seriesStyle], {seriesIndex: index, series, props});

                var deltaRadial = 0;
                if (!props.combined) {
                    deltaRadial = pieWidth * index - (props.series.length - 1) * 0.5 * pieWidth +
                        (index - (props.series.length - 1) / 2) * innerPadding;
                }

                return <g
                    key={index}
                    className={className && (className + '-series ' + className + '-series-' + index)}
                    style={seriesStyle}
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
        /* jshint ignore:end */
    }

});

module.exports = Pies;
