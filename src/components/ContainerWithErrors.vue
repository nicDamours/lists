<template>
  <div class="a-container-with-errors">
    <div class="a-container-with-errors__content">
      <slot></slot>
    </div>
    <div class="a-container-with-errors__errors">
      <ion-text  color="danger" v-for="(error, $index) in errors" :key="$index"><small>{{ t(error) }}</small></ion-text>
    </div>
  </div>
</template>

<script>
import {IonText} from "@ionic/vue";
import {useI18n} from "vue-i18n";

export default {
  name: "ContainerWithErrors",
  components: {
    IonText
  },
  props: {
    errors: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { t } = useI18n();

    return {
      t
    }
  }
}
</script>

<style scoped>

</style>
