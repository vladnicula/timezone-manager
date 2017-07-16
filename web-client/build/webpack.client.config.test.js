import path from 'path';
import fs from 'fs';

import webpack from 'webpack';
import { client } from 'config';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
// import HtmlWebpackPlugin from 'html-webpack-plugin';

const clientPath = path.resolve(__dirname, '../');
const clientBuildDestinationPath = path.resolve(__dirname, '../../dist');

const SERVER_PORT = process.env.CLIENT_PORT || 3185;
const HOST_IP = process.env.HOST_IP;

fs.writeFileSync(path.resolve('./dist/config.json'), JSON.stringify({ client }));

/**
 * ExtractTextPlugin will gather all css/scss output
 * into a separate file. This is idealy used in production
 * only. We should test this when we bundle a production
 * version of the app.
 */
const extractSass = new ExtractTextPlugin({
  filename: '[name]-[hash].css',
    // disable: process.env.NODE_ENV === "development"
});

const cleanBuildFolter = new CleanWebpackPlugin(['dist'], {
  root: path.resolve('./'),
  verbose: true,
  dry: false,
  exclude: ['config.json'],
});

// const mainHtmlPath = path.resolve(__dirname, './templates/index.ejs');
// const developmentIndexHtmlFile = new HtmlWebpackPlugin({
//   template: mainHtmlPath,
// });

const vendorExtractionPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  filename: 'vendor.bundle-[hash].js',
  minChunks(module) {
    // this assumes your vendor imports exist in the node_modules directory
    return module.context && module.context.indexOf('node_modules') !== -1;
  },
});

module.exports = {
  /**
   * Simple target entry for now
   */
  entry: {
    client: ['babel-polyfill', `${clientPath}/client.jsx`],
  },

  output: {
    path: clientBuildDestinationPath,
    filename: 'client.bundle-[hash].js',
    publicPath: HOST_IP ? `http://${HOST_IP}:${SERVER_PORT}/dist` : `//localhost:${SERVER_PORT}/dist`,
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css', '.scss'],
    alias: {
      config: path.resolve(__dirname, '../../dist/config.json'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        include: [
          clientPath,
        ],
        exclude: [
          path.resolve(__dirname, '../node_modules'),
        ],

        loader: 'babel-loader',

        options: {
          presets: [
            ['stage-0'],
            ['react'],
          ],
          plugins: [
            'transform-object-rest-spread',
            'transform-async-to-generator',
            ['import', { libraryName: 'antd', style: 'css' }],
          ],
        },
      },

      // TODO https://github.com/webpack-contrib/sass-loader read for production
      {
        test: /\.s?css$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },


      {
        test: /\.(eot|svg|ttf|woff|woff2)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        }],
      },

      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          },
        }],
      },
    ],
  },

  devtool: 'source-map',
  stats: 'minimal',

  plugins: [
    vendorExtractionPlugin,
    extractSass,
    cleanBuildFolter,
    // developmentIndexHtmlFile,
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
      },
    }),
  ],

};
