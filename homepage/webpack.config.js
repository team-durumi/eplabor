const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
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
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].min.css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].min.css',
        }),
    ],
    devServer: {
        proxy: {
            '/': 'http://localhost:1313'
        },
        publicPath: '/assets/',
        stats: 'minimal',
    }
};
