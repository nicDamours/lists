<template>
  <ion-content>
    <ion-list>
      <ListOptionsEmpty :list="list" />
      <ion-item button @click="handleCancelShare">
        <ion-text color="danger">{{ t('global.cancelSharing')}}</ion-text>
        <ion-icon :icon="trashOutline" slot="start" color="danger"></ion-icon>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import {IonContent, IonIcon, IonItem, IonList, IonText, popoverController} from "@ionic/vue";
import { trashOutline } from "ionicons/icons"
import {useI18n} from "vue-i18n";
import ListOptionsEmpty from "@/components/ListOptionsEmpty";
import useCloudFunctions from "@/composable/use-cloud-functions";
import {List} from "@/models/dtos/List";
import useConfirm from "@/composable/use-confirm";
import {toRefs} from "vue";
import useToast from "@/composable/use-toast";
import {useRouter} from "vue-router";

export default {
  name: "SharedListOptionsPopOver",
  components: { IonContent, IonList, IonItem, IonText, IonIcon, ListOptionsEmpty },
  props: {
    list: {
      type: Object,
      required: true,
      validator(value) {
        return value instanceof List
      }
    }
  },
  setup(props) {
    const { list } = toRefs(props);

    const { t } = useI18n();

    const router = useRouter();

    const { callFunction } = useCloudFunctions();

    const { showConfirm } = useConfirm();

    const { successToast, dangerToast } = useToast();

    const handleCancelShare = async () => {
      try {
        const results = await showConfirm(t('lists.confirmCancelShare'));

        if(results) {
          await callFunction("removeCurrentUserFromShare", { list: list.value.id })

          await popoverController.dismiss();

          await router.push({ name: "Home"})

          await successToast(t('lists.successfullyCanceledShare'));
        }
      }catch(e) {
        await dangerToast(e.message);
      }
    }

    return {
      t,
      trashOutline,
      handleCancelShare
    }
  }
}
</script>

<style scoped>

</style>
