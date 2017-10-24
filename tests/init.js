global.window.crypto = {
    getRandomValues: function(_rnds) {
        for (var i = 0, r, count = _rnds.length; i < count; i++) {
            if ((i & 0x03) === 0) {
                r = Math.random() * 0x100000000;
            }
            _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }
    }
};

import React from 'react';
global['React'] = React;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});
