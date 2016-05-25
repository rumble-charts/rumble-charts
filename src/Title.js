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
        const {style, className, children} = props;

        const {x, y} = helpers.getCoords(
            props.position,
            props.layerWidth, props.layerHeight,
            props.width, props.height
        ) || {};

        return <g
            className={className}
            transform={'translate(' + x + ' ' + y + ')'}
            style={style}>
            {_.isString(children) ?
                <text>{children}</text> :
                (_.isFunction(children) ? children(props) : children)}
        </g>;
    }

});

module.exports = Title;
