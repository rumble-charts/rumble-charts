import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {timer} from 'd3-timer';
import {interpolate as d3Interpolate} from 'd3-interpolate';

import eases from './helpers/eases';
import proxyChildren from './helpers/proxyChildren';
import normalizeSeries from './helpers/normalizeSeries';

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

        this.state = _.assign({}, this.props, normalizeSeries(this.props));
    }

    // lifecycle

    componentWillReceiveProps(nextProps) {

        const interpolate = d3Interpolate(
            _.pick(this.state, this.props.interpolateProps),
            _.pick(
                _.assign({}, nextProps, normalizeSeries(nextProps)),
                this.props.interpolateProps
            )
        );

        const {duration, onStart, onEnd, logFPS} = this.props;
        let {ease} = this.props;
        ease = _.isString(ease) ?
            eases[ease] :
            (_.isFunction(ease) ? ease : eases['linear']);

        let i = 0;
        this._timer && this._timer.stop();
        onStart && onStart();
        const _timer = timer(p => {
            i++;
            if (p >= duration) {
                p = duration;
                this.setState(interpolate(ease(p / duration)));

                onEnd && onEnd();
                if (logFPS) {
                    console.warn(i * (1000 / duration) + 'fps; ' + i + ' frames in ' + duration + 'ms');
                }
                _timer.stop();
            } else {
                this.setState(interpolate(ease(p / duration)));
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
