export default {
   entry: './src/index.js',
   resolve: {
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