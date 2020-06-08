import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import path from 'path';

export default {
  input: 'source/generator.js',
  output: [
    {
      file: 'lib/generator.js',
      format: 'es',
    },
    // { file: 'lib/track.cjs.js', format: 'cjs', name: 'track' },
  ],
  plugins: [
    getBabelOutputPlugin({
      configFile: path.resolve(__dirname, 'babel.config.js')
    }),
  ],
};
