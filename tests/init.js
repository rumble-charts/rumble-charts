'use strict';

global.window.crypto = {
    getRandomValues: function (_rnds) {
        for (var i = 0, r, count = _rnds.length; i < count; i++) {
            if ((i & 0x03) === 0) {
                r = Math.random() * 0x100000000;
            }
            _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }
    }
};

const jsdom = require('jsdom').jsdom;

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};

global['React'] = require('react');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
