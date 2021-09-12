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
    pwa: {
      themeColor: "#2dd36f",
      msTileColor: "#ffffff",
      iconPaths: {
        favicon32: 'assets/icon/favicon-32x32.png',
        favicon16: 'assets/icon/favicon-16x16.png',
        appleTouchIcon: 'assets/icon/apple-touch-icon-152x152.png',
        maskIcon: 'assets/icon/safari-pinned-tab.svg',
        msTileImage: 'assets/icon/msapplication-icon-144x144.png'
      }
    }
  }
}
