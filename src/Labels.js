'use strict';

const React = require('react'),
    Dots = require('./Dots'),
    helpers = require('./helpers');

/**
 * Renders labels for dots. Internally it's just a wrapper for [<Dots />](#Dots) component
 * with `dotType="circle"`.
 *
 * @example ../docs/examples/Labels.md
 */
const Labels = React.createClass({

    displayName: 'Labels',

    propTypes: {
        className: React.PropTypes.string,
        colors: React.PropTypes.oneOfType([
            React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            React.PropTypes.arrayOf(React.PropTypes.string),
            React.PropTypes.func
        ]),
        opacity: React.PropTypes.number,
        style: React.PropTypes.object,

        label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        labelFormat: React.PropTypes.func,
        labelAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        groupStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        dotVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        dotAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        dotStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        seriesIndex: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.array,
            React.PropTypes.func
        ]),
        series: helpers.propTypes.series
    },

    getDefaultProps() {
        return {
            colors: 'category20',
            circleRadius: 4,
            ellipseRadiusX: 6,
            ellipseRadiusY: 4,
            seriesVisible: true,
            dotVisible: true
        };
    },

    render() {
        return <Dots {...this.props} dotType='labels'/>;
    }

});

module.exports = Labels;
