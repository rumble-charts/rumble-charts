'use strict';

var React = require('react');

var DropShadow = React.createClass({

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

    render: function () {
        let html = `
<filter id="${this.props.id}">
    <feGaussianBlur in="${this.props.blurIn}" stdDeviation="${this.props.blurDeviation}" />
    <feOffset dx="${this.props.dx}" dy="${this.props.dy}" />
    <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
    </feMerge>
</filter>
          `;

        return <g dangerouslySetInnerHTML={{__html: html}}>
        </g>;

    }

});

module.exports = DropShadow;
