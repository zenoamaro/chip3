var path = require('path');
var webpack = require('webpack');
function d(dir) { return path.resolve(__dirname, dir); }

module.exports = {

	entry: [
		'babel/polyfill',
		'./src/index.js',
	],

	debug: false,
	devtool: 'module-source-map',

	resolve: {
		extensions: [ '', '.js', '.jsx' ],
		modulesDirectories: [ 'node_modules', 'src' ],
	},

	module: {
		loaders: [
			{ test:/src\/Workbench\/.*\.(png|svg|html)$/,
			  loader:'file?context=./src/Workbench&name=[path][name].[ext]' },
			{ test:/\.jsx?$/, loader:'babel', include:d('src') },
		],
	},

	output: {
		path: './dist',
		filename: 'chip3.js',
		library: 'Chip3',
		libraryTarget: 'umd',
	},

	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			comments: /\/\/#/, // Keep only source maps
			compress: { warnings: false },
		}),
	],

};