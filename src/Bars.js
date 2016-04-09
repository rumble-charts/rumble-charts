'use strict';

const React = require('react'),
    _ = require('lodash'),
    helpers = require('./helpers');

const Bars = React.createClass({

    displayName: 'Bars',

    propTypes: {
        seriesIndex: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.array,
            React.PropTypes.func
        ]),
        series: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            color: React.PropTypes.string,
            opacity: React.PropTypes.number,
            style: React.PropTypes.object,
            data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
                React.PropTypes.number,
                React.PropTypes.arrayOf(React.PropTypes.number),
                React.PropTypes.shape({
                    x: React.PropTypes.number,
                    y: React.PropTypes.number,
                    color: React.PropTypes.string,
                    opacity: React.PropTypes.number,
                    style: React.PropTypes.object
                })
            ]))
        })),
        scaleX: React.PropTypes.object,
        scaleY: React.PropTypes.object,
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        colors: React.PropTypes.oneOfType([
            React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            React.PropTypes.arrayOf(React.PropTypes.string),
            React.PropTypes.func
        ]),
        opacity: React.PropTypes.number,
        style: React.PropTypes.object,
        className: React.PropTypes.string,

        combined: React.PropTypes.bool,
        groupPadding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),
        innerPadding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        groupStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        barVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        barAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        barStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        barWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func])
    },

    // init

    getDefaultProps() {
        return {
            groupPadding: 0,
            innerPadding: 0,
            colors: 'category20',
            seriesVisible: true,
            barVisible: true
        };
    },

    // helpers

    getPaddings() {
        const {props} = this;
        let {innerPadding, groupPadding, layerWidth} = props;
        innerPadding = helpers.value(innerPadding, props);
        innerPadding = helpers.normalizeNumber(innerPadding, layerWidth);
        groupPadding = helpers.value(groupPadding, props);
        groupPadding = helpers.normalizeNumber(groupPadding, layerWidth);
        return {
            innerPadding,
            groupPadding
        };
    },

    getBarWidth() {
        const {props, x} = this;
        let {barWidth, layerWidth} = props;
        let {innerPadding, groupPadding} = this.getPaddings(props);
        if (barWidth) {
            barWidth = helpers.value(barWidth, props);
            return helpers.normalizeNumber(barWidth, layerWidth);
        } else {
            const baseWidth = Math.abs(x(1) - x(0));
            if (props.combined) {
                return baseWidth - innerPadding;
            } else {
                return (baseWidth - groupPadding) / (props.series || []).length - innerPadding;
            }
        }
    },

    // render

    renderSeries(series, index) {
        const {x, y, barWidth, props} = this;
        const {scaleX, scaleY, className} = props;
        let {seriesVisible, seriesStyle, seriesAttributes} = props;

        seriesVisible = helpers.value(seriesVisible, {seriesIndex: index, series, props});
        if (!seriesVisible) {
            return;
        }

        seriesAttributes = helpers.value(seriesAttributes, {seriesIndex: index, series, props});
        seriesStyle = helpers.value(seriesStyle, {seriesIndex: index, series, props});

        let deltaX = 0;
        if (!props.combined) {
            deltaX = barWidth * index -
                ((props.series || []).length - 1) * 0.5 * barWidth +
                (index - ((props.series || []).length - 1) / 2) * this.innerPadding;
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

    },

    renderBar(x, y, width, height, seriesIndex, pointIndex, point) {
        let {props} = this;
        const {className, scaleX, scaleY} = props;
        let {barVisible, barAttributes, barStyle, groupStyle} = props;
        const series = props.series[seriesIndex];

        barVisible = helpers.value(barVisible, {seriesIndex, pointIndex, point, series, props});
        if (!barVisible) {
            return;
        }

        groupStyle = helpers.value(groupStyle, {seriesIndex, pointIndex, point, series, props});

        const transform = 'translate3d(' + x + 'px,' + y + 'px,0px)';
        const style = _.defaults({
            transform,
            WebkitTransform: transform,
            MozTransform: transform
        }, groupStyle);

        const d = (scaleX.swap || scaleY.swap) ?
            ('M0,' + (-height / 2) + ' h' + (width) + ' v' + height + ' h' + (-width) + ' Z') :
            ('M' + (-width / 2) + ',0 v' + height + ' h' + width + ' v' + (-height) + ' Z');

        barAttributes = helpers.value(barAttributes, {seriesIndex, pointIndex, point, series, props});
        barStyle = helpers.value([point.style, series.style, barStyle], {
            seriesIndex, pointIndex, point, series, props
        });

        return <g
            key={pointIndex}
            className={className && (className + '-bar ' + className + '-bar-'  + pointIndex)}
            style={style}>
            <path
                style={barStyle}
                fill={point.color || series.color || this.color(seriesIndex)}
                fillOpacity={point.opacity}
                d={d}
                {...barAttributes}/>
        </g>;
    },

    render: function () {
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
        this.color = helpers.colorFunc(colors);

        return <g
            className={className}
            style={style}
            opacity={opacity}>
            {_.map(props.series, this.renderSeries)}
        </g>;

    }

});

module.exports = Bars;
