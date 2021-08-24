import type {NormalizedSeriesProps} from '../../types';

export function rotate(props: NormalizedSeriesProps): NormalizedSeriesProps {
    const {series, seriesNormalized, minX, maxX, maxY, minY} = props;
    let {scaleX, scaleY} = props;

    const {paddingLeft, paddingRight} = scaleX;
    const {paddingTop, paddingBottom} = scaleY;
    scaleX = {...scaleX};
    scaleY = {...scaleY};
    scaleX.paddingLeft = paddingTop;
    scaleX.paddingRight = paddingBottom;
    scaleX.swap = !scaleX.swap;
    scaleY.paddingTop = paddingLeft;
    scaleY.paddingBottom = paddingRight;
    scaleY.swap = !scaleY.swap;
    scaleY.direction = -1;

    return {
        series,
        seriesNormalized,
        maxX,
        maxY,
        minX,
        minY,
        scaleX,
        scaleY
    };

}
