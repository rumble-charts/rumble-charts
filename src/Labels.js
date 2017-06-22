import React from 'react';
import PropTypes from 'prop-types';

import propTypes from './helpers/propTypes';

import Dots from './Dots';

/**
 * Renders labels for dots. Internally it's just a wrapper for [`<Dots>`](#dots) component
 * with `dotType="circle"`.
 *
 * @example ../docs/examples/Labels.md
 */
export default function Labels(props) {
    return <Dots {...props} dotType='labels'/>;
}

Labels.displayName = 'Labels';

Labels.propTypes = {
    className: PropTypes.string,
    colors: PropTypes.oneOfType([
        PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.func
    ]),
    opacity: PropTypes.number,
    style: PropTypes.object,

    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    labelFormat: PropTypes.func,
    labelAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    seriesVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    seriesAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    seriesStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    groupStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    dotVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    dotAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    dotStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    seriesIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array,
        PropTypes.func
    ]),
    series: propTypes.series
};

Labels.defaultProps = {
    colors: 'category20',
    circleRadius: 4,
    ellipseRadiusX: 6,
    ellipseRadiusY: 4,
    seriesVisible: true,
    dotVisible: true
};
