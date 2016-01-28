'use strict';

var React = require('react'),
    _ = require('lodash'),
    helpers = require('./helpers');

var Layer = React.createClass({

    displayName: 'Layer',

    propTypes: {
        className: React.PropTypes.string,
        width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
        series: React.PropTypes.array
    },

    // init

    getDefaultProps() {
        return {
            width: '100%',
            height: '100%',
            position: 'middle center'
        };
    },

    // helpers

    getWidth() {
        var { width, layerWidth } = this.props;
        return helpers.normalizeNumber(width, layerWidth);
    },

    getHeight() {
        var { height, layerHeight } = this.props;
        return helpers.normalizeNumber(height, layerHeight);
    },

    getCoords() {
        var { position, layerWidth, layerHeight } = this.props;
        return helpers.getCoords(position, layerWidth, layerHeight, this.getWidth(), this.getHeight());
    },

    // render

    render: function () {
        let { className, scaleX, scaleY, style } = this.props;

        let layerWidth = this.getWidth();
        let layerHeight = this.getHeight();

        let {x, y} = this.getCoords();
        let transform = [];
        transform.push('translate3d(' + x + 'px,' + y + 'px' + ',0px)');
        transform = transform.join(' ') +
            (style && style.transform ? (' ' + style.transform) : '');

        let transformOrigin = '' + layerWidth / 2 + 'px ' + layerHeight / 2 + 'px';

        let layerStyle = _.assign({
            transform,
            WebkitTransform: transform,
            MozTransform: transform,
            transformOrigin,
            WebkitTransformOrigin: transformOrigin,
            MozTransformOrigin: transformOrigin
        }, style);

        let children = helpers.proxyChildren(
            this.props.children,
            this.props,
            {
                layerWidth,
                layerHeight,
                scaleX,
                scaleY
            }
        );

        /* jshint ignore:start */
        return <g className={className} style={layerStyle}>
            {children}
        </g>;
        /* jshint ignore:end */
    }

});

module.exports = Layer;
