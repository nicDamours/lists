// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0

module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: true,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true
    },
  },
  pwa: {
    themeColor: "#2dd36f",
    msTileColor: "#ffffff",
    manifestOptions: {
      start_url: "https://lists-bl5q.onrender.com?v=" + version
    }
  }
}
