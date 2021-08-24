import type {Colors, ColorScale} from '../types';

import {scaleOrdinal} from 'd3-scale';
import {
    schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemePastel1, schemePastel2,
    schemeSet1, schemeSet2, schemeSet3, schemeTableau10,
} from 'd3-scale-chromatic';

import {isFunction} from './isFunction';
import {isString} from './isString';

export const schemeMap: Record<string, readonly string[]> = {
    category10: schemeCategory10,
    category20: [
        '#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c',
        '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5',
        '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f',
        '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
    ],
    category20b: [
        '#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939',
        '#8ca252', '#b5cf6b', '#cedb9c', '#8c6d31', '#bd9e39',
        '#e7ba52', '#e7cb94', '#843c39', '#ad494a', '#d6616b',
        '#e7969c', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6'
    ],
    category20c: [
        '#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d',
        '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476',
        '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc',
        '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9'
    ],
    accent: schemeAccent,
    dark2: schemeDark2,
    paired: schemePaired,
    pastel1: schemePastel1,
    pastel2: schemePastel2,
    set1: schemeSet1,
    set2: schemeSet2,
    set3: schemeSet3,
    tableau10: schemeTableau10,
};

export const defaultScheme = schemeMap.category20;
export const defaultSchemeName: keyof typeof schemeMap = 'category20';

export function colorFunc(colors?: Colors): ColorScale {
    if (isFunction(colors)) {
        return colors;
    } else if (!colors) {
        return scaleOrdinal(defaultScheme);
    } else if (isString(colors)) {
        return scaleOrdinal(schemeMap[colors]);
    } else {
        return scaleOrdinal(colors as string[]);
    }
}
