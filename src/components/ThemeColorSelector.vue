<template>
  <ion-fab-list side="top">
    <ion-fab-button v-for="(theme, $index) in possibleTheme" :key="$index" :class="`theme-selector--${theme}`"
                    @click="handleThemeSelect(theme)">
      <font-awesome-icon :icon="['fal', 'paint-brush-alt']"/>
    </ion-fab-button>
  </ion-fab-list>
</template>

<script>
import {ref} from "vue";
import {IonFabButton, IonFabList} from "@ionic/vue";
import {useColorMode} from "@vueuse/core";
import {checkmark} from "ionicons/icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "ThemeColorSelector",
  components: {
    FontAwesomeIcon,
    IonFabList,
    IonFabButton
  },
  setup() {
    const possibleTheme = ref([
      'default',
      'pink',
      'blue',
      'yellow'
    ])

    const mode = useColorMode({
      attribute: "color",
      storageKey: 'palette-color',
      modes: {
        default: 'default',
        pink: 'pink',
        blue: 'blue',
        yellow: 'yellow',
      }
    })

    const handleThemeSelect = (selectedTheme) => {
      console.log('selectedTheme', selectedTheme);
      mode.value = selectedTheme
    }

    return {
      checkmark,
      possibleTheme,
      handleThemeSelect
    }
  }
}
</script>
