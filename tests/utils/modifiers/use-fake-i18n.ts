import {createI18n} from "vue-i18n";

export default function useFakeI18n() {
    const i18n = createI18n({
        legacy: false,
        locale: 'en',

        fallbackLocale: 'en',
        messages: {}
    })

    return {
        i18n
    }
}
