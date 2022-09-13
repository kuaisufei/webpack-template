'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { postcss } = require('autoprefixer');
const glob = require('glob');
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync('./src/*/index.js');
    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index];
        const match = entryFile.match(/src\/(.*)\/index.js/);
        const pageName = match && match[1];
        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: ['vendors', pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: true,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            })
        )
    });
    return {
        entry,
        htmlWebpackPlugins
    }
}

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
    mode: 'production',
    entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    module: {
        rules: [{
            test: /.js$/, use: [
                'babel-loader',
                'eslint-loader'
            ]
        }, {
            test: /.css$/, use: [
                MiniCssExtractPlugin.loader,
                'css-loader'
            ]
        }, {
            test: /.less$/, use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'less-loader',
                'postcss-loader',
                {
                    loader: 'px2rem-loader',
                    options: {
                        remUnit: 75,
                        remPrecision: 8
                    }
                }
            ]
        }, {
            test: /.(png|jpg|jpeg|gif)$/, use: [{
                loader: 'file-loader',
                options: {
                    // limit: 10240,
                    filename: '[name]_[hash:8].[ext]'
                }
            }]
        }, {
            test: /.(woff|woff2|eot|ttf|otf)$/, use: [{
                loader: 'file-loader',
                options: {
                    filename: '[name]_[hash:8].[ext]'
                }
            }]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `[name]_[contenthash:8].css`
        }),
        new CleanWebpackPlugin()
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'react',
        //             entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
        //             global: 'React'
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
        //             global: 'ReactDom'
        //         }
        //     ]
        // })
    ].concat(htmlWebpackPlugins),
    optimization: {
        minimizer: [
            new CssMinimizerWebpackPlugin()
        ],
        sideEffects: true,
        splitChunks: {
            // cacheGroups: {
            //     commons: {
            //         test: /(react|react-dom)/,
            //         name: 'vendors',
            //         chunks: 'all'
            //     }
            // }
            minSize: 0,
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    },
    devtool: 'inline-source-map'
};