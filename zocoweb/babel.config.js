module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv', // 👈 Soporta import { ... } from '@env'
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
      [
        'module-resolver', // 👈 Alias personalizados (tu @services)
        {
          root: ['./src'],
          alias: {
            '@services': './src/services',
          },
        },
      ],
      'react-native-reanimated/plugin', // Si usás Reanimated
    ],
  };
};
