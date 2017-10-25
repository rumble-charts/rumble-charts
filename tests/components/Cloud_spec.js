import {mount} from 'enzyme';

import Cloud from '../../src/Cloud';
import Chart from '../../src/Chart';

import graphicsComponent from '../helpers/graphicsComponent';
import generateRandomSeries from '../helpers/generateRandomSeries';
import spyOnWarnings from '../helpers/spyOnWarnings';
import later from '../helpers/later';

describe('Cloud', () => {

    const series1 = generateRandomSeries(3, 5, {
        min: 20,
        max: 100,
        type: 'object',
        point: ({seriesIndex, pointIndex}) => ({label: `${seriesIndex}-${pointIndex}`})
    });
    const series2 = generateRandomSeries(3, 5, {
        min: 20,
        max: 100,
        type: 'object',
        point: ({seriesIndex, pointIndex}) => ({label: `${seriesIndex}-${pointIndex}`})
    });
    const series3 = [{
        data: [{x: 0, y: 45, label: '45'}, {x: 1, y: 50, label: '50'}, {x: 2, y: 55, label: '55'}]
    }];

    graphicsComponent(Cloud, {
        deepestTag: 'text',
        pointGroupClassName: 'label',
        renderMethod: 'mount',
        delay: 100,
        defaultProps: {
            colors: 'category20',
            seriesVisible: true,
            labelVisible: true,
            font: 'serif',
            minFontSize: 10,
            maxFontSize: 100,
            fontStyle: 'normal',
            fontWeight: 'normal',
            rotate: 0,
            spiral: 'archimedean',
            padding: 1,
            random: Math.random
        },
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
        chartWidth: 1000,
        chartHeight: 1000
    });

    it('should update the chart', () => {
        const wrapper = mount(<Chart width={1000} height={1000} series={series1}>
            <Cloud />
        </Chart>);

        const cloud = wrapper.find(Cloud);
        expect(cloud.prop('series')).toEqual(series1);
        wrapper.render();
        return new Promise(resolve => {
            wrapper.setProps({series: series2}, () => {
                wrapper.render();
                const cloud = wrapper.find(Cloud);
                expect(cloud.prop('series')).toEqual(series2);
                resolve();
            });
        });
    });

    it('should show console.warn in case of error during the cloud building', () => {
        let wrapper;
        expect(spyOnWarnings(() => {
            wrapper = mount(<Chart width={1000} height={1000} series={series1}>
                <Cloud random={() => {
                    throw new Error('error');
                }} />
            </Chart>);
        })).toHaveBeenCalled();

        return later(() => {
            expect(spyOnWarnings(() => {
                wrapper.setProps({series: series2});
            })).toHaveBeenCalled();
        }, 200);

    });

    it('should skip empty labels', () => {
        const wrapper = mount(<Chart width={100} height={80} series={series3}>
            <Cloud minFontSize={44} maxFontSize={45} random={() => 0} />
        </Chart>);

        return later(() => {
            expect(wrapper.find('text').length).toBeLessThanOrEqual(2);
        }, 200);
    });

});
