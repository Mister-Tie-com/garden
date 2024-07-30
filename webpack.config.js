const Encore = require('@symfony/webpack-encore');
let dotenv = require('dotenv');

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/index.js')
    .splitEntryChunks()
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .configureBabel((config) => {
        config.presets.push('@babel/preset-react');
    }, {
        useBuiltIns: 'usage',
        corejs: 3
    })
    .configureDefinePlugin(options => {
        const env = dotenv.config();
        if (env.error) {
            throw env.error;
        }
        options['process.env'] = JSON.stringify(env.parsed);
    })
    .enableSassLoader()
;

module.exports = Encore.getWebpackConfig();