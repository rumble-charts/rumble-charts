'use strict';

const spyOnWarnings = callback => {
    const error = console.error;
    const spy = jasmine.createSpy('console.error');
    console.error = spy;
    callback();
    console.error = error;
    return spy;
};

module.exports = spyOnWarnings;
