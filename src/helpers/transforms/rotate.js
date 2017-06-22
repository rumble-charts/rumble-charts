import _ from 'lodash';

export default function rotate(props) {
    let {series, seriesNormalized, minX, maxX, maxY, minY, scaleX, scaleY} = props;

    let {paddingLeft, paddingRight} = scaleX;
    let {paddingTop, paddingBottom} = scaleY;
    scaleX = _.cloneDeep(scaleX);
    scaleY = _.cloneDeep(scaleY);
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
