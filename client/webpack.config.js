const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/ts/index.ts',
    devtool: 'eval',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.jpg$/,
                use: ['file-loader', 'url-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: 'dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};