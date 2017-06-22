import _ from 'lodash';

export default function normalizeNumber(number, absolute = null) {
    if (_.isString(number)) {
        if (number.substr(-1, 1) === '%') {
            number = ((parseFloat(number) || 0) / 100) * absolute;
        } else if (number === 'left' || number === 'top') {
            number = 0;
        } else if (number === 'right' || number === 'bottom') {
            number = 1;
        } else if (number === 'middle' || number === 'center') {
            number = 0.5;
        } else {
            number = parseFloat(number) || 0;
        }
    }
    let absNumber = Math.abs(number);
    if (absNumber > 0 && absNumber <= 1) {
        number = number * absolute;
    }
    return number;
}
