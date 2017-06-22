import PropTypes from 'prop-types';

export const series = PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    color: PropTypes.string,
    opacity: PropTypes.number,
    style: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
            color: PropTypes.string,
            opacity: PropTypes.number,
            style: PropTypes.object
        })
    ]))
}));

export default {
    series
};
