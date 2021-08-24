import {addons} from '@storybook/addons';
import {create} from '@storybook/theming';

try {
    const layout = JSON.parse(localStorage['storybook-layout']);
    layout.resizerPanel = layout.resizerPanel || {};
    layout.resizerPanel.x = layout.resizerPanel.x || window.innerWidth - 300;
    localStorage['storybook-layout'] = JSON.stringify(layout);
} catch (e) {
}

addons.setConfig({
    panelPosition: 'right',
    initialActive: 'docs',
    theme: create({
        base: 'light',
        brandTitle: 'Rumble Charts',
    })
});
