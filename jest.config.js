module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
      "^.+\\.js$": "babel-jest",
      "^.+\\.tsx?$": ["ts-jest", {
          babelConfig: true
      }],
      '^.+\\.vue$': '@vue/vue3-jest'
  },
    transformIgnorePatterns: ['/node_modules/(?!@ionic/vue|@ionic/vue-router|@ionic/core|@stencil/core|ionicons)'],
    globals: {}
}
