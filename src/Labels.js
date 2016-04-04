'use strict';

var React = require('react'),
    Dots = require('./Dots');

var Labels = React.createClass({

    displayName: 'Labels',

    propTypes: {
        seriesIndex: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.array,
            React.PropTypes.func
        ]),
        series: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            color: React.PropTypes.string,
            opacity: React.PropTypes.number,
            style: React.PropTypes.object,
            data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
                React.PropTypes.number,
                React.PropTypes.arrayOf(React.PropTypes.number),
                React.PropTypes.shape({
                    x: React.PropTypes.number,
                    y: React.PropTypes.number,
                    color: React.PropTypes.string,
                    opacity: React.PropTypes.number,
                    style: React.PropTypes.object
                })
            ]))
        })),
        colors: React.PropTypes.oneOfType([
            React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            React.PropTypes.arrayOf(React.PropTypes.string),
            React.PropTypes.func
        ]),
        style: React.PropTypes.object,
        className: React.PropTypes.string,

        label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        labelFormat: React.PropTypes.func,
        labelAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        groupStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        dotVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        dotAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        dotStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func])
    },

    render() {

        return <Dots {...this.props} dotType='labels'/>;

    }

});

module.exports = Labels;
