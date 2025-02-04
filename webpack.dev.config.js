const webpack = require('webpack');
var path = require('path');

module.exports = env => ({
    entry: './src/index.js',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname,'output'),
        filename: 'bundle.js',
        libraryTarget: 'umd',
        // publicPath: 'http://192.168.0.13:9000/'
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.MKR": env.MKR 
        })
    ],
    devServer: {
        // host: '192.168.0.13',
        host:'localhost',
        publicPath: '/',
        contentBase: path.resolve(__dirname),
        watchContentBase: true,
        compress: true,
        port: 9000,
        open: true,
        proxy:{
            "/fsjson": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/fsjson"
            },
            "/addwav": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/addwav"
            },
            "/addrack": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/addrack"
            },
            "/updateVoiceConfig": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/updateVoiceConfig"
            },
            "/updateSingleVoiceConfig": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/updateSingleVoiceConfig"
            },
            "/updatePinConfig": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/updatePinConfig"
            },
            "/addfirmware": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/addfirmware"
            },
            "/addgui": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/addgui"
            },
            "/bootFromEmmc": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/bootFromEmmc"
            },
            "/rpc": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/rpc"
            },
            "/updaterecoveryfirmware": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/updaterecoveryfirmware"
            },
            "/updateMetadata": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/updateMetadata"
            },
            "/voicejson": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/voicejson"
            },
            "/configjson": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/configjson"
            },
            "/update": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/update"
            },
            "/wvr_emmc_backup.bin": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/wvr_emmc_backup.bin"
            },
            "/deleteFirmware": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/deleteFirmware"
            },
            "/playWav": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/playWav"
            },
            "/emmcReset": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/emmcReset"
            },
            "/restoreEMMC": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/restoreEMMC"
            },
            "/updateBankConfig": {
                "changeOrigin": true,
                "cookieDomainRewrite": "localhost",
                "target": "http://192.168.4.1/updateBankConfig"
            }
        }
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|build)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["es2015", "react", "stage-0"],
                        plugins: ["transform-runtime"]
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg|wav)$/i,
                exclude: /(node_modules|bower_components|build)/,
                use: {
                    loader: 'url-loader',
                }
            }
        ]
    }
})
