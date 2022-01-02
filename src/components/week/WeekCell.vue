<template>
  <ion-col class="week-cell">
    <ion-textarea v-model="contentModel" class="week-cell__input" debounce="500"/>
  </ion-col>
</template>

<script>
import {IonCol, IonTextarea} from "@ionic/vue";
import {computed, toRefs} from "vue";

export default {
  name: "WeekCell",
  components: {IonCol, IonTextarea },
  emits: ["change"],
  props: {
    content: {
      type: String,
      required: false,
      default() {
        return "";
      }
    }
  },
  setup(props, {emit}) {
    const {content} = toRefs(props);

    const contentModel = computed({
      get() {
        return content.value;
      },
      set(value) {
        emit('change', value);
      }
    });

    return {
      contentModel
    };
  }
}
</script>

<style lang="scss">
.week-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  &:not(:last-child) {
    border-right: solid 1px lightgray;
  }

  &__input {
    .native-input {
      height: 100%;
    }
  }
}
</style>
