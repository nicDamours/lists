import {useLocalStorage} from "@vueuse/core";
import {enUS, frCA} from "date-fns/locale";
import {computed} from "vue";

export type PossibleLocale = 'en' | 'fr';

export default function useLocale() {
    const preferredLocaleKey = "preferred-locale"
    const preferredLocaleStorageItem = useLocalStorage<PossibleLocale>(preferredLocaleKey, "en");

    const preferredLocale = computed<PossibleLocale>({
        get() {
            return preferredLocaleStorageItem.value
        },
        set(value: PossibleLocale) {
            window.dispatchEvent(new StorageEvent('storage', {
                key: preferredLocaleKey,
                newValue: value
            }));

            preferredLocaleStorageItem.value = value;
        }
    })

    const setPreferredLocale = (newLocale: PossibleLocale) => {
        preferredLocale.value = newLocale;
    }

    const preferredDateLocale = computed(() => {
        return preferredLocale.value === 'en' ? enUS : frCA
    });

    return {
        preferredLocale,
        setPreferredLocale,
        preferredDateLocale
    }
}
