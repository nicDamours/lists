<template>
  <ion-progress-bar v-if="loading" :value="progressValue" class="m-progress-bar"/>
</template>

<script>
import useLoading from "../composable/use-loading";
import {useIntervalFn} from "@vueuse/core";
import {ref, watch} from "vue";
import {IonProgressBar} from "@ionic/vue";

export default {
  name: "LoadingBar",
  components: { IonProgressBar },
  setup() {
    const {loading} = useLoading();

    const progressValue = ref(0);

    function clamp(n, min, max) {
      if (n < min) return min;
      if (n > max) return max;
      return n;
    }

    const increment = () => {
      const amount = (1 - progressValue.value) * clamp(Math.random() * progressValue.value, 0.1, 0.95);

      progressValue.value = clamp(progressValue.value + amount, 0, 0.994);
    }

    const { pause, resume } = useIntervalFn(() => {
      increment()
    }, 1000, { immediate: false });

    watch(loading, (newValue, oldValue) => {
      if(oldValue !== newValue) {
        if(newValue) {
          progressValue.value = 0;
          resume()
        } else {
          pause();
          progressValue.value = 100;
        }
      }
    })

    return {
      loading,
      progressValue
    }
  }
}
</script>
