<template>
  <ion-item>
    <ion-grid>
      <ion-row>
        <ion-col>
          <i18n-t keypath="shareRequest.item.textReceived" tag="ion-note">
            <template v-slot:authorName>
              <ion-text class="--bold">{{ item.authorEmail }}</ion-text>
            </template>
            <template v-slot:listName>
              <ion-text class="--bold">{{ item.listName }}</ion-text>
            </template>
          </i18n-t>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-button color="danger" fill="clear" @click="handleDeclineRequestClick">
            <ion-text>{{ t('shareRequest.item.decline') }}</ion-text>
            <ion-icon slot="end" :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-col>
        <ion-col>
          <ion-button color="primary" fill="clear" @click="handleAcceptRequestClick">
            <ion-text>{{ t('shareRequest.item.accept') }}</ion-text>
            <ion-icon slot="end" :icon="checkmarkOutline"></ion-icon>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-item>
</template>

<script>
import ShareRequest from "../models/dtos/ShareRequest";
import {IonButton, IonCol, IonGrid, IonIcon, IonItem, IonRow, IonText, modalController} from "@ionic/vue";
import {trashOutline, checkmarkOutline } from 'ionicons/icons';
import {useI18n} from "vue-i18n";
import {toRefs} from "vue";
import useCloudFunctions from "@/composable/use-cloud-functions";
import useToast from "@/composable/use-toast";
import useShareRequests from "@/composable/use-share-requests";

export default {
  name: "ShareRequestListItemReceived",
  components: { IonItem, IonText, IonGrid, IonCol, IonRow, IonIcon, IonButton},
  props: {
    item: {
      type: Object,
      require: true,
      validator(value) {
        return value instanceof ShareRequest
      }
    }
  },
  setup(props) {
    const { t } = useI18n();
    const { item } = toRefs(props);

    const { successToast, dangerToast } = useToast();
    const { callFunction } = useCloudFunctions();
    const { deleteRequest } = useShareRequests();

    const handleDeclineRequestClick = async () => {
      try {
        await deleteRequest(item.value);
        await successToast(t('shareRequest.successfullyDeletedRequest'))
        await modalController.dismiss();
      } catch(e) {
        await dangerToast(e.message);
      }
    }

    const handleAcceptRequestClick = async () => {
      try {
        await callFunction('acceptShareRequest', { request: item.value.id});
        await successToast(t('shareRequest.successfullyAcceptedRequest'))
        await modalController.dismiss();
      } catch(e) {
        await dangerToast(e.message);
      }
    }

    return {
      t,
      trashOutline,
      checkmarkOutline,
      handleAcceptRequestClick,
      handleDeclineRequestClick
    }
  }
}
</script>
