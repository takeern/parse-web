const { parseConfig } = require('duck-core');
const baseConfig = require('./baseConfig.json');
const config = Object.assign(baseConfig, {
    dirname: __dirname,
});

const p = parseConfig(config);

module.exports = {
    p,
};