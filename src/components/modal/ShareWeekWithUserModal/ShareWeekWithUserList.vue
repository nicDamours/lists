<template>
  <div class="ion-padding">
    <ion-title size="h2">{{ t('shareWithUserModal.listTitle') }}</ion-title>
    <ion-list>
      <ion-item-sliding v-for="sharing in weekSharingFromCurrentUser" :key="sharing.id">
        <ion-item-options side="start">
          <ion-item-option color="danger" expandable @click="revoke(sharing)" @ion-swipe="revoke(sharing)">
            {{ t('global.remove') }}
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-item-option>
        </ion-item-options>
        <ion-item>{{ sharing.target.email }}</ion-item>
      </ion-item-sliding>
      <EmptyListItem v-if="weekSharingFromCurrentUser.length === 0"/>
    </ion-list>
  </div>
</template>

<script>
import {IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonList, IonTitle} from "@ionic/vue";
import {trashOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import useCloudFunctions from "../../../composable/use-cloud-functions";
import {computed} from "vue";
import useToast from "../../../composable/use-toast";
import EmptyListItem from "@/components/EmptyListItem";
import useWeekSharingUsers from "@/composable/use-week-sharing-users";
import useCurrentUser from "@/composable/use-current-user";

export default {
  name: "ShareWeekWithUserList",
  components: {IonList, IonItem, IonItemOption, IonItemOptions, IonIcon, IonItemSliding, IonTitle, EmptyListItem},
  setup(props) {
    const {t} = useI18n()
    const {callFunction} = useCloudFunctions();
    const {successToast, dangerToast} = useToast();

    const {weekSharingUsers} = useWeekSharingUsers()

    const {currentUser} = useCurrentUser();

    const weekSharingFromCurrentUser = computed(() => {
      return weekSharingUsers.value.filter(sharing => sharing.author.id === currentUser.value.uid)
    })


    const revoke = async (sharing) => {
      try {
        await callFunction("unshareWithEmail", {id: sharing.id, type: 'week', shareAllWeeks: true})
        await successToast(t("shareWithUserModal.revokeSuccessful"))
      } catch (e) {
        await dangerToast(e.message)
      }
    }

    return {
      t,
      revoke,
      trashOutline,
      weekSharingFromCurrentUser
    }
  }
}
</script>
