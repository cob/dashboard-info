import  path, {dirname} from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      globalObject: 'this',
      library: {
            name: "cobDashboardInfo",
            type: 'umd'
      },
      filename: 'dashboard-info.js'
    }
}