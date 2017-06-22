export default function spyOnWarnings(callback) {
    const error = console.error;
    const warn = console.warn;
    const spy = jasmine.createSpy('console.error');
    console.error = spy;
    console.warn = spy;
    callback();
    console.error = error;
    console.warn = warn;
    return spy;
}
