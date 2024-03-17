<template>
  <ion-item ref="paginationTriggerElementRef">
    <slot></slot>
  </ion-item>
</template>

<script>
import {IonItem} from "@ionic/vue";
import {ref} from "vue";
import {useIntersectionObserver} from "@vueuse/core";

export default {
  name: "PaginationTrigger",
  components: {IonItem},
  emits: ["page-change"],
  setup(_, {emit}) {
    const paginationTriggerElementRef = ref(null);

    const {stop} = useIntersectionObserver(
        paginationTriggerElementRef,
        ([{isIntersecting}]) => {
          if (isIntersecting) {
            emit('page-change')
          }
        },
    )

    return {};
  }
};
</script>
