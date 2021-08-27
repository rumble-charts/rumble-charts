import React from 'react';
import {create, act} from 'react-test-renderer';

jest.mock('d3-cloud', () => {
    return function() {
        const state: Record<string, any> = {};

        function convert() {
            state.result = state.words
                .map((word, i) => ({
                    rotate: 0,
                    x: 0,
                    y: 0,
                    ...word,
                    size: (typeof state.fontSize === 'function'
                        ? state.fontSize(word, i)
                        : state.fontSize) || state.size,
                    font: state.font || 'serif',
                }))
                .filter(word => word.size < state.width && word.size < state.height);
            return state.result;
        }

        const instance = {
            size: ([width, height]) => {
                state.width = width;
                state.height = height;
                return instance;
            },
            words: (words) => {
                state.words = words;
                return instance;
            },
            font: (font) => {
                state.font = font;
                return instance;
            },
            fontStyle: () => instance,
            fontWeight: () => instance,
            spiral: () => instance,
            padding: () => instance,
            timeInterval: () => instance,
            fontSize: (fontSize) => {
                state.fontSize = fontSize;
                return instance;
            },
            rotate: () => instance,
            random: () => instance,
            canvas: () => instance,
            start: () => {
                convert();
                return instance;
            },
            on: (name, callback) => {
                callback(state.result || convert());
            }
        };
        return instance;
    };
});

import {Cloud} from './Cloud';
import {Chart} from './Chart';

import {generateRandomSeries} from './helpers';
import {graphicsComponent} from './specs';

describe('Cloud', () => {

    const WIDTH = 1000;
    const HEIGHT = 1000;

    const series1 = generateRandomSeries(3, 5, {
        min: 20,
        max: 100,
        type: 'object',
        point: ({seriesIndex, pointIndex, value}) => ({label: `${seriesIndex}-${pointIndex}`, y: value / 10})
    });
    const series2 = generateRandomSeries(3, 5, {
        min: 20,
        max: 100,
        type: 'object',
        point: ({seriesIndex, pointIndex, value}) => ({label: `${seriesIndex}-${pointIndex}`, y: value / 10})
    });
    const series3 = [{
        data: [
            {x: 0, y: 45, label: '45'}, {x: 1, y: 50, label: '50'},
            {x: 2, y: 55, label: '55'}, {x: 3, y: 2, label: ''}
        ]
    }];

    const TestCloud = props => <Cloud {...props} rotate={0} random={() => 0.2} canvas='mock' />;

    graphicsComponent(TestCloud, {
        deepestTag: 'text',
        pointGroupClassName: 'label',
        visibleProperties: {
            seriesVisible: ['g', 'series'],
            labelVisible: ['text']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            labelAttributes: ['text']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            labelStyle: ['text']
        },
        seriesObjects3x5: series1,
        chartWidth: WIDTH,
        chartHeight: HEIGHT
    });

    it('should update the chart', () => {
        const renderer = create(<Chart width={1000} height={1000} series={series1}>
            <TestCloud />
        </Chart>);

        expect(renderer.root.findByType(TestCloud).props.series).toEqual(series1);

        act(() => {
            jest.advanceTimersByTime(100);
        });

        renderer.update(<Chart width={1000} height={1000} series={series2}>
            <Cloud />
        </Chart>);

        expect(renderer.root.findByType(Cloud).props.series).toEqual(series2);
    });

    it('should skip empty labels', () => {
        const width = 100;
        const height = 100;
        const renderer = create(<Chart width={width} height={height} series={series3}>
            <Cloud minFontSize={200} maxFontSize={450} />
        </Chart>);

        expect(renderer.root.findAllByType('text').length).toBeLessThanOrEqual(2);
    });

});
