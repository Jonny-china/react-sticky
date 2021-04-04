const path = require("path");
const webpack = require("webpack");

const isLive = process.env.NODE_ENV === "production";

module.exports = {
  mode: isLive ? "production" : "development",
  devtool: isLive ? "source-map" : "eval-cheap-source-map",
  entry: {
    demos: path.resolve("examples", "index.tsx"),
  },
  output: {
    path: path.join(__dirname, "examples"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "examples"),
    publicPath: "/",
    compress: true,
    port: 9000,
    historyApiFallback: true,
  },
};
