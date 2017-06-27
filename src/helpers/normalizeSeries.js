import {
    defaults,
    isArray,
    isEmpty,
    isNumber,
    isUndefined,
    map,
    omitBy,
} from 'lodash';

const isInvalidLimit = value => {
    return isUndefined(value) || value === Infinity || value === -Infinity;
};

export default function normalizeSeries(props) {
    let maxX = -Infinity,
        maxY = -Infinity,
        minX = Infinity,
        minY = Infinity;

    let series = map(props.series, series => {

        let data = map(series.data, (item, index) => {

            let d;
            if (!props.seriesNormalized) {
                d = {};
                if (isNumber(item)) {
                    d.x = index;
                    d.y = item;
                } else if (isArray(item)) {
                    d.x = item[0];
                    d.y = item[1];
                } else {
                    d = item || {};
                    if (isUndefined(d.x)) {
                        d.x = index;
                    }
                }
            } else {
                d = item;
            }
            if (isUndefined(props.maxX)) {
                maxX = Math.max(maxX, d.x || 0);
            }
            if (isUndefined(props.maxY)) {
                maxY = Math.max(maxY, d.y || 0);
            }
            if (isUndefined(props.minX)) {
                minX = Math.min(minX, d.x || 0);
            }
            if (isUndefined(props.minY)) {
                minY = Math.min(minY, d.y || 0);
            }

            return d;
        });

        return defaults({data}, series);
    });
    if (isEmpty(series)) {
        series = undefined;
    }
    if (!isUndefined(props.maxX)) {
        maxX = props.maxX;
    }
    if (!isUndefined(props.maxY)) {
        maxY = props.maxY;
    }
    if (!isUndefined(props.minX)) {
        minX = props.minX;
    }
    if (!isUndefined(props.minY)) {
        minY = props.minY;
    }

    return omitBy({
        seriesNormalized: true,
        series,
        maxX,
        maxY,
        minX,
        minY
    }, isInvalidLimit);
}
