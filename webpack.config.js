export default {
   entry: './src/index.js',
   resolve: {
      fallback: { 
         "url": false,
         "fs": false
      }
   },
   mode: "production",
   output: {
      filename: 'dashboard-info.js'
   }
};
