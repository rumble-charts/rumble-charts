import type {Size} from '../types';

import {isString} from './isString';

let showedDeprecationWarning = false;

export function normalizeNumber(number: Size = 0, absolute = 0): number {
    if (isString(number)) {
        if (number.substr(-1, 1) === '%') {
            number = ((parseFloat(number) || 0) / 100) * absolute;
        } else if (number === 'left' || number === 'top') {
            number = 0;
        } else if (number === 'right' || number === 'bottom') {
            number = absolute;
        } else if (number === 'middle' || number === 'center') {
            number = absolute / 2;
        } else {
            number = parseFloat(number) || 0;
        }
    }
    if (number > 0 && number <= 1) {
        if (number > 0 && !showedDeprecationWarning) {
            showedDeprecationWarning = true;
            console.warn(`DEPRECATION WARNING. Please write "${Math.round(number * 100)}%" instead of ${number}. In the future versions of 'rumble-charts', the latter notation will be removed.`);
        }
        number = number * absolute;
    }
    return number;
}
