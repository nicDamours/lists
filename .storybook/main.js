const path = require("path");

module.exports = {
  webpackFinal: async (config, {configType}) => {
    config.module.rules.push({
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {targets: "defaults"}]
          ]
        }
      }
    })

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto"
    });

    config.resolve.modules.push(path.resolve(__dirname, '../src'));
    config.resolve.alias['@'] = path.resolve(__dirname, '../src');

    return config;
  },

  babel: async () => ({
    presets: ["@vue/cli-plugin-babel/preset"]
  }),

  "stories": [
    "../src/stories/**/*.stories.mdx",
    "../src/stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-styling-webpack"
  ],

  "framework": {
    name: "@storybook/vue3-webpack5",
    options: {}
  },

  docs: {
    autodocs: true
  }
}
