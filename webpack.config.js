const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules').filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
}).forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = {
    externals: nodeModules,
    entry: ['./public/index.js'],
    target: 'node',
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './',
        port: 4172
    }
};
