import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development', // switch to 'production' for build
  entry: './renderer/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.bundle.js',
    publicPath: '/',
  },
  devServer: {
    port: 8080,
    hot: true,
  },
  target: 'web', // IMPORTANT: use 'web' for HMR in Electron renderer
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './renderer/index.html',
      inject: 'body',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' }, // copy icons, css etc
      ],
    }),
  ],
  devtool: 'source-map',
};
