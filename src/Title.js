'use strict';

const React = require('react'),
    _ = require('./_'),
    helpers = require('./helpers');

/**
 * Renders title (text or everything else) at specified `position`.
 *
 * @example ../docs/examples/Title.md
 */
const Title = React.createClass({

    displayName: 'Title',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,

        width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),

        children: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.string,
            React.PropTypes.node
        ]).isRequired,
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        series: React.PropTypes.array
    },

    // init

    getDefaultProps() {
        return {
            position: 'top center'
        };
    },

    // render

    render() {
        const {props} = this;
        const {className, position, layerWidth, layerHeight, width, height, children} = props;
        const currentStyle = _.assign({}, props.style);

        const {x, y} = helpers.getCoords(position, layerWidth, layerHeight, width, height) || {};

        const transform = 'translate(' + x + ',' + y + ')';

        return <g className={className} style={currentStyle} transform={transform}>
            {_.isString(children) ?
                <text>{children}</text> :
                (_.isFunction(children) ? children(props) : children)}
        </g>;
    }

});

module.exports = Title;
