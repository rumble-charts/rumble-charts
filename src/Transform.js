'use strict';

var React = require('react'),
    _ = require('lodash'),
    helpers = require('./helpers');

var Transform = React.createClass({

    displayName: 'Transform',

    propTypes: {
        series: React.PropTypes.array,
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
