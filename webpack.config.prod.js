const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

process.env.NODE_ENV = "production";

module.exports = {
  mode: "production",
  target: "web",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.[contenthash].js"
  },
  plugins: [
    // Display bundle stats
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
    new webpack.DefinePlugin({
      //This global makes sure React is build in prod mode
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
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
        minifyURLs: true
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /(\.scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: "[local]---[hash:base64:5]]",
              importLoaders: 3
            }
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-resources-loader",
            options: {
              sourceMap: true,
              resources: [
                path.resolve(
                  __dirname,
                  "src/styles/utils/variables.module.scss"
                ),
                path.resolve(
                  __dirname,
                  "src/styles/utils/functions.module.scss"
                ),
                path.resolve(__dirname, "src/styles/utils/mixins.module.scss")
              ]
            }
          }
        ]
      }
    ]
  }
};
