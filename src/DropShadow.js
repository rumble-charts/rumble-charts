import React from 'react';
import PropTypes from 'prop-types';

export default function DropShadow(props) {
    return <filter id={props.id}>
        <feGaussianBlur in={props.blurIn} stdDeviation={props.blurDeviation}/>
        <feOffset dx={props.dx} dy={props.dy}/>
        <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic'/>
        </feMerge>
    </filter>;
}

DropShadow.displayName = 'DropShadow';

DropShadow.propTypes = {
    id: PropTypes.string.isRequired,
    dx: PropTypes.number,
    dy: PropTypes.number,
    blurDeviation: PropTypes.number,
    blurIn: PropTypes.oneOf([
        'SourceAlpha', 'SourceGraphic', 'BackgroundImage', 'BackgroundAlpha', 'FillPaint', 'StrokePaint'
    ])
};

DropShadow.defaultProps = {
    dx: 1,
    dy: 1,
    blurDeviation: 4,
    blurIn: 'SourceAlpha'
};
