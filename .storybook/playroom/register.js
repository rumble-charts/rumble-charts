import React from 'react';
import {addons, types} from '@storybook/addons';
import {ADDON_ID, PANEL_ID, PARAM_KEY} from './constants';
import Panel from './Panel';

addons.register(ADDON_ID, function() {
    const channel = addons.getChannel();
    addons.add(PANEL_ID, {
        title: 'Playroom',
        type: types.TAB,
        route: function route({storyId}) {
            return '/playroom/'.concat(storyId);
        },
        match: function match({viewMode}) {
            return viewMode === 'playroom';
        },
        render: function render({active}) {
            return React.createElement(Panel, {
                active: active,
                channel: channel
            });
        },
        paramKey: PARAM_KEY
    });
});
