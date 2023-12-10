<template>
  <ion-fab slot="fixed" class="m-preferences" horizontal="start" vertical="bottom">
    <ion-fab-button>
      <ion-icon :icon="settingsOutline"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="top">
      <ThemeToggle/>
    </ion-fab-list>
    <ion-fab-list side="end">
      <LangSwitcher/>
    </ion-fab-list>
  </ion-fab>
</template>

<script>
import {IonFab, IonFabButton, IonFabList, IonIcon} from "@ionic/vue";
import {settingsOutline} from "ionicons/icons";
import ThemeToggle from "./ThemeToggle";
import LangSwitcher from "./LangSwitcher"

export default {
  name: "OrganismPreferences",
  components: {
    ThemeToggle,
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon,
    LangSwitcher
  },
  setup() {
    return {
      settingsOutline
    }
  }
}
</script>

<style scoped>

</style>
