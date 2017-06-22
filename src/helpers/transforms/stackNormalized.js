import stack from './stack';

export default function stackNormalized(props) {
    return stack(props, {
        normalize: true
    });
}
