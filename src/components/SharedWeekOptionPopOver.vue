<template>
  <ion-content>
    <ion-list>
      <ion-item button @click="handleCancelShare">
        <ion-text color="danger">{{ t('global.cancelSharing') }}</ion-text>
        <ion-icon slot="start" :icon="trashOutline" color="danger"></ion-icon>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import {useI18n} from "vue-i18n";
import useCloudFunctions from "@/composable/use-cloud-functions";
import useToast from "@/composable/use-toast";
import {IonContent, IonIcon, IonItem, IonList, IonText, popoverController} from "@ionic/vue";
import {closeCircleOutline, settingsOutline, shareOutline, trashOutline} from "ionicons/icons";
import useConfirm from "@/composable/use-confirm";
import {WeekSharing} from "@/models/dtos/WeekSharing";
import {toRefs} from "vue";

export default {
  name: "SharedWeekOptionPopOver",
  components: {IonText, IonIcon, IonList, IonContent, IonItem},
  props: {
    sharing: {
      type: Object,
      required: true,
      validator(value) {
        return value instanceof WeekSharing
      }
    }
  },
  setup(props) {
    const {sharing} = toRefs(props);
    const {t} = useI18n();
    const {callFunction} = useCloudFunctions();
    const {dangerToast, successToast} = useToast();

    const {showConfirm} = useConfirm();


    const handleCancelShare = async () => {
      try {
        const results = await showConfirm(t('weeks.confirmCancelShare'));

        if (results) {
          await callFunction("unshareWithEmail", {id: sharing.value.id, shareAllWeeks: true})

          await popoverController.dismiss({changeWeekSharing: true});

          await successToast(t('weeks.successfullyCanceledShare'));
        }
      } catch (e) {
        await dangerToast(e.message);
      }
    }

    return {
      t,
      trashOutline,
      shareOutline,
      settingsOutline,
      handleCancelShare,
      closeCircleOutline,
    }
  }
}
</script>
