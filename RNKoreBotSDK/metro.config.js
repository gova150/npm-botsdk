const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      'rn-kore-bot-sdk-v79': __dirname,
      '@govardhanboli/rn-kore-bot-sdk-v79': __dirname,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
