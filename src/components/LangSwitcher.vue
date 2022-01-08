<template>
  <ion-fab-button v-for="locale in availableLocales" :key="locale" @click.prevent="selectLocale(locale) ">
    {{ locale }}
  </ion-fab-button>
</template>

<script>
import {IonFabButton} from "@ionic/vue";
import {flagOutline} from "ionicons/icons";
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import useLocale from "@/composable/use-locale";

export default {
  name: "LangSwitcher",
  components: {
    IonFabButton,
  },
  setup() {
    const { locale } = useI18n();
    const optionOpens = ref(false);

    const { setPreferredLocale } = useLocale();

    const handleTriggerClick = () => {
      optionOpens.value = true;
    }

    const availableLocales = computed(() => ['fr', 'en']);

    const selectLocale = (selectedLocale) => {
      locale.value = selectedLocale;
      setPreferredLocale(selectedLocale);
    }

    return {
      optionOpens,
      flagOutline,
      selectLocale,
      availableLocales,
      handleTriggerClick
    }
  }
}
</script>

<style scoped>

</style>
