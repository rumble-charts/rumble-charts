import React from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import lzString from 'lz-string';
import {addons, makeDecorator} from '@storybook/addons';

import {EVENTS, PARAM_KEY} from './constants';
import {getOptions} from './utils';

const Story = function Story({getStory, context, settings}) {

    const {parameters} = settings;

    const {url, code, reactElementToJSXStringOptions} = getOptions(parameters);

    const story = getStory(context);
    const jsxString = code || reactElementToJSXString(story, reactElementToJSXStringOptions);
    const channel = addons.getChannel();
    const codeUrl = url && ''.concat(url, '#?code=')
        .concat(lzString.compressToEncodedURIComponent(JSON.stringify({code: jsxString})));
    channel.emit(EVENTS.UPDATE, codeUrl);
    return React.createElement(React.Fragment, null, story);
};

export var withPlayroom = makeDecorator({
    name: 'withPlayroom',
    parameterName: PARAM_KEY,
    wrapper: function wrapper(getStory, context, settings) {
        return React.createElement(Story, {
            getStory: getStory,
            context: context,
            settings: settings
        });
    }
});
