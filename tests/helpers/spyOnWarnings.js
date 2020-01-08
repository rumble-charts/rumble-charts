const originalError = console.error;
const originalWarn = console.warn;

export default function spyOnWarnings(callback, {
    spy = jasmine.createSpy('console.error'),
    revert = true
} = {}) {
    console.error = spy;
    console.warn = spy;
    callback();
    if (revert) {
        console.error = originalError;
        console.warn = originalWarn;
    }
    return spy;
}
