import type {ReactElement} from 'react';
import type {DotsProps} from './Dots';

import React from 'react';
import {Dots} from './Dots';

export type LabelsProps = Omit<DotsProps, 'dotType'>;

/**
 * Renders labels for dots. Internally it's just a wrapper for [`<Dots>`](#dots) component
 * with `dotType="circle"`.
 *
 * @example ../docs/examples/Labels.md
 */
export function Labels(props: LabelsProps): ReactElement {
    return (
        <Dots {...props} dotType='labels' />
    );
}
