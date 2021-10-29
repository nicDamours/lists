<template>
  <ion-item>
    <ion-grid>
      <ion-row>
        <ion-col>
          <i18n-t keypath="shareRequest.item.textSent" tag="ion-note">
            <template v-slot:targetName>
              <ion-text class="--bold">{{ item.targetEmail }}</ion-text>
            </template>
            <template v-slot:listName>
              <ion-text class="--bold">{{ item.listName }}</ion-text>
            </template>
          </i18n-t>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-button color="danger" fill="clear" @click="handleRevokeRequestClick">
            <ion-text>{{ t('shareRequest.item.revoke') }}</ion-text>
            <ion-icon slot="end" :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-item>
</template>

<script>
import {IonButton, IonCol, IonGrid, IonIcon, IonItem, IonRow, IonText, modalController} from "@ionic/vue";
import ShareRequest from "../models/dtos/ShareRequest";
import {useI18n} from "vue-i18n";
import {toRefs} from "vue";
import useToast from "../composable/use-toast";
import useShareRequests from "../composable/use-share-requests";
import {trashOutline} from "ionicons/icons";

export default {
  name: "ShareRequestListItemSent",
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
    const {t} = useI18n();
    const {item} = toRefs(props);

    const {successToast, dangerToast} = useToast();
    const {deleteRequest} = useShareRequests();

    const handleRevokeRequestClick = async () => {
      try {
        await deleteRequest(item.value);
        await successToast(t('shareRequest.successfullyRevokedRequest'))
        await modalController.dismiss();
      } catch (e) {
        await dangerToast(e.message);
      }
    }

    return {
      t,
      trashOutline,
      handleRevokeRequestClick
    }
  }
}
</script>
