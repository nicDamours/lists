<template>
  <ion-fab-button @click="handleToggleThemeClick">
    <ion-icon :icon="themeToggleIcon"/>
  </ion-fab-button>
  <ThemeColorSelector/>
</template>

<script>
import {useDark, useToggle} from "@vueuse/core";
import {computed} from "vue";
import {IonFabButton, IonIcon} from "@ionic/vue";
import {moonOutline, sunnyOutline} from "ionicons/icons";
import ThemeColorSelector from "@/components/ThemeColorSelector.vue";

export default {
  name: "ThemeToggle",
  components: {
    IonIcon,
    IonFabButton,
    ThemeColorSelector
  },
  setup() {
    const isDark = useDark({
      selector: 'body',
      attribute: 'class',
      valueDark: 'dark',
      valueLight: 'light'
    })

    const themeToggleIcon = computed(() => isDark.value ? sunnyOutline : moonOutline);

    const toggleTheme = useToggle(isDark)

    const handleToggleThemeClick = () => {
      toggleTheme();
    }
    return {
      themeToggleIcon,
      handleToggleThemeClick
    }
  }
}
</script>
