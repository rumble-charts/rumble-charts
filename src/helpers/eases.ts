import * as ease from 'd3-ease';

export const eases = {
    'linear': ease.easeLinear,
    'poly': ease.easePoly,
    'quad': ease.easeQuad,
    'cubic': ease.easeCubic,
    'sin': ease.easeSin,
    'exp': ease.easeExp,

    'circle': ease.easeCircle,
    'bounce': ease.easeBounce,
    'elastic': ease.easeElastic,
    'back': ease.easeBack,

    'linear-in': ease.easeLinear,
    'poly-in': ease.easePolyIn,
    'quad-in': ease.easeQuadIn,
    'cubic-in': ease.easeCubicIn,
    'sin-in': ease.easeSinIn,
    'exp-in': ease.easeExpIn,

    'circle-in': ease.easeCircleIn,
    'bounce-in': ease.easeBounceIn,
    'elastic-in': ease.easeElasticIn,
    'back-in': ease.easeBackIn,

    'linear-out': d3_ease_reverse(ease.easeLinear),
    'poly-out': ease.easePolyOut,
    'quad-out': ease.easeQuadOut,
    'cubic-out': ease.easeCubicOut,
    'sin-out': ease.easeSinOut,
    'exp-out': ease.easeExpOut,

    'circle-out': ease.easeCircleOut,
    'bounce-out': ease.easeBounceOut,
    'elastic-out': ease.easeElasticOut,
    'back-out': ease.easeBackOut,

    'linear-in-out': d3_ease_reflect(ease.easeLinear),
    'poly-in-out': ease.easePolyInOut,
    'quad-in-out': ease.easeQuadInOut,
    'cubic-in-out': ease.easeCubicInOut,
    'sin-in-out': ease.easeSinInOut,
    'exp-in-out': ease.easeExpInOut,

    'circle-in-out': ease.easeCircleInOut,
    'bounce-in-out': ease.easeBounceInOut,
    'elastic-in-out': ease.easeElasticInOut,
    'back-in-out': ease.easeBackInOut,

    'linear-out-in': d3_ease_reflect(d3_ease_reverse(ease.easeLinear)),
    'poly-out-in': d3_ease_reflect(d3_ease_reverse(ease.easePoly)),
    'quad-out-in': d3_ease_reflect(d3_ease_reverse(ease.easeQuad)),
    'cubic-out-in': d3_ease_reflect(d3_ease_reverse(ease.easeCubic)),
    'sin-out-in': d3_ease_reflect(d3_ease_reverse(ease.easeSin)),
    'exp-out-in': d3_ease_reflect(d3_ease_reverse(ease.easeExp)),

    'circle-out-in': d3_ease_reflect(d3_ease_reverse(ease.easeCircle)),
    'bounce-out-in': d3_ease_reflect(d3_ease_reverse(ease.easeBounce)),
    'elastic-out-in': d3_ease_reflect(d3_ease_reverse(ease.easeElastic)),
    'back-out-in': d3_ease_reflect(d3_ease_reverse(ease.easeBack))
};

type Functor = (num: number) => number;

function d3_ease_reverse(f: Functor): Functor {
    return function(t: number): number {
        return 1 - f(1 - t);
    };
}

function d3_ease_reflect(f: Functor): Functor {
    return function(t: number): number {
        return 0.5 * (t < 0.5 ? f(2 * t) : (2 - f(2 - 2 * t)));
    };
}
