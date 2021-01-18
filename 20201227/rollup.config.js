import babel from 'rollup-plugin-babel';
export default {
  input: './src/index.js',
  output: {
    format: 'umd',
    file: './dist/umd/vue.js',
    name: 'Vue',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}