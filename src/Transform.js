'use strict';

var React = require('react'),
    _ = require('./_'),
    helpers = require('./helpers');

/**
 * Transforms `series` data according chosen `method`.
 *
 * As a wrapper it takes `series` obtained from its parent and gives it to its children.
 *
 * @example ../docs/examples/Transform.md
 */
var Transform = React.createClass({

    displayName: 'Transform',

    propTypes: {
        series: React.PropTypes.array,
        /**
         * Possible string values: "`stack`", "`stackNormalized`", "`sort`", "`unstack`",
         * "`transpose`", "`rotate`", "`reverse`". Also you can define it as function that
         * receives props as an object, transforms it somehow and returns changes props as an object.
         */
        method: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func,
            React.PropTypes.array
        ])
    },

    render: function () {
        let {className, method, layerWidth, layerHeight, scaleX, scaleY} = this.props;

        let props = helpers.transform(this.props, method);

        let children = helpers.proxyChildren(
            this.props.children,
            props,
            {
                layerWidth: _.isUndefined(props.layerWidth) ? layerWidth : props.layerWidth,
                layerHeight: _.isUndefined(props.layerHeight) ? layerHeight : props.layerHeight,
                scaleX: _.isUndefined(props.scaleX) ? scaleX : props.scaleX,
                scaleY: _.isUndefined(props.scaleY) ? scaleY : props.scaleY
            }
        );


        return <g className={className}>
            {children}
        </g>;

    }

});

module.exports = Transform;
