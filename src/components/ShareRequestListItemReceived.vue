<template>
  <ShareRequestItem @accept-click="handleAcceptRequestClick" @decline-click="handleDeclineRequestClick">
    <i18n-t keypath="shareRequest.item.list.textReceived" tag="ion-note">
      <template v-slot:authorName>
        <ion-text class="--bold">{{ item.authorEmail }}</ion-text>
      </template>
      <template v-slot:listName>
        <ion-text class="--bold">{{ item.listName }}</ion-text>
      </template>
    </i18n-t>
  </ShareRequestItem>
</template>

<script>
import ShareListRequest from "../models/dtos/ShareListRequest";
import {IonText} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import {toRefs} from "vue";
import useCloudFunctions from "@/composable/use-cloud-functions";
import useToast from "@/composable/use-toast";
import useShareRequests from "@/composable/use-share-requests";
import ShareRequestItem from "@/components/ShareRequestItem.vue";

export default {
  name: "ShareRequestListItemReceived",
  emits: ["share-list-change"],
  components: {ShareRequestItem, IonText},
  props: {
    item: {
      type: Object,
      require: true,
      validator(value) {
        return value instanceof ShareListRequest
      }
    }
  },
  setup(props, {emit}) {
    const {t} = useI18n();
    const {item} = toRefs(props);

    const {successToast, dangerToast} = useToast();
    const {callFunction} = useCloudFunctions();
    const {deleteRequest} = useShareRequests();

    const handleDeclineRequestClick = async () => {
      try {
        await deleteRequest(item.value);
        await successToast(t('shareRequest.successfullyDeletedRequest'))
        emit('share-list-change');
      } catch (e) {
        await dangerToast(e.message);
      }
    }

    const handleAcceptRequestClick = async () => {
      try {
        await callFunction('acceptShareRequest', {requestId: item.value.id, type: 'list'});
        await successToast(t('shareRequest.successfullyAcceptedRequest'))
        emit('share-list-change');
      } catch (e) {
        await dangerToast(e.message);
      }
    }

    return {
      t,
      handleAcceptRequestClick,
      handleDeclineRequestClick
    }
  }
}
</script>
