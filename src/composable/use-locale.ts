import {useLocalStorage} from "@vueuse/core";
import { frCA, enUS } from "date-fns/locale";
import {computed} from "vue";

export default function useLocale() {
    const preferredLocale = useLocalStorage("preferred-locale", "en");

    const preferredDateLocale = computed(() => preferredLocale.value === 'en' ? enUS : frCA);

    return {
        preferredLocale,
        preferredDateLocale
    }
}
