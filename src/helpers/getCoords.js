import {
    isArray,
    isString,
    isUndefined,
    map,
} from 'lodash';

import normalizeNumber from './normalizeNumber';

export default function getCoords(position, layerWidth, layerHeight, width = 0, height = 0) {

    if (isString(position)) {
        position = map(position.trim().split(' '), value => value.trim());
    }
    if (isArray(position)) {
        position = map(position, pos => isString(pos) ? pos.trim().toLowerCase() : pos);
        let [x, y] = position;
        if (['top', 'bottom', 'middle'].indexOf(position[0]) !== -1) {
            y = position[0];
        }
        if (['left', 'right', 'center'].indexOf(position[1]) !== -1) {
            x = position[1];
        }
        if (isString(x)) {
            if (x === 'left') {
                x = 0;
            } else if (x === 'right') {
                x = layerWidth - width;
            } else if (x === 'center') {
                x = (layerWidth - width) / 2;
            } else {
                x = normalizeNumber(x, layerWidth);
            }
        } else if (isUndefined(x)) {
            x = 0;
        }
        if (isString(y)) {
            if (y === 'top') {
                y = 0;
            } else if (y === 'bottom') {
                y = layerHeight - height;
            } else if (y === 'middle') {
                y = (layerHeight - height) / 2;
            } else {
                y = normalizeNumber(y, layerHeight);
            }
        } else if (isUndefined(y)) {
            y = 0;
        }
        return {x, y};
    } else {
        return {x: 0, y: 0};
    }

}
