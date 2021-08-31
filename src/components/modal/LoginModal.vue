<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sign in</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <FireBaseAuthenticationUI @authentication-success="handleAuthenticationSuccess"/>
    </ion-content>
  </ion-page>
</template>

<script>
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, modalController} from "@ionic/vue";
import FireBaseAuthenticationUI from "../FireBaseAuthenticationUI";
import { ref } from "vue";

export default {
  name: "LoginModal",
  components: {
    FireBaseAuthenticationUI,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonPage
  },
  setup() {
    const open = ref(true);


    const handleAuthenticationSuccess = () => {
      modalController.dismiss()
    }

    return {
      open,
      handleAuthenticationSuccess
    }
  }
}
</script>

<style scoped>

</style>
