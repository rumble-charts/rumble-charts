module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/tests/'
    ],
    coverageThreshold: {
        'global': {
            'branches': 90,
            'functions': 99,
            'lines': 98,
            'statements': 98
        }
    },
    roots: [
        '<rootDir>/src'
    ],
    timers: 'fake',
    transformIgnorePatterns: [
        'node_modules/(?!(d3-|internmap/))'
    ],
};
