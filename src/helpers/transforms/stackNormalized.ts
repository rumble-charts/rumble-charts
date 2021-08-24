import type {NormalizedSeriesProps} from '../../types';

import {stack} from './stack';

export function stackNormalized(props: NormalizedSeriesProps): NormalizedSeriesProps {
    return stack(props, {
        normalize: true
    });
}
