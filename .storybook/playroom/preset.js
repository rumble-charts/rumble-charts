/**
 * Copied and adopted from https://github.com/rbardini/storybook-addon-playroom
 */

function config(entry = []) {
    return [...entry, require.resolve('./preset/addDecorator')];
}

function managerEntries(entry = []) {
    return [...entry, require.resolve('./register')];
}

module.exports = {managerEntries, config}
