const nodeExternals = require('webpack-node-externals');


module.exports = {
  mode: "development",

  target: "node",
  externals: [nodeExternals()],

  watch: true,

  entry: {
    backend: "./js/backend.ts",
    import: "./js/import.ts"
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".js", ".json"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      { test: /\.csv$/, loader: 'csv-loader', options: {
          header: false,
          skipEmptyLines: true
      }}
    ]
  }
};