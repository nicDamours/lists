<template>
  <BaseModal :title="t('shareRequest.title')">
    <ion-list>
      <ion-list-header>{{ t('shareRequest.receivedRequest') }}</ion-list-header>
      <ShareRequestModalItem v-for="request in currentTargetRequest" :key="request.id" :item="request" type="received"
                             @share-list-change="handleShareListChange"/>
      <ion-list-header>{{ t('shareRequest.issuedRequest') }}</ion-list-header>
      <ShareRequestModalItem v-for="request in issuedRequest" :key="request.id" :item="request" type="sent"
                             @share-list-change="handleShareListChange"/>
    </ion-list>
  </BaseModal>
</template>

<script>
import useShareRequests from "../../composable/use-share-requests";
import {IonList, IonListHeader, modalController} from "@ionic/vue";
import BaseModal from "@/components/modal/BaseModal";
import {useI18n} from "vue-i18n";
import {computed} from "vue";
import ShareRequestModalItem from "@/components/ShareRequestModalItem.vue";

export default {
  name: "ShareRequestModal",
  components: {BaseModal, IonList, IonListHeader, ShareRequestModalItem},
  setup() {
    const {shareRequests} = useShareRequests();
    const {t} = useI18n();

    const currentTargetRequest = computed(() => shareRequests.value.filter(request => !request.isCurrentUserTheAuthor))
    const issuedRequest = computed(() => shareRequests.value.filter(request => request.isCurrentUserTheAuthor))

    const handleShareListChange = () => {
      if (shareRequests.value.length <= 0) {
        modalController.dismiss()
      }
    }

    return {
      t,
      issuedRequest,
      currentTargetRequest,
      handleShareListChange
    }
  }
}
</script>
