var path = require('path');
var webpack = require('webpack');
function d(dir) { return path.resolve(__dirname, dir); }

module.exports = {

	entry: [
		'babel/polyfill',
		'./src/index.js',
	],

	watch: true,
	debug: true,
	devtool: 'module-source-map',
	devtool: 'cheap-module-source-map',

	resolve: {
		extensions: [ '', '.js', '.jsx' ],
		modulesDirectories: [ 'node_modules', 'src' ],
	},

	module: {
		loaders: [
			{ test:/src\/Workbench.*\.(png|svg|html)$/,
			  loader:'file?context=./src/Workbench&name=[path][name].[ext]' },
			{ test:/\.jsx?$/, loader:'babel', include:d('src') },
		],
	},

	output: {
		path: './dist',
		pathinfo: true,
		filename: 'chip3.js',
		library: 'Chip3',
		libraryTarget: 'umd',
	},

	plugins: [
		new webpack.NoErrorsPlugin(),
	],

};