'use strict';

const React = require('react'),
    _ = require('./_'),
    helpers = require('./helpers');

/**
 * Transforms `series` data according chosen `method`.
 *
 * As a wrapper it takes `series` obtained from its parent and gives it to its children.
 *
 * @example ../docs/examples/Transform.md
 */
const Transform = function (props) {
    const {className, layerWidth, layerHeight, scaleX, scaleY} = props;

    const newProps = helpers.transform(props, props.method);

    const children = helpers.proxyChildren(
        props.children,
        newProps,
        {
            layerWidth: _.isUndefined(newProps.layerWidth) ? layerWidth : newProps.layerWidth,
            layerHeight: _.isUndefined(newProps.layerHeight) ? layerHeight : newProps.layerHeight,
            scaleX: _.isUndefined(newProps.scaleX) ? scaleX : newProps.scaleX,
            scaleY: _.isUndefined(newProps.scaleY) ? scaleY : newProps.scaleY
        }
    );

    return <g className={className}>
        {children}
    </g>;
};

Transform.displayName = 'Transform';

Transform.propTypes = {
    className: React.PropTypes.string,
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
    ]),
    scaleX: React.PropTypes.object,
    scaleY: React.PropTypes.object,
    layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    children: React.PropTypes.node
};

module.exports = Transform;
