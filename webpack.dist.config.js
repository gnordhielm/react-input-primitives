const webpack = require('webpack')
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

const config = require('./webpack.config.js')

config.output = {
	filename: 'index.min.js',
	path: path.resolve(__dirname, 'dist'),
	publicPath: '/dist/'
},

config.devtool = "source-map"

config.plugins = config.plugins.concat([

	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production'),
			BABEL_ENV: JSON.stringify('production')
		}
	}),

  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),

	// Reduces total bundle size
	new webpack.optimize.UglifyJsPlugin({
		comments: false,
		beautify: false,
		sourceMap: true,
		mangle: {
      screw_ie8: true,
      keep_fnames: true
		},
		// https://github.com/mishoo/UglifyJS2/tree/harmony#compress-options
		compress: {
			screw_ie8: true,
      pure_funcs: [ 'console.log' ]
		},
	})

])

module.exports = config
