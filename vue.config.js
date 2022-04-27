//vue.config.js
const path = require('path')
const version = '1.0.3'
const outDir = 'static/dist/shop_wap/'
let settings = require('./src/static/settings.js').config
const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
function resolve(dir) {
    return path.join(__dirname, dir);
}

const myPlugin = require('./webpackPlugins.js')
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 定义webpack插件
let plugins = [
    new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
            const tfPages = new TransformPages({
                includes: ['path', 'name', 'aliasPath']
            });
            return JSON.stringify(tfPages.routes)
        }, true)
    })
]

// 不是开发环境
if (process.env.NODE_ENV !== 'development') {

    if (process.env.UNI_PLATFORM === 'h5') {
        // 如果是h5平台处理静态文件

        plugins.push(
            new CopyWebpackPlugin([
                {
                    from: resolve('./src/static'),
                    to: resolve('./dist/build/h5/' + outDir)
                }
            ])
        );
        plugins.push(new myPlugin.H5Plugin());
    } else if (process.env.UNI_PLATFORM === 'mp-weixin') {
        // 如果是微信小程序，处理配置文件
        plugins.push(new myPlugin.MpWeixinPlugin());
    }
}

function fmtUrl(url = '') {
    return url.replace('.[contenthash:8]', '');
}

module.exports = {
    transpileDependencies: ['uni-simple-router'],
    assetsDir: outDir,
    publicPath: '/',
    filenameHashing: true,
    productionSourceMap: false,
    // 使用这个插件
    configureWebpack: {
        plugins: plugins,
        externals: {
            // 'vue': 'Vue',
            // 'vuex': 'Vuex',
            // 'axios': 'axios',
        }
    },

    devServer: {
        disableHostCheck: true,
        /* 设置为0.0.0.0则所有的地址均能访问 */
        host: '0.0.0.0',
        port: 8081,
        https: false,
        hotOnly: false,
        /* 使用代理 */
        proxy: {
            '/api': {
                /* 目标代理服务器地址 */
                target: settings.base_url,
                /* 允许跨域 */
                pathRewrite: {
                    '^/api': ''
                },
                changeOrigin: true
            }
        }
    },

    chainWebpack: config => {
        config.plugins.delete('prefetch');
        let filename = '',
            chunkFilename = '';
        if (process.env.UNI_PLATFORM === 'h5') {
            config.plugins.delete('named-chunks');
            config.plugins.delete('pwa');
            filename = fmtUrl(config.output.store.get('filename')) + '?v=' + version;
            chunkFilename = fmtUrl(config.output.store.get('chunkFilename')) + '?v=' + version;
        } else {
            filename = config.output.store.get('filename') + '?v=' + version;
            chunkFilename = config.output.store.get('chunkFilename') + '?v=' + version;
        }
        config.output.store.set('filename', outDir + filename);
        config.output.store.set('chunkFilename', outDir + chunkFilename);
        config.resolve.alias.set('@', resolve('./src'));
        config.module.rule('images').test(/\.(png|jpe?g|gif|webp)(\?.*)?$/).use('url-loader').loader('file-loader').options({
            name: outDir + 'image/[name].[ext]'
        });

        config.module.rule('svg').test(/\.(svg)(\?.*)?$/).use('file-loader').loader('file-loader').options({
            name: outDir + 'image/[name].[ext]'
        });

    }
};
