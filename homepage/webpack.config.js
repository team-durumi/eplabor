const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';
const dotenv = require('dotenv');

module.exports = () => {
    const env = dotenv.config().parsed;
    env = JSON.stringify(env);
    return {
        entry: glob.sync('./src/js/**.js').reduce(function (obj, el) {
            obj[path.parse(el).name] = el;
            return obj
        }, {}),
        output: {
            filename: devMode ? '[name].js' : '[name].[hash].min.js',
            chunkFilename: '[name].bundle.min.js',
            path: path.resolve('static', 'assets')
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                }
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                env: env
            }),
            new MiniCssExtractPlugin({
                filename: devMode ? '[name].css' : '[name].[hash].min.css',
                chunkFilename: devMode ? '[id].css' : '[id].[hash].min.css',
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                Popper: ['popper.js', 'default']
            }),
        ],
        devServer: {
            proxy: {
                '**': 'http://localhost:1313'
            },
            port: '3000',
            host: '0.0.0.0',
            publicPath: '/assets/',
            watchContentBase: true,
            compress: true,
            stats: 'minimal'
        }
    }
};
