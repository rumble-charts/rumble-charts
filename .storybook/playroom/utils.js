export const getOptions = function getOptions(
    {
        url = 'http://localhost:9000',
        code = '',
        disable = false,
        reactElementToJSXStringOptions = {sortProps: false}
    } = {}
) {
    return {
        url: url,
        code: code,
        disable: disable,
        reactElementToJSXStringOptions: reactElementToJSXStringOptions
    };
};

export const isStoryFnWithArgs = function isStoryFnWithArgs(storyFn) {
    return 'args' in storyFn;
};
