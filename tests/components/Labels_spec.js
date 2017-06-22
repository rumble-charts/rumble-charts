import graphicsComponent from '../helpers/graphicsComponent';

import Labels from '../../src/Labels';

describe('Labels', () => {

    // TODO:
    // tests for:
    // - label, labelFormat

    graphicsComponent(Labels, {
        deepestTag: 'text',
        pointGroupClassName: 'dot',
        defaultProps: {
            colors: 'category20',
            circleRadius: 4,
            ellipseRadiusX: 6,
            ellipseRadiusY: 4,
            seriesVisible: true,
            dotVisible: true
        },
        visibleProperties: {
            seriesVisible: ['g', 'series'],
            dotVisible: ['text']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            dotAttributes: ['text'],
            labelAttributes: ['text']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            groupStyle: ['g', 'dot'],
            dotStyle: ['text']
        }

    });

});
