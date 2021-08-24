/**
 * Copied and adopted from https://github.com/rbardini/storybook-addon-playroom
 */

import React, {useEffect, useState} from 'react';
import {styled} from '@storybook/theming';
import {EVENTS} from './constants';

const Message = styled.p({
    textAlign: 'center'
});
const Iframe = styled.iframe({
    border: '0 none',
    height: '100%',
    width: '100%'
});

const Panel = function Panel({active, channel}) {
    const [url, setUrl] = useState('');

    useEffect(function() {
        const listener = function listener(newUrl) {
            return setUrl(newUrl);
        };

        channel.on(EVENTS.UPDATE, listener);
        return function() {
            return channel.off(EVENTS.UPDATE, listener);
        };
    }, [channel]);

    if (!active) {
        return null;
    }

    if (!url) {
        return React.createElement(Message, null, 'Playroom has been disabled for this story.');
    }

    return React.createElement(Iframe, {
        key: url,
        allowFullScreen: true,
        src: url,
        title: 'Playroom'
    });
};

export default Panel;
