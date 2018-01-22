
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

// const EXAMPLES_DIR_PATH = path.resolve(__dirname, 'examples')
// const isDirectory = dir => fs.lstatSync(dir).isDirectory()
// const buildEntries = () => {
//   return fs.readdirSync(EXAMPLES_DIR_PATH).reduce((entries, dir) => {
//     if (dir === 'build') return entries
//
//     const isDraft = dir.charAt(0) === '_'
//
//     if (!isDraft && isDirectory(path.join(EXAMPLES_DIR_PATH, dir)))
//       entries[dir] = path.join(EXAMPLES_DIR_PATH, dir, 'app.js')
//
//     return entries
//   }, {})
// }

const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')

const config = {

	entry: [
		// './root/root.js'
	],

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/'
	},


	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules)/,
				use: { loader: 'babel-loader' }
			}
		]
	},

	plugins: [

		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: module => {
				const { resource } = module
				return resource &&
                    /node_modules/.test(resource) &&
                    !/^.*\.(css|scss)$/.test(resource)
			}
		}),
        new webpack.LoaderOptionsPlugin({ debug: true })

	],

    resolve: {
        plugins: [
            new DirectoryNamedWebpackPlugin({
                exclude: /node_modules/,
                include: /components/,
                transformFn: (dirName, dirPath) => `${dirPath}/${dirName}.jsx`
            })
        ]
    }

	devServer: {
		// hot: true,
		// inline: false,
		port: 1000,
		disableHostCheck: true,
		proxy: {
		  "/services": "http://sbxops.sbx.avtr.net",
		  "/wiki": "http://sbxops.sbx.avtr.net",
		}
	},

	devtool: 'cheap-module-eval-source-map'
}

module.exports = config
