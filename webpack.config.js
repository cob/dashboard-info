export default [
   {
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
   },
   {
      experiments: {
         outputModule: true,
      },
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
            type: 'module'
         },
         filename: 'dashboard-info.esm.js'
      }
   }
]