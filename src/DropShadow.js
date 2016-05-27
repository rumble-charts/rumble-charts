'use strict';

const React = require('react');

const DropShadow = React.createClass({

    displayName: 'DropShadow',

    propTypes: {
        id: React.PropTypes.string.isRequired,
        dx: React.PropTypes.number,
        dy: React.PropTypes.number,
        blurDeviation: React.PropTypes.number,
        blurIn: React.PropTypes.oneOf([
            'SourceAlpha', 'SourceGraphic', 'BackgroundImage', 'BackgroundAlpha', 'FillPaint', 'StrokePaint'
        ])
    },

    // init

    getDefaultProps() {
        return {
            dx: 1,
            dy: 1,
            blurDeviation: 4,
            blurIn: 'SourceAlpha'
        };
    },

    // render

    render() {
        const {props} = this;
        return <filter id={props.id}>
            <feGaussianBlur in={props.blurIn} stdDeviation={props.blurDeviation}/>
            <feOffset dx={props.dx} dy={props.dy}/>
            <feMerge>
                <feMergeNode />
                <feMergeNode in='SourceGraphic'/>
            </feMerge>
        </filter>;
    }

});

module.exports = DropShadow;
