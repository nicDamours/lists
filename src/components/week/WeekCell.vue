<template>
  <div class="week-cell ion-padding">
    <ion-textarea v-model="contentModel" :placeholder="placeholder" class="week-cell__input" debounce="500"
                  @keydown="shouldDisablePlaceholder" @ion-focus="handleFocus" @keydown.tab="setPlaceholderAsValue"/>
  </div>
</template>

<script>
import {IonTextarea} from "@ionic/vue";
import {computed, ref, toRefs} from "vue";

export default {
  name: "WeekCell",
  components: {IonTextarea},
  emits: ["change", "focus"],
  props: {
    content: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    placeholder: {
      type: String,
      required: false,
      default() {
        return ""
      }
    }
  },
  setup(props, {emit}) {
    const {content, placeholder} = toRefs(props);

    const textArea = ref(null);

    const isPlaceholderDisabled = ref(false);

    const contentModel = computed({
      get() {
        return content.value;
      },
      set(value) {
        console.log('CHANGE', value)
        emit('change', value);
      }
    });

    const setPlaceholderAsValue = () => {
      if (contentModel.value || !placeholder.value) {
        return
      }

      if (isPlaceholderDisabled.value) {
        return
      }

      console.log('setPlaceholderAsValue');

      contentModel.value = placeholder.value
    }

    const shouldDisablePlaceholder = (event) => {
      if (event.key !== 'tab') {
        isPlaceholderDisabled.value = true;
      }
    }

    const handleFocus = () => {
      isPlaceholderDisabled.value = false
      emit('focus')
    }

    return {
      contentModel,
      handleFocus,
      isPlaceholderDisabled,
      setPlaceholderAsValue,
      shouldDisablePlaceholder,
    };
  }
}
</script>

<style lang="scss">
.week-cell {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
  &:not(:last-child) {

    border-bottom: solid 1px lightgray;
  }

  &__input {
    .native-input {
      height: 100%;
    }
  }
}
</style>
