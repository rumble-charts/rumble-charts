'use strict';

const RadialLines = require('../../lib/RadialLines');
const graphicsComponent = require('../helpers/graphicsComponent');
const linesComponent = require('../helpers/linesComponent');

// TODO
// check next properties
// - asAreas
// - innerRadius
// - startAngle
// - endAngle

describe('RadialLines', () => {

    // RadialLines should be a graphics renderer component
    graphicsComponent(RadialLines, {
        colorProperty: 'stroke',
        defaultProps: {
            colors: 'category20',
            seriesVisible: true,
            lineVisible: true,
            lineWidth: 3,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            innerRadius: 0,
            position: 'center middle',
            interpolation: 'cardinal-closed'
        },
        visibleProperties: {
            seriesVisible: ['g', 'series'],
            lineVisible: ['path']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            lineAttributes: ['path']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            lineStyle: ['path']
        }
    });

    linesComponent(RadialLines, {
        lineWidth: true,
        lineInterpolations: [
            'linear', 'linear-closed', 'step', 'step-before', 'step-after',
            'basis', 'basis-open', 'basis-closed', 'bundle',
            'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone'
        ]
    });

});
