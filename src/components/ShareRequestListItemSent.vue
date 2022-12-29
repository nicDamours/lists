<template>
  <ShareRequestItem :accept-visible="false" decline-text="shareRequest.item.revoke"
                    @decline-click="handleRevokeRequestClick">
    <i18n-t keypath="shareRequest.item.list.textSent" tag="ion-note">
      <template v-slot:targetName>
        <ion-text class="--bold">{{ item.targetEmail }}</ion-text>
      </template>
      <template v-slot:listName>
        <ion-text class="--bold">{{ item.listName }}</ion-text>
      </template>
    </i18n-t>
  </ShareRequestItem>
</template>

<script>
import {IonText} from "@ionic/vue";
import ShareListRequest from "../models/dtos/ShareListRequest";
import {useI18n} from "vue-i18n";
import {toRefs} from "vue";
import useToast from "../composable/use-toast";
import useShareRequests from "../composable/use-share-requests";
import {trashOutline} from "ionicons/icons";
import ShareRequestItem from "@/components/ShareRequestItem.vue";

export default {
  name: "ShareRequestListItemSent",
  components: {ShareRequestItem, IonText},
  emits: ["share-list-change"],
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
    const {deleteRequest} = useShareRequests();

    const handleRevokeRequestClick = async () => {
      try {
        await deleteRequest(item.value);
        await successToast(t('shareRequest.successfullyRevokedRequest'))
        emit('share-list-change');
      } catch (e) {
        await dangerToast(e.message);
      }
    }

    return {
      t,
      trashOutline,
      handleRevokeRequestClick
    }
  }
}
</script>
