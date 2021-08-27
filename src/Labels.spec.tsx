import {graphicsComponent} from './specs';

import {Labels} from './Labels';

describe('Labels', () => {

    // TODO:
    // tests for:
    // - label, labelFormat

    graphicsComponent(Labels, {
        deepestTag: 'text',
        pointGroupClassName: 'dot',
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
