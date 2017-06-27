import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    isFunction,
    isString,
    isUndefined,
    omitBy,
    pick,
} from 'lodash';
import d3 from 'd3';
import {timer} from 'd3-timer';

import proxyChildren from './helpers/proxyChildren';

/**
 * Animates (actually interpolates) your `series` data. Very useful when you want to have a simple transitions
 * between data state.
 *
 * As a wrapper it takes `series` obtained from its parent and gives it to its children.
 *
 * @example ../docs/examples/Animate.md
 */
export default class Animate extends Component {

    constructor(props) {
        super(props);

        this.state = this.props;
    }

    // lifecycle

    componentWillReceiveProps(nextProps) {
        const interpolate = d3.interpolateObject(
            pick(this.state, this.props.interpolateProps),
            pick(nextProps, this.props.interpolateProps)
        );

        const {duration, onStart, onEnd, logFPS} = this.props;
        let {ease} = this.props;
        ease = isString(ease) ?
            d3.ease(ease) :
            (isFunction(ease) ? ease : d3.ease('linear'));

        let i = 0;
        this._timer && this._timer.stop();
        onStart && onStart();
        const _timer = timer(p => {
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
    }

    componentWillUnmount() {
        this._timer && this._timer.stop();
    }

    // render

    render() {
        const {props, state} = this;

        return <g className={props.className}>
            {proxyChildren(
                props.children,
                omitBy(state, isUndefined),
                {
                    layerWidth: state.layerWidth,
                    layerHeight: state.layerHeight,
                    scaleX: props.scaleX,
                    scaleY: props.scaleY
                }
            )}
        </g>;
    }

}

Animate.displayName = 'Animate';

Animate.propTypes = {
    /**
     * Simple
     */
    series: PropTypes.array,
    interpolateProps: PropTypes.arrayOf(PropTypes.string),
    proxyProps: PropTypes.arrayOf(PropTypes.string),
    duration: PropTypes.number,
    logFPS: PropTypes.bool,
    ease: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.oneOf([
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
    onStart: PropTypes.func,
    onEnd: PropTypes.func
};

Animate.defaultProps = {
    interpolateProps: ['series', 'maxX', 'maxY', 'minX', 'minY', 'layerWidth', 'layerHeight'],
    proxyProps: ['seriesNormalized'],
    duration: 500,
    ease: 'linear'
};

d3.interpolators.push(function(a, b) {
    let c, i, an = typeof a == 'number';
    if (b && !isUndefined(b.x) && !isUndefined(b.y)) {
        // point
        a = a || {};
        c = {};
        i = {};
        let k;
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
        return function(t) {
            for (k in i) {
                c[k] = i[k](t);
            }
            return c;
        };
    } else if (b && b[0] && (!isUndefined(b[0].data) || (!isUndefined(b[0].x) && !isUndefined(b[0].y)))) {
        // series or points
        a = a || [];
        c = [];
        let x = [],
            na = a.length,
            nb = b.length,
            n0 = Math.min(na, nb);
        for (i = 0; i < n0; ++i) {
            x.push(d3.interpolate(a[i], b[i]));
        }
        for (; i < nb; ++i) {
            c[i] = b[i];
        }
        return function(t) {
            for (i = 0; i < n0; ++i) {
                c[i] = x[i](t);
            }
            return c;
        };
    }
});
