<template>
  <ion-item>
    <ion-grid>
      <ion-row>
        <ion-col>
          <slot></slot>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-button color="danger" fill="clear" @click="$emit('decline-click')">
            <ion-text>{{ t(declineText) }}</ion-text>
            <ion-icon slot="end" :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-col>
        <ion-col>
          <ion-button v-if="acceptVisible" color="primary" fill="clear" @click="$emit('accept-click')">
            <ion-text>{{ t('shareRequest.item.accept') }}</ion-text>
            <ion-icon slot="end" :icon="checkmarkOutline"></ion-icon>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-item>
</template>

<script>
import {IonButton, IonCol, IonGrid, IonIcon, IonItem, IonRow, IonText} from "@ionic/vue";
import {checkmarkOutline, trashOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";

export default {
  name: "ShareRequestItem",
  emits: ["accept-click", "decline-click"],
  components: {IonItem, IonText, IonGrid, IonCol, IonRow, IonIcon, IonButton},
  props: {
    acceptVisible: {
      type: Boolean,
      required: false,
      default() {
        return true
      }
    },
    declineText: {
      type: String,
      required: false,
      default() {
        return "shareRequest.item.decline"
      }
    }
  },
  setup() {
    const {t} = useI18n();

    return {
      t,
      trashOutline,
      checkmarkOutline,
    }
  }
}
</script>
