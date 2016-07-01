'use strict';

const React = require('react'),
    _ = require('./_'),
    d3 = require('d3'),
    d3_timer = require('d3-timer'),
    helpers = require('./helpers');

/**
 * Animates (actually interpolates) your `series` data. Very useful when you want to have a simple transitions
 * between data state.
 *
 * As a wrapper it takes `series` obtained from its parent and gives it to its children.
 *
 * @example ../docs/examples/Animate.md
 */
const Animate = React.createClass({

    displayName: 'Animate',

    propTypes: {
        /**
         * Simple
         */
        series: React.PropTypes.array,
        interpolateProps: React.PropTypes.arrayOf(React.PropTypes.string),
        proxyProps: React.PropTypes.arrayOf(React.PropTypes.string),
        duration: React.PropTypes.number,
        logFPS: React.PropTypes.bool,
        ease: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.oneOf([
                'linear', 'poly', 'quad', 'cubic', 'sin', 'exp',
                'circle', 'bounce', 'elastic', 'back',
                'linear-in', 'poly-in', 'quad-in', 'cubic-in', 'sin-in', 'exp-in',
                'circle-in', 'bounce-in', 'elastic-in', 'back-in',
                'linear-out', 'poly-out', 'quad-out', 'cubic-out', 'sin-out', 'exp-out',
                'circle-out', 'bounce-out', 'elastic-out', 'back-out',
                'linear-in-out', 'poly-in-out', 'quad-in-out', 'cubic-in-out', 'sin-in-out', 'exp-in-out',
                'circle-in-out', 'bounce-in-out', 'elastic-in-out', 'back-in-out',
                'linear-out-in', 'poly-out-in', 'quad-out-in', 'cubic-out-in', 'sin-out-in', 'exp-out-in',
                'circle-out-in', 'bounce-out-in', 'elastic-out-in', 'back-out-in'
            ])
        ]),
        onStart: React.PropTypes.func,
        onEnd: React.PropTypes.func
    },

    // init

    getDefaultProps() {
        return {
            interpolateProps: ['series', 'maxX', 'maxY', 'minX', 'minY', 'layerWidth', 'layerHeight'],
            proxyProps: ['seriesNormalized'],
            duration: 500,
            ease: 'linear'
        };
    },

    getInitialState() {
        return this.props;
    },

    // lifecycle

    componentWillReceiveProps(nextProps) {
        var interpolate = d3.interpolateObject(
            _.pick(this.state, this.props.interpolateProps),
            _.pick(nextProps, this.props.interpolateProps)
        );

        var {duration, ease, onStart, onEnd, logFPS} = this.props;
        ease = _.isString(ease) ?
            d3.ease(ease) :
            (_.isFunction(ease) ? ease : d3.ease('linear'));

        var i = 0;
        this._timer && this._timer.stop();
        onStart && onStart();
        var _timer = d3_timer.timer(p => {
            this.setState(interpolate(ease(p / duration)));
            i++;
            if (p >= duration) {
                onEnd && onEnd();
                if (logFPS) {
                    console.warn(i * (1000 / duration) + 'fps; ' + i + ' frames in ' + duration + 'ms');
                }
                _timer.stop();
            }
        });
        this._timer = _timer;
    },

    componentWillUnmount() {
        this._timer && this._timer.stop();
    },

    // render

    render: function () {
        let {props, state} = this;

        return <g className={props.className}>
            {helpers.proxyChildren(
                props.children,
                _.omitBy(state, _.isUndefined),
                {
                    layerWidth: state.layerWidth,
                    layerHeight: state.layerHeight,
                    scaleX: props.scaleX,
                    scaleY: props.scaleY
                }
            )}
        </g>;
    }

});

module.exports = Animate;

d3.interpolators.push(function (a, b) {
    var c, i, an = typeof a == 'number';
    if (b && !_.isUndefined(b.x) && !_.isUndefined(b.y)) {
        // point
        a = a || {};
        c = {};
        i = {};
        var k;
        for (k in a) {
            if (k in b) {
                i[k] = d3.interpolate(a[k], b[k]);
            }
        }
        for (k in b) {
            if (an && k === 'y') {
                // from number to object
                i[k] = d3.interpolate(a, b[k]);
            } else if (!an && !(k in a)) {
                c[k] = b[k];
            }
        }
        return function (t) {
            for (k in i) {
                c[k] = i[k](t);
            }
            return c;
        };
    } else if (b && b[0] && (!_.isUndefined(b[0].data) || (!_.isUndefined(b[0].x) && !_.isUndefined(b[0].y)))) {
        // series or points
        a = a || [];
        c = [];
        var x = [],
            na = a.length,
            nb = b.length,
            n0 = Math.min(na, nb);
        for (i = 0; i < n0; ++i) {
            x.push(d3.interpolate(a[i], b[i]));
        }
        for (; i < nb; ++i) {
            c[i] = b[i];
        }
        return function (t) {
            for (i = 0; i < n0; ++i) {
                c[i] = x[i](t);
            }
            return c;
        };
    }
});
