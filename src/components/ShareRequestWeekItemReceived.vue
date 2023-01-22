<template>
  <ShareRequestItem @accept-click="handleAcceptRequestClick" @decline-click="handleDeclineRequestClick">
    <i18n-t :keypath="translationKey" tag="ion-note">
      <template #authorName>
        <ion-text class="--bold">{{ item.authorEmail }}</ion-text>
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
import useCloudFunctions from "@/composable/use-cloud-functions";
import useToast from "@/composable/use-toast";
import useShareRequests from "@/composable/use-share-requests";
import ShareRequestItem from "@/components/ShareRequestItem.vue";
import ShareWeeksRequest from "@/models/dtos/ShareWeeksRequest";
import useShareWeekItems from "@/composable/use-share-week-item";

export default {
  name: "ShareRequestWeekItemReceived",
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
    const {callFunction} = useCloudFunctions();
    const {deleteRequest} = useShareRequests();
    const {formatWeekDate} = useShareWeekItems(item);


    const translationKey = computed(() => {
      return `shareRequest.item.week.${item.value.getType()}.textReceived`
    })


    const formattedStartDate = computed(() => formatWeekDate('startDate'));

    const formattedEndDate = computed(() => formatWeekDate('endDate'))

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
        await callFunction('acceptShareRequest', {
          requestId: item.value.id,
          type: 'week',
          shareAllWeeks: item.value.getType() === "all"
        });
        await successToast(t('shareRequest.successfullyAcceptedRequest'))
        emit('share-list-change');
      } catch (e) {
        await dangerToast(e.message);
      }
    }

    return {
      t,
      translationKey,
      formattedEndDate,
      formattedStartDate,
      handleAcceptRequestClick,
      handleDeclineRequestClick
    }
  }
}
</script>
