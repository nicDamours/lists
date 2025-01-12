// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
const path = require("node:path");
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
      start_url: "https://maliste.app?v=" + version
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@tests": path.resolve(__dirname, "tests")
      }
    }
  },
  devServer: {
    port: 8100
  }
}
