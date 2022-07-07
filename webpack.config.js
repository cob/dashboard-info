export default {
   entry: './src/index.js',
   resolve: {
      alias: {
         src: path.resolve(__dirname, 'src'),
         test: path.resolve(__dirname, 'tests'),
      },
      fallback: { 
         "url": false,
         "util": false,
         "fs": false
      }
   },
   mode: "production",
   output: {
      library: {
            name: "cobDashboardInfo",
            type: 'umd'
      },
      filename: 'dashboard-info.js'
    }
}