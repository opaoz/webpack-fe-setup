'use strict';

/**
 * @file webpack.config.js
 *
 * @author opa_oz
 * @date 29/09/2017
 */

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const plugins = [
    new ExtractTextPlugin({
        filename: '[name].bundle.css',
        allChunks: true,
    }),
    new InlineManifestWebpackPlugin({
        name: 'webpackManifest'
    }),
    new HtmlWebpackPlugin({
        template: 'index.html',
        favicon: './images/favicon.ico',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        },
        hash: true,
        inject: true
    })
];

if (process.env.NODE_ENV === 'production') {
    plugins.unshift(new UglifyJSPlugin());
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        app: ['./app.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /bower_components/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }]
            },
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        'sass-loader'
                    ]
                }),
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '/[path][hash:base64:5].rimra[name].[ext]'
                }
            }
        ]
    },
    plugins
};