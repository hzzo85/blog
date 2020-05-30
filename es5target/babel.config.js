module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          chrome: '58',
          ie: '10',
          android: '5',
          ios: '9',
          // browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        },
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-object-assign'],
};
