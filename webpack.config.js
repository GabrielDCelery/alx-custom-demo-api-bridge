'use strict';

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, '/src/static', 'index.js'),
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.min.js'
    },
    module: {
        rules: [{
            test: /\.(png|jpg|svg)$/,
            use: {
                loader: 'file-loader'
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }, {
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(scss)$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    plugins: function () {
                        return [require('precss'), require('autoprefixer')];
                    }
                }
            }, {
                loader: 'sass-loader'
            }]
        }]
    },
    plugins: [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            test: /\.js($|\?)/i,
            extractComments: true
        })
    ]
};