import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import rename from 'rollup-plugin-rename';
import replace from '@rollup/plugin-replace';
import {terser} from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

const plugins = [
    nodeResolve({
        browser: true,
        modulesOnly: true,
    }),
    commonjs(),
    typescript(),
    rename({
        include: ['**/*.js', '**/*.mjs'],
        map: (name) => name.replace('node_modules/', 'external/'),
    }),
    replace({
        preventAssignment: true,
        values: {
            'node_modules/': 'external/',
            'require(\'crypto\')': '(window.crypto || window.msCrypto)',
        },
        delimiters: ['', '']
    })
];

const onwarn = (warning, rollupWarn) => {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        rollupWarn(warning);
    }
};

export default [
    {
        input: ['src/index.ts', 'src/helpers/index.ts'],
        output: [
            {
                dir: 'cjs',
                format: 'cjs',
                exports: 'named',
                preserveModules: true,
                preserveModulesRoot: 'src',
            },
            {
                dir: 'es',
                format: 'es',
                preserveModules: true,
                preserveModulesRoot: 'src',
            },
        ],
        external: ['react', /d3-/],
        plugins,
        onwarn
    },
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'umd/rumble-charts.js',
                format: 'umd',
                name: 'RumbleCharts',
                globals: {
                    react: 'React'
                }
            },
            {
                file: 'umd/rumble-charts.min.js',
                format: 'umd',
                name: 'RumbleCharts',
                globals: {
                    react: 'React'
                },
                plugins: [terser()]
            }
        ],
        external: ['react'],
        plugins,
        onwarn
    }
];
