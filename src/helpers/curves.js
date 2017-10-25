import {
    curveLinear, curveLinearClosed, curveStep, curveStepBefore, curveStepAfter,
    curveBasis, curveBasisOpen, curveBasisClosed, curveBundle,
    curveCardinal, curveCardinalOpen, curveCardinalClosed, curveMonotoneX
} from 'd3-shape';

export default {
    'linear': curveLinear,
    'linear-closed': curveLinearClosed,
    'step': curveStep,
    'step-before': curveStepBefore,
    'step-after': curveStepAfter,
    'basis': curveBasis,
    'basis-open': curveBasisOpen,
    'basis-closed': curveBasisClosed,
    'bundle': curveBundle,
    'cardinal': curveCardinal,
    'cardinal-open': curveCardinalOpen,
    'cardinal-closed': curveCardinalClosed,
    'monotone': curveMonotoneX
};
