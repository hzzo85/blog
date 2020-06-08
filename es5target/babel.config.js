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
        },
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-object-assign'],
};
