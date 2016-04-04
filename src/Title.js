'use strict';

var React = require('react'),
    _ = require('lodash'),
    helpers = require('./helpers');

var Title = React.createClass({

    displayName: 'Title',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
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
        let {props} = this;
        let {className, position, layerWidth, layerHeight, width, height, children} = props;
        let currentStyle = _.assign({}, props.style);

        let {x, y} = helpers.getCoords(position, layerWidth, layerHeight, width, height) || {};

        currentStyle.transform = 'translate(' + x + 'px,' + y + 'px)';


        return <g className={className} style={currentStyle}>
            {_.isString(children) ?
                <text>{children}</text> :
                (_.isFunction(children) ? children(props) : children)}
        </g>;

    }

});

module.exports = Title;
