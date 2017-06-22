import _ from 'lodash';

const isInvalidLimit = value => {
    return _.isUndefined(value) || value === Infinity || value === -Infinity;
};

export default function normalizeSeries(props) {
    let maxX = -Infinity,
        maxY = -Infinity,
        minX = Infinity,
        minY = Infinity;

    let series = _.map(props.series, series => {

        let data = _.map(series.data, (item, index) => {

            let d;
            if (!props.seriesNormalized) {
                d = {};
                if (_.isNumber(item)) {
                    d.x = index;
                    d.y = item;
                } else if (_.isArray(item)) {
                    d.x = item[0];
                    d.y = item[1];
                } else {
                    d = item || {};
                    if (_.isUndefined(d.x)) {
                        d.x = index;
                    }
                }
            } else {
                d = item;
            }
            if (_.isUndefined(props.maxX)) {
                maxX = Math.max(maxX, d.x || 0);
            }
            if (_.isUndefined(props.maxY)) {
                maxY = Math.max(maxY, d.y || 0);
            }
            if (_.isUndefined(props.minX)) {
                minX = Math.min(minX, d.x || 0);
            }
            if (_.isUndefined(props.minY)) {
                minY = Math.min(minY, d.y || 0);
            }

            return d;
        });

        return _.defaults({data}, series);
    });
    if (_.isEmpty(series)) {
        series = undefined;
    }
    if (!_.isUndefined(props.maxX)) {
        maxX = props.maxX;
    }
    if (!_.isUndefined(props.maxY)) {
        maxY = props.maxY;
    }
    if (!_.isUndefined(props.minX)) {
        minX = props.minX;
    }
    if (!_.isUndefined(props.minY)) {
        minY = props.minY;
    }

    return _.omitBy({
        seriesNormalized: true,
        series,
        maxX,
        maxY,
        minX,
        minY
    }, isInvalidLimit);
}
