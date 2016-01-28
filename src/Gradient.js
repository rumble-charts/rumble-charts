'use strict';

var React = require('react'),
    _ = require('lodash');

var counter = 0;

var propTypePoint = React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
);

var Gradient = React.createClass({

    displayName: 'Gradient',

    propTypes: {
        type: React.PropTypes.oneOf(['linear', 'radial']),
        spreadMethod: React.PropTypes.oneOf(['pad', 'repeat', 'reflect']),
        gradientUnits: React.PropTypes.oneOf(['userSpaceOnUse', 'objectBoundingBox']),
        gradientTransform: React.PropTypes.string,
        // for linear gradient
        from: propTypePoint,
        to: propTypePoint,
        // for radial gradient
        canter: propTypePoint,
        focalPoint: propTypePoint,
        radius: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
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
        let { center, focalPoint, radius, gradientUnits, spreadMethod, gradientTransform,
            cx, cy, fx, fy, r } = this.props;

        let _cx = (_.isUndefined(center) || _.isUndefined(center[0])) ? cx : center[0];
        let _cy = (_.isUndefined(center) || _.isUndefined(center[1])) ? cy : center[1];
        let _fx = (_.isUndefined(focalPoint) || _.isUndefined(focalPoint[0])) ? fx : focalPoint[0];
        let _fy = (_.isUndefined(focalPoint) || _.isUndefined(focalPoint[1])) ? fy : focalPoint[1];
        let _r = _.isUndefined(radius) ? r : radius;

        /* jshint ignore:start */
        return <radialGradient
            id={this.getId()}
            gradientUnits={gradientUnits} gradientTransform={gradientTransform} spreadMethod={spreadMethod}
            cx={_cx} cy={_cy} fx={_fx} fy={_fy} r={_r}>
            {this.props.children}
        </radialGradient>;
        /* jshint ignore:end */
    },

    renderLinear() {
        let { from, to, gradientUnits, spreadMethod, gradientTransform, x1, y1, x2, y2 } = this.props;

        let _x1 = (_.isUndefined(from) || _.isUndefined(from[0])) ? x1 : from[0];
        let _y1 = (_.isUndefined(from) || _.isUndefined(from[1])) ? y1 : from[1];
        let _x2 = (_.isUndefined(to) || _.isUndefined(to[0])) ? x2 : to[0];
        let _y2 = (_.isUndefined(to) || _.isUndefined(to[1])) ? y2 : to[1];

        /* jshint ignore:start */
        return <linearGradient
            id={this.getId()}
            gradientUnits={gradientUnits} gradientTransform={gradientTransform} spreadMethod={spreadMethod}
            x1={_x1} y1={_y1} x2={_x2} y2={_y2}>
            {this.props.children}
        </linearGradient>;
        /* jshint ignore:end */
    },

    render() {
        let { type } = this.props;

        if (type === 'radial') {
            return this.renderRadial();
        } else {
            return this.renderLinear();
        }
    }

});

module.exports = Gradient;
