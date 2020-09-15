/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const webpack = require("webpack");
const { override, addWebpackAlias, disableChunk } = require("customize-cra");

module.exports = override(
    disableChunk(),
    addWebpackAlias({
        "@src": path.resolve(__dirname, "./src"),
    })
);
