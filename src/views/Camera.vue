<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title> {{ t('global.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('global.title') }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <CameraSnapshot />
    </ion-content>
  </ion-page>
</template>

<script>
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import CameraSnapshot from "../components/CameraSnapshot";
import {useI18n} from "vue-i18n";

export default {
  name: "Camera",
  components: { IonPage, IonContent, IonTitle, IonHeader, IonToolbar, CameraSnapshot },
  setup() {
    const { t } = useI18n();

    return {
      t
    }
  }
}
</script>

<style scoped>

</style>
