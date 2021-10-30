<template>
  <BaseModal :title="t('shareRequest.title')">
    <ion-list>
      <ion-list-header>{{ t('shareRequest.receivedRequest') }}</ion-list-header>
      <ShareRequestListItemReceived v-for="request in currentTargetRequest" :key="request.id" :item="request" />
      <ion-list-header>{{ t('shareRequest.issuedRequest') }}</ion-list-header>
      <ShareRequestListItemSent v-for="request in issuedRequest" :key="request.id" :item="request" />
    </ion-list>
  </BaseModal>
</template>

<script>
import useShareRequests from "../../composable/use-share-requests";
import ShareRequestListItemReceived from "../ShareRequestListItemReceived";
import ShareRequestListItemSent from "../ShareRequestListItemSent";
import {IonList, IonListHeader} from "@ionic/vue";
import BaseModal from "@/components/modal/BaseModal";
import {useI18n} from "vue-i18n";
import {computed} from "vue";

export default {
  name: "ShareRequestModal",
  components: {BaseModal, ShareRequestListItemReceived, ShareRequestListItemSent, IonList, IonListHeader },
  setup() {
    const { shareRequests } = useShareRequests();
    const { t } = useI18n();

    const currentTargetRequest = computed(() => shareRequests.value.filter(request => !request.isCurrentUserTheAuthor))
    const issuedRequest = computed(() => shareRequests.value.filter(request => request.isCurrentUserTheAuthor))

    return {
      t,
      issuedRequest,
      currentTargetRequest
    }
  }
}
</script>
