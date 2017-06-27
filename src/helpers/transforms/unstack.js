import { defaults, map, omit } from 'lodash';

export default function unstack(props) {

    const {series, seriesNormalized, maxX, maxY, minX, minY} = props;

    const newSeries = map(series, series => {
        const newSeries = {
            data: map(series.data, point => {
                const newPoint = omit(point, ['y0', 'y']);
                newPoint.y = point.y - point.y0;
                return newPoint;
            })
        };
        return defaults(newSeries, series);
    }, []);

    return {
        series: newSeries,
        seriesNormalized,
        maxX,
        maxY,
        minX,
        minY
    };
}
