import { Configuration, DefinePlugin } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import commonConfig from './webpack.common';

const devConfig: Configuration = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    port: 8080
  },
  plugins: [
    new DefinePlugin({
      ENVIRONMENT: JSON.stringify('development')
    })
  ]
} as Configuration & WebpackDevServerConfiguration);

export default devConfig;
