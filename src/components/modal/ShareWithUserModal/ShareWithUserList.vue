<template>
  <div class="ion-padding">
    <ion-title size="h2">{{ t('shareWithUserModal.listTitle') }}</ion-title>
    <ion-list>
      <ion-item-sliding v-for="user in list.sharedWiths" :key="user.id">
        <ion-item-options side="start">
          <ion-item-option @click="revoke(user)" color="danger">
            {{ t('global.remove')}}
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-item-option>
        </ion-item-options>
        <ion-item >{{ user.email }}</ion-item>
      </ion-item-sliding>
      <EmptyListItem v-if="list.sharedWiths.length === 0" />
    </ion-list>
  </div>
</template>

<script>
import {IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonList, IonTitle} from "@ionic/vue";
import {trashOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import useCloudFunctions from "../../../composable/use-cloud-functions";
import {toRefs} from "vue";
import useToast from "../../../composable/use-toast";
import EmptyListItem from "@/components/EmptyListItem";

export default {
  name: "ShareWithUserList",
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  components: { IonList, IonItem, IonItemOption, IonItemOptions, IonIcon, IonItemSliding, IonTitle, EmptyListItem },
  setup(props) {
    const { t } = useI18n()
    const { list } = toRefs(props);
    const { callFunction } = useCloudFunctions();
    const { successToast, dangerToast } = useToast();

    const revoke = async (user) => {
      try {
        await callFunction("unshareListWithEmail", {list: list.value.id, email: user.email})
        await successToast(t("shareWithUserModal.revokeSuccessful"))
      } catch(e) {
        await dangerToast(e.message)
      }
    }

    return {
      t,
      revoke,
      trashOutline
    }
  }
}
</script>
