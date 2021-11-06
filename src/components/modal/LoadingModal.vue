<template>
  <ion-content class="ion-padding o-loading-modal__content">
    <ion-grid>
      <ion-row>
        <ion-col class="ion-align-items-center --flex --flex-center">
          <ion-spinner></ion-spinner>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col class="ion-align-items-center --flex --flex-center">
          <ion-text class="ion-text-center">{{ 'please wait' }}</ion-text>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col class="ion-align-items-center --flex">
          <ion-progress-bar v-if="hasProgress" :type="loadingProgress  === null ? 'indeterminate' : 'determinate'" :value="loadingProgress "/>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script>
import {IonCol, IonContent, IonGrid, IonProgressBar, IonRow, IonSpinner, IonText} from "@ionic/vue";
import useLoading from "@/composable/use-loading";

export default {
  name: "LoadingModal",
  components: { IonContent, IonSpinner, IonText, IonProgressBar, IonGrid, IonCol, IonRow },
  props: {
    hasProgress: {
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    }
  },
  setup() {
    const { loadingProgress } = useLoading();

    return {
      loadingProgress
    }
  }
}
</script>

<style scoped>

</style>
