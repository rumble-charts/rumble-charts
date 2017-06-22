'use strict';

const React = require('react'),
    PropTypes = require('prop-types'),
    d3 = require('d3'),
    cloud = require('d3-cloud'),
    helpers = require('./helpers'),
    _reduce = require('lodash/reduce'),
    _forEach = require('lodash/forEach'),
    _defaults = require('lodash/defaults'),
    _map = require('lodash/map'),
    _groupBy = require('lodash/groupBy'),
    _sortBy = require('lodash/sortBy');

/**
 * Renders cloud of tags/keywords. Uses [d3-cloud](https://www.npmjs.com/package/d3-cloud) for calculations.
 * Please notice, `series` data points should have `label` attribute. See example below.
 *
 * @example ../docs/examples/Cloud.md
 */
class Cloud extends React.Component {

    constructor(props) {
        super(props);

        this.buildCloud = this.buildCloud.bind(this);

        this.state = {
            labels: [],
            series: []
        };
    }

    // helpers

    buildCloud(props) {
        const {layerWidth, layerHeight, series} = props;
        const {font, fontStyle, fontWeight, rotate, spiral, padding, random} = props;

        const scale = d3.scale.linear()
            .range([props.minFontSize, props.maxFontSize])
            .domain([props.minY, props.maxY]);

        const words = _reduce(series, (words, {data}, seriesIndex) => {
            _forEach(data, (point, pointIndex) => {
                words.push(_defaults({
                    text: point.label,
                    size: point.y,
                    seriesIndex,
                    pointIndex
                }, point));
            });
            return words;
        }, []);

        cloud()
            .size([layerWidth, layerHeight])
            .words(words)
            .font(font)
            .fontStyle(fontStyle)
            .fontWeight(fontWeight)
            .rotate(rotate)
            .spiral(spiral)
            .padding(padding)
            .random(random)
            .timeInterval(15)
            .fontSize(d => scale(d.size))
            .on('end', function(series, labels) {
                labels = _map(
                    _groupBy(labels, 'seriesIndex'),
                    labels => _sortBy(labels, 'pointIndex')
                );
                this.setState({series, labels});
            }.bind(this, series))
            .start();
    }

    // lifecycle

    componentWillMount() {
        try {
            this.buildCloud(this.props);
        } catch (e) {
            console.warn(e);
        }
    }

    componentWillReceiveProps(nextProps) {
        try {
            this.buildCloud(nextProps);
        } catch (e) {
            console.warn(e);
        }
    }

    // render

    render() {
        const {props, state} = this;
        const {className, style, layerWidth, layerHeight, opacity} = props;
        const {labels} = state;

        const color = helpers.colorFunc(props.colors);

        return <g
            className={className} style={style} opacity={opacity}
            transform={'translate(' + (layerWidth / 2) + ',' + (layerHeight / 2) + ')'}>
            {_map(state.series, (series, seriesIndex) => {

                let {seriesVisible, seriesStyle, seriesAttributes} = props;

                seriesVisible = helpers.value(seriesVisible, {seriesIndex, series, props});
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, {seriesIndex, series, props});
                seriesStyle = helpers.value(seriesStyle, {seriesIndex, series, props});

                return <g
                    key={seriesIndex}
                    className={className && (className + '-series ' + className + '-series-' + seriesIndex)}
                    style={seriesStyle}
                    opacity={series.opacity}
                    {...seriesAttributes}>
                    {_map(series.data, (point, pointIndex) => {

                        let {labelVisible, labelAttributes, labelStyle} = props;
                        let label = labels[seriesIndex] && labels[seriesIndex][pointIndex];
                        if (!label) {
                            return;
                        }

                        labelVisible = helpers.value(labelVisible, {
                            seriesIndex, pointIndex, point, label, series, props
                        });

                        if (!labelVisible) {
                            return;
                        }

                        labelAttributes = helpers.value(labelAttributes, {
                            seriesIndex, pointIndex, point, label, series, props
                        });
                        labelStyle = helpers.value([point.style, series.style, labelStyle],
                            {seriesIndex, pointIndex, point, label, series, props}
                        );

                        return <g
                            key={pointIndex}
                            className={className && (className + '-label ' + className + '-label-' + +pointIndex)}
                            style={{
                                fontSize: label.size + 'px',
                                fontFamily: label.font
                            }}>
                            <text
                                transform={'translate(' + label.x + ',' + label.y + '),rotate(' + label.rotate + ')'}
                                fill={point.color || series.color || color(seriesIndex)}
                                fillOpacity={point.opacity}
                                textAnchor='middle'
                                style={labelStyle}
                                {...labelAttributes}>
                                {label.text}
                            </text>
                        </g>;
                    })}

                </g>;
            })}
        </g>;
    }

}

Cloud.displayName = 'Cloud';

Cloud.propTypes = {
    className: PropTypes.string,
    colors: PropTypes.oneOfType([
        PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.func
    ]),
    opacity: PropTypes.number,
    style: PropTypes.object,

    font: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    minFontSize: PropTypes.number,
    maxFontSize: PropTypes.number,
    fontStyle: PropTypes.oneOfType([PropTypes.oneOf([
        'normal', 'italic', 'oblique', 'inherit'
    ]), PropTypes.func]),
    fontWeight: PropTypes.oneOfType([PropTypes.oneOf([
        'normal', 'bold', 'bolder', 'lighter', 'normal',
        '100', '200', '300', '400', '500', '600', '700', '800', '900'
    ]), PropTypes.func]),
    /**
     * Angle in degrees
     */
    rotate: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    /**
     * Type of spiral used for positioning words. This can either be one of the two
     * built-in spirals, "archimedean" and "rectangular", or an arbitrary spiral
     * generator can be used, of the following form
     */
    spiral: PropTypes.oneOfType([PropTypes.oneOf([
        'archimedean', 'rectangular'
    ]), PropTypes.func]),
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    random: PropTypes.func,

    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    labelFormat: PropTypes.func,

    labelVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    labelAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    seriesVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    seriesAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    seriesStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    layerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    layerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    seriesIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array,
        PropTypes.func
    ]),
    series: helpers.propTypes.series,
    minX: PropTypes.number,
    maxX: PropTypes.number,
    minY: PropTypes.number,
    maxY: PropTypes.number
};

Cloud.defaultProps = {
    colors: 'category20',
    seriesVisible: true,
    labelVisible: true,

    font: 'serif',
    minFontSize: 10,
    maxFontSize: 100,
    fontStyle: 'normal',
    fontWeight: 'normal',
    rotate: 0,
    spiral: 'archimedean',
    padding: 1,
    random: Math.random
};

module.exports = Cloud;
