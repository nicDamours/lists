<template>
  <div class="m-floating-badge">
    <slot></slot>
    <ion-badge class="m-floating-badge__badge">{{ value }}</ion-badge>
  </div>
</template>

<script>
import {IonBadge} from "@ionic/vue";

export default {
  name: "FloatingBadge",
  components: { IonBadge },
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  }
}
</script>

<style scoped>

</style>
