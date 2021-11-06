<template>
  <div>
    <ion-input
        class="a-input--file"
        :id="uuid"
        type="file"
        ref="fileElement"
        @ion-change="handleFileSelect"
    />
    <ion-button fill="clear" @click="handleFileClick" v-bind="$attrs">
      <ion-icon :icon="cloudUploadOutline" slot="icon-only" />
    </ion-button>
  </div>

</template>

<script>
import {IonButton, IonIcon, IonInput} from "@ionic/vue";
import {cloudUploadOutline} from "ionicons/icons";
import UUID from "../utils/UUID";
import {ref} from "vue";


export default {
  name: "InputFile",
  emits: ["fileSelection"],
  components: { IonIcon, IonInput, IonButton },
  setup(props, { emit }) {
    const uuid = UUID.uuidv4();
    const fileElement = ref(null);

    const handleFileClick = async () => {
      const nativeElement = await fileElement.value.$el.getInputElement();

      nativeElement.click();
    }

    const handleFileSelect = async () => {
      const inputElement = await fileElement.value.$el.getInputElement();
      const blob = inputElement.files[0];

      emit('fileSelection', blob)

      inputElement.value = "";
    }

    return {
      uuid,
      fileElement,
      handleFileClick,
      handleFileSelect,
      cloudUploadOutline
    }
  }
}
</script>

<style scoped>

</style>
