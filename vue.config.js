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
      // eslint-disable-next-line @typescript-eslint/camelcase
      start_url: "https://lists-bl5q.onrender.com"
    }
  }
}
