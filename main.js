require('@babel/polyfill');

require('@babel/register')({
    'plugins': [
        [   
            'babel-plugin-transform-require-ignore', {
                'extensions': [ '.less', '.sass', '.css' ],
            },
        ],
    ],
});

require('./lib/server');


// var WebpackIsomorphicTools = require('webpack-isomorphic-tools')
// global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack/webpack-isomorphic-config'))
//     // .development(__DEVELOPMENT__)
//     .server('/dist')
//     .then(() => {
//       require('./src/server')
//     })