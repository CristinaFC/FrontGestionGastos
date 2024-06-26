module.exports = {
  presets: [
    'module:metro-react-native-babel-preset'
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  plugins: [
    ['macros'],
    ["module:react-native-dotenv"],
    ['react-native-reanimated/plugin']
  ],
};
