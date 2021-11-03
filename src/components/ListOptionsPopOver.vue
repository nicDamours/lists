<template>
  <ion-content>
    <ion-list>
      <ion-item button @click="handleShare">
        <ion-text>{{ t('global.share')}}</ion-text>
        <ion-icon :icon="shareOutline" slot="start"></ion-icon>
      </ion-item>
      <ListOptionsEmpty :list="list" />
      <ion-item button @click="handleDeleteList">
        <ion-text color="danger">{{ t('global.delete') }}</ion-text>
        <ion-icon :icon="trashOutline" slot="start" color="danger"></ion-icon>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import {closeCircleOutline, settingsOutline, shareOutline, trashOutline} from 'ionicons/icons';
import {IonContent, IonIcon, IonItem, IonList, IonText, modalController, popoverController} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import {toRefs} from "vue";
import useConfirm from "@/composable/use-confirm";
import useListService from "@/composable/use-list-service";
import {useRouter} from "vue-router";
import ShareWithUserModal from "@/components/modal/ShareWithUserModal/ShareWithUserModal";
import useCloudFunctions from "@/composable/use-cloud-functions";
import useToast from "@/composable/use-toast";
import ListOptionsEmpty from "@/components/ListOptionsEmpty";

export default {
  name: "ListOptionsPopOver",
  components: {IonIcon, IonContent, IonList, IonItem, IonText, ListOptionsEmpty},
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {list} = toRefs(props);
    const {t} = useI18n();
    const {showConfirm} = useConfirm();
    const router = useRouter();
    const {deleteList} = useListService();
    const{ callFunction } = useCloudFunctions();
    const { dangerToast, successToast } = useToast();

    const handleDeleteList = async () => {
      const results = await showConfirm(t("lists.confirmDeleteList"));

      if (results) {

        await deleteList(list.value);

        await router.push({name: "Home"})

        await popoverController.dismiss();
      }
    }

    const handleShare = async () => {
      const modal = await modalController
          .create({
            component: ShareWithUserModal,
            componentProps: {
              listId: list.value.id
            }
          })
      await modal.present();

      const value = await modal.onDidDismiss()

      if(value.data) {
        try {
          await callFunction('shareWithEmail', {
            list: list.value.id,
            email: value.data
          });

          await successToast(t('shareWithUserModal.successfullySentShareRequest'))
        } catch(e) {
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
      trashOutline,
      shareOutline,
      settingsOutline,
      closeCircleOutline,
      handleDeleteList
    }
  }
}
</script>

<style scoped>

</style>
