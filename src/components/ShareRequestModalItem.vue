<template>
  <template v-if="isReceivedType">
    <ShareRequestListItemReceived v-if="isListRequest" :item="item" @share-list-change="$emit('share-list-change')"/>
    <ShareRequestWeekItemReceived v-else :item="item" @share-list-change="$emit('share-list-change')"/>
  </template>
  <template v-else>
    <ShareRequestListItemSent v-if="isListRequest" :item="item" @share-list-change="$emit('share-list-change')"/>
    <ShareRequestWeekItemSent v-else :item="item" @share-list-change="$emit('share-list-change')"/>
  </template>
</template>

<script>
import ShareRequest from "@/models/dtos/ShareRequest";
import {computed, toRefs} from "vue";
import ShareListRequest from "@/models/dtos/ShareListRequest";
import ShareRequestListItemSent from "@/components/ShareRequestListItemSent.vue";
import ShareRequestWeekItemSent from "@/components/ShareRequestWeekItemSent.vue";
import ShareRequestListItemReceived from "@/components/ShareRequestListItemReceived.vue";
import ShareRequestWeekItemReceived from "@/components/ShareRequestWeekItemReceived.vue";

export default {
  name: "ShareRequestModalItem",
  emits: ["share-list-change"],
  components: {
    ShareRequestWeekItemReceived,
    ShareRequestListItemReceived, ShareRequestWeekItemSent, ShareRequestListItemSent
  },
  props: {
    item: {
      type: Object,
      required: true,
      validator(value) {
        return value instanceof ShareRequest
      }
    },
    type: {
      type: String,
      required: true,
      validator(value) {
        return value === "sent" || value === "received"
      }
    }
  },
  setup(props) {
    const {type, item} = toRefs(props);

    const isReceivedType = computed(() => type.value === "received")

    const isListRequest = computed(() => item.value instanceof ShareListRequest)

    return {
      isListRequest,
      isReceivedType
    }
  }
}
</script>
