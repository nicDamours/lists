<template>
  <div class="ion-padding">
    <ion-title size="h2">{{ t('shareWithUserModal.listTitle') }}</ion-title>
    <ion-list>
      <ion-item-sliding v-for="user in allRequests" :key="user.id">
        <ion-item-options side="start">
          <ion-item-option @click="revoke(user)" color="danger">
            {{ t('global.remove')}}
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-item-option>
        </ion-item-options>
        <ion-item>
          {{ user.email }}
          <ion-badge v-if="isPendingRequest(user)" slot="end" color="warning">{{ t('shareWithUserModal.pending') }}
          </ion-badge>
        </ion-item>
      </ion-item-sliding>
      <EmptyListItem v-if="list.sharedWiths.length === 0" />
    </ion-list>
  </div>
</template>

<script>
import {IonBadge, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonList, IonTitle} from "@ionic/vue";
import {trashOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import useCloudFunctions from "../../../composable/use-cloud-functions";
import {computed, toRefs} from "vue";
import useToast from "../../../composable/use-toast";
import EmptyListItem from "@/components/EmptyListItem";
import useShareRequests from "@/composable/use-share-requests";
import {PendingSharedUser} from "@/models/dtos/PendingSharedUser";

export default {
  name: "ShareWithUserList",
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  components: {
    IonList,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonIcon,
    IonItemSliding,
    IonTitle,
    EmptyListItem,
    IonBadge
  },
  setup(props) {
    const { t } = useI18n()
    const { list } = toRefs(props);
    const { callFunction } = useCloudFunctions();
    const { successToast, dangerToast } = useToast();
    const {getShareRequestsForList, deleteRequest} = useShareRequests();

    const allRequests = computed(() => {
      const pendingRequests = getShareRequestsForList(list.value).map(shareRequest => {
        return new PendingSharedUser(shareRequest.targetId, shareRequest.targetEmail, shareRequest);
      })
      return [...pendingRequests, ...list.value.sharedWiths]
    })

    const revoke = async (user) => {
      try {
        if (user instanceof PendingSharedUser) {
          await revokePendingRequest(user);
        } else {
          await revokeNonPendingRequest(user);
        }
        await successToast(t("shareWithUserModal.revokeSuccessful"))
      } catch(e) {
        await dangerToast(e.message)
      }
    }

    const revokeNonPendingRequest = async (user) => {
      await callFunction("unshareWithEmail", {list: list.value.id, email: user.email, type: 'list'})
    }

    const revokePendingRequest = async (user) => {
      await deleteRequest(user.pendingRequest);
    }

    const isPendingRequest = (request) => {
      return request instanceof PendingSharedUser
    }

    return {
      t,
      revoke,
      allRequests,
      trashOutline,
      isPendingRequest
    }
  }
}
</script>
