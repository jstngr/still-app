const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: path.join(__dirname, 'src', 'index.tsx'),
  target: 'browserslist',
  resolve: {
    alias: {
      _: path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   publicPath: '/'
  // },
  output: {
    path: path.resolve(__dirname, 'build'), // Make sure it's 'build'
    filename: 'bundle.js',
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    static: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.?(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            include: [path.resolve(__dirname, 'src')],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(png|jpeg|gif|ico)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      favicon: './src/assets/Giraff_only.svg',
    }),
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'CNAME', to: '' }, // Copy CNAME file to the root of the build directory
      ],
    }),
  ],
};
