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

global['React'] = require('react');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
