export default function getMockI18nPlugin(translatableValue: string | null = null) {
    // eslint-disable-next-line no-undef
    const i18nModule = jest.requireActual("vue-i18n");

    return i18nModule.createI18n({
        missing: () => translatableValue,
        silentTranslationWarn: true,
        silentFallbackWarn: true
    });
}
