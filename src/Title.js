'use strict';

const React = require('react'),
    PropTypes = require('prop-types'),
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
        className: PropTypes.string,
        style: PropTypes.object,

        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        position: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),

        children: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.string,
            PropTypes.node
        ]).isRequired,
        layerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        layerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        series: PropTypes.array
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
