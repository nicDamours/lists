<template>
  <ion-content>
    <ion-list>
      <ion-item button @click="handleShare">
        <ion-text>{{ t('global.share') }}</ion-text>
        <ion-icon slot="start" :icon="shareOutline"></ion-icon>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import {toRefs} from "vue";
import {useI18n} from "vue-i18n";
import useCloudFunctions from "@/composable/use-cloud-functions";
import useToast from "@/composable/use-toast";
import {IonContent, IonIcon, IonItem, IonList, IonText, modalController, popoverController} from "@ionic/vue";
import {closeCircleOutline, settingsOutline, shareOutline} from "ionicons/icons";
import ShareWeekWithUserModal from "@/components/modal/ShareWeekWithUserModal/ShareWeekWithUserModal.vue";

export default {
  name: "WeekOptionPopOver",
  components: {IonText, IonIcon, IonList, IonContent, IonItem},
  props: {
    dates: {
      type: Object,
      required: true,
      validator(value) {
        return ['startDate', 'endDate'].every(prop => prop in value && value[prop] instanceof Date)
      }
    }
  },
  setup(props) {
    const {dates} = toRefs(props);
    const {t} = useI18n();
    const {callFunction} = useCloudFunctions();
    const {dangerToast, successToast} = useToast();

    const handleShare = async () => {
      const modal = await modalController
          .create({
            component: ShareWeekWithUserModal,
            componentProps: {
              dates: dates.value
            }
          })
      await modal.present();

      const value = await modal.onDidDismiss()

      if (value.data) {
        try {
          const payload = {
            email: value.data.email,
            shareAllWeeks: value.data.shareAllWeeks,
            dates: value.data.dates ?? {}
          }

          await callFunction('shareWeekWithEmail', payload);

          await successToast(t('shareWithUserModal.successfullySentShareRequest'))
        } catch (e) {
          await dangerToast(e.message);
        } finally {
          await popoverController.dismiss();
        }
      } else {
        await popoverController.dismiss();
      }
    }

    return {
      t,
      handleShare,
      shareOutline,
      settingsOutline,
      closeCircleOutline,
    }
  }
}
</script>
