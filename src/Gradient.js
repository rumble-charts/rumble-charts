'use strict';

var React = require('react'),
    _ = require('./_');

var counter = 0;

var propTypePoint = React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
);

var propTypeNumber = React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]);

var Gradient = React.createClass({

    displayName: 'Gradient',

    propTypes: {
        id: React.PropTypes.string,
        idPrefix: React.PropTypes.string,
        type: React.PropTypes.oneOf(['linear', 'radial']),
        spreadMethod: React.PropTypes.oneOf(['pad', 'repeat', 'reflect']),
        gradientUnits: React.PropTypes.oneOf(['userSpaceOnUse', 'objectBoundingBox']),
        gradientTransform: React.PropTypes.string,
        // for linear gradient
        from: propTypePoint,
        to: propTypePoint,
        // for radial gradient
        center: propTypePoint,
        focalPoint: propTypePoint,
        cx: propTypeNumber,
        cy: propTypeNumber,
        fx: propTypeNumber,
        fy: propTypeNumber,
        r: propTypeNumber,
        x1: propTypeNumber,
        y1: propTypeNumber,
        x2: propTypeNumber,
        y2: propTypeNumber,
        radius: propTypeNumber,
        children: React.PropTypes.node
    },

    // init

    getDefaultProps() {
        return {
            type: 'linear',
            idPrefix: 'chartGradient',
            gradientUnits: 'objectBoundingBox',
            spreadMethod: 'pad',
            // for linear gradient
            from: ['0%', '0%'],
            to: ['100%', '0%'],
            // for radial gradient
            center: ['50%', '50%']
        };
    },

    // helpers

    getId() {
        if (this.props.id) {
            return this.props.id;
        }
        if (!this._id) {
            counter++;
            this._id = this.props.idPrefix + counter;
        }
        return this._id;
    },

    getLink() {
        return 'url(#' + this.getId() + ')';
    },

    // render

    renderRadial() {
        const {
            center, focalPoint, radius, gradientUnits, spreadMethod, gradientTransform,
            cx, cy, fx, fy, r
        } = this.props;

        const _cx = _.isUndefined(cx) ? (center && center[0]) : cx;
        const _cy = _.isUndefined(cy) ? (center && center[1]) : cy;
        const _fx = _.isUndefined(fx) ? (focalPoint && focalPoint[0]) : fx;
        const _fy = _.isUndefined(fy) ? (focalPoint && focalPoint[1]) : fy;
        const _r = _.isUndefined(r) ? radius : r;

        return <radialGradient
            id={this.getId()}
            gradientUnits={gradientUnits} gradientTransform={gradientTransform} spreadMethod={spreadMethod}
            cx={_cx} cy={_cy} fx={_fx} fy={_fy} r={_r}>
            {this.props.children}
        </radialGradient>;
    },

    renderLinear() {
        const {from, to, gradientUnits, spreadMethod, gradientTransform, x1, y1, x2, y2} = this.props;

        const _x1 = _.isUndefined(x1) ? (from && from[0]) : x1;
        const _y1 = _.isUndefined(y1) ? (from && from[1]) : y1;
        const _x2 = _.isUndefined(x2) ? (to && to[0]) : x2;
        const _y2 = _.isUndefined(y2) ? (to && to[1]) : y2;

        return <linearGradient
            id={this.getId()}
            gradientUnits={gradientUnits} gradientTransform={gradientTransform} spreadMethod={spreadMethod}
            x1={_x1} y1={_y1} x2={_x2} y2={_y2}>
            {this.props.children}
        </linearGradient>;

    },

    render() {
        let {type} = this.props;

        if (type === 'radial') {
            return this.renderRadial();
        } else {
            return this.renderLinear();
        }
    }

});

module.exports = Gradient;
