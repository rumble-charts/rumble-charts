import {configure} from '@storybook/react';

function loadStories() {
    require('./Animate');
    require('./Bars');
    require('./Chart');
    require('./Cloud');
    require('./Dots');
    require('./Handlers');
    require('./Labels');
    require('./Layer');
    require('./Lines');
    require('./Pies');
    require('./RadialLines');
    require('./Ticks');
    require('./Title');
    require('./Transform');
}

configure(loadStories, module);
