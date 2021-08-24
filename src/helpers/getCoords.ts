import type {Coords, Position} from '../types';

import {isString} from './isString';
import {isUndefined} from './isUndefined';
import {normalizeNumber} from './normalizeNumber';
import {isNumber} from './isNumber';

const TOP = 'top';
const BOTTOM = 'bottom';
const MIDDLE = 'middle';
const LEFT = 'left';
const RIGHT = 'right';
const CENTER = 'center';

const HORIZONTAL = [TOP, BOTTOM, MIDDLE];
const VERTICAL = [LEFT, RIGHT, CENTER];

export function getCoords(position: Position, layerWidth = 0, layerHeight = 0, width = 0, height = 0): Coords {

    if (isString(position)) {
        position = position.trim().split(' ').map(value => value.trim()) as Position;
    }

    if (Array.isArray(position)) {
        const cleanPosition = position.map(pos => isString(pos) ? pos.trim().toLowerCase() : pos);
        let [_x, _y] = cleanPosition;
        if (isString(cleanPosition[0]) && HORIZONTAL.indexOf(cleanPosition[0]) !== -1) {
            _y = cleanPosition[0];
        }
        if (isString(cleanPosition[1]) && VERTICAL.indexOf(cleanPosition[1]) !== -1) {
            _x = cleanPosition[1];
        }

        const result: Coords = {
            x: 0,
            y: 0
        };

        if (isString(_x)) {
            if (_x === LEFT) {
                result.x = 0;
            } else if (_x === RIGHT) {
                result.x = layerWidth - width;
            } else if (_x === CENTER) {
                result.x = (layerWidth - width) / 2;
            } else {
                result.x = normalizeNumber(_x, layerWidth);
            }
        } else if (isNumber(_x)) {
            result.x = _x;
        } else if (isUndefined(_x)) {
            result.x = 0;
        }
        if (isString(_y)) {
            if (_y === TOP) {
                result.y = 0;
            } else if (_y === BOTTOM) {
                result.y = layerHeight - height;
            } else if (_y === MIDDLE) {
                result.y = (layerHeight - height) / 2;
            } else {
                result.y = normalizeNumber(_y, layerHeight);
            }
        } else if (isNumber(_y)) {
            result.y = _y;
        } else if (isUndefined(_y)) {
            result.y = 0;
        }
        return result;

    } else {
        return {x: 0, y: 0};
    }
}
