<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{title}}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal" color="primary">
            {{ t('global.close')}}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <slot></slot>
    </ion-content>
    <ion-footer>
      <slot name="buttons"></slot>
    </ion-footer>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  modalController
} from "@ionic/vue";
import {useI18n} from "vue-i18n";

export default {
  name: "BaseModal",
  components: { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonFooter, IonButtons, IonButton },
  props: {
    title: {
      type: String,
      required: true,
    }
  },
  setup() {
    const { t } = useI18n();
    const closeModal = () => {
      modalController.dismiss()
    }

    return {
      t,
      closeModal
    }
  }
}
</script>
