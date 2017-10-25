import _ from 'lodash';
import {schemeCategory10, schemeCategory20, schemeCategory20b, schemeCategory20c, scaleOrdinal} from 'd3-scale';

const schemeMap = {
    'category10': schemeCategory10,
    'category20': schemeCategory20,
    'category20b': schemeCategory20b,
    'category20c': schemeCategory20c,
};

export default function colorFunc(colors) {
    if (_.isFunction(colors)) {
        return colors;
    } else if (_.isEmpty(colors)) {
        return scaleOrdinal(schemeCategory20);
    } else if (_.isString(colors)) {
        return scaleOrdinal(schemeMap[colors]);
    } else {
        return scaleOrdinal(colors);
    }
}
