import { isEmpty, isFunction, isString } from 'lodash';
import d3 from 'd3';

export default function colorFunc(colors) {
    if (isFunction(colors)) {
        return colors;
    } else if (isEmpty(colors)) {
        return d3.scale.category20();
    } else if (isString(colors)) {
        return d3.scale[colors]();
    } else {
        return d3.scale.ordinal().range(colors);
    }
}
