<template>
  <ShareRequestItem :accept-visible="false" decline-text="shareRequest.item.revoke"
                    @decline-click="handleRevokeRequestClick">
    <i18n-t :keypath="translationKey" tag="ion-note">
      <template #targetName>
        <ion-text class="--bold">{{ item.targetEmail }}</ion-text>
      </template>
      <template #startDate>
        <ion-text class="--bold">{{ formattedStartDate }}</ion-text>
      </template>
      <template #endDate>
        <ion-text class="--bold">{{ formattedEndDate }}</ion-text>
      </template>
    </i18n-t>
  </ShareRequestItem>
</template>

<script>
import {IonText} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import {computed, toRefs} from "vue";
import useToast from "../composable/use-toast";
import useShareRequests from "../composable/use-share-requests";
import {trashOutline} from "ionicons/icons";
import ShareRequestItem from "@/components/ShareRequestItem.vue";
import ShareWeeksRequest from "@/models/dtos/ShareWeeksRequest";
import useShareWeekItems from "@/composable/use-share-week-item";

export default {
  name: "ShareRequestWeekItemSent",
  emits: ["share-list-change"],
  components: {ShareRequestItem, IonText},
  props: {
    item: {
      type: Object,
      require: true,
      validator(value) {
        return value instanceof ShareWeeksRequest
      }
    }
  },
  setup(props, {emit}) {
    const {t} = useI18n();
    const {item} = toRefs(props);

    const {successToast, dangerToast} = useToast();
    const {deleteRequest} = useShareRequests();
    const {formatWeekDate} = useShareWeekItems(item);

    const translationKey = computed(() => {
      return `shareRequest.item.week.${item.value.getType()}.textSent`
    })

    const formattedStartDate = computed(() => formatWeekDate('startDate'));

    const formattedEndDate = computed(() => formatWeekDate('endDate'))

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
      translationKey,
      formattedEndDate,
      formattedStartDate,
      handleRevokeRequestClick
    }
  }
}
</script>
