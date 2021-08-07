const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";
const envFilename = isDev ? ".env.dev" : ".env";
const envValues = require("dotenv").config({ path: path.resolve(envFilename) });

const config = {
    mode: isDev ? "development" : "production",

    target: "web",

    devServer: {
        contentBase: "./public",
        hot: true,
        disableHostCheck: true,
        port: 3000,
        progress: true,
        historyApiFallback: true,
    },

    devtool: isDev ? "cheap-module-source-map" : undefined,

    entry: {
        finy: path.resolve(__dirname, "src", "index.tsx"),
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        publicPath: "/",
        chunkFilename: "[name].[contenthash].js",
    },

    module: {
        rules: [
            {
                test: /\.(j|t)s(x)?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    targets: { browsers: "last 2 versions" },
                                },
                            ],
                            "@babel/preset-typescript",
                            "@babel/preset-react",
                        ],
                        plugins: [
                            [
                                "@babel/plugin-proposal-decorators",
                                { legacy: true },
                            ],
                            "@babel/plugin-transform-runtime",
                            isDev && require("react-refresh/babel"),
                        ].filter(Boolean),
                    },
                },
            },

            {
                test: /\.css$/i,
                // include: path.resolve(__dirname, "src"),
                use: [
                    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                ],
            },

            {
                test: /\.s[ac]ss$/i,
                // include: [
                //     path.resolve(__dirname, "src"),
                //     path.resolve(__dirname, "node_modules"),
                // ],
                use: [
                    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader",
                ],
            },

            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },

    resolve: {
        alias: {
            "@": path.resolve(...[__dirname, "./src"]),
            "@src": path.resolve(...[__dirname, "./src"]),
            react: path.resolve("./node_modules/react"),
            // "react-dom": path.resolve("./node_modules/react-dom"),
            // "react-router": path.resolve("./node_modules/react-router"),
            // "react-router-dom": path.resolve("./node_modules/react-router-dom"),
        },
        extensions: [".tsx", ".ts", ".js", ".jsx"],
        fallback: {
            events: false,
            buffer: false,
        },
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "Finy",
            template: path.resolve(
                path.join(__dirname, "public", "index.html")
            ),
        }),
        new webpack.ProvidePlugin({
            process: "process/browser",
        }),
        new webpack.EnvironmentPlugin([...Object.keys(envValues.parsed)]),
    ],

    optimization: {
        minimize: isDev ? false : true,
    },
};

if (!isDev) {
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: "finy.css",
            chunkFilename: "finy.[contenthash].css",
        })
    );
} else {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new ReactRefreshWebpackPlugin());
}

module.exports = config;
