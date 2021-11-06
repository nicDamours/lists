<template>
  <BaseModal title="Crop">
    <template #default>
      <div class="o-crop-modal">
        <cropper class="o-crop-modal__cropper" ref="cropperRef" :src="imageData"
                 :stencil-props="{
		handlers: {},
		movable: false,
		scalable: false,
	}"
                 :resize-image="{
		adjustStencil: false
	}"
                 image-restriction="stencil"/>
      </div>
    </template>
    <template #buttons>
      <ion-buttons>
        <ion-button color="primary" fill="clear" @click="saveImage" slot="primary">
          {{ t('global.submit') }}
          <ion-icon slot="start" :icon="checkmarkOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from "./BaseModal";
import {ref} from "vue";
import {IonButton, IonButtons, IonIcon, modalController} from "@ionic/vue";

import {checkmarkOutline, trashOutline} from 'ionicons/icons';
import {useI18n} from "vue-i18n";
import {Cropper} from "vue-advanced-cropper";

export default {
  name: "CropModal",
  components: {BaseModal, IonButton, IonButtons, IonIcon, Cropper},
  props: {
    imageData: {
      type: String,
      required: true
    }
  },
  setup() {
    const {t} = useI18n();
    const canvaRef = ref(null);
    const cropperRef = ref(null);

    const saveImage = () => {
      const { canvas } = cropperRef.value.getResult();
      const imageData = canvas.toDataURL('image/jpeg');
      console.log('imageData', imageData);
      modalController.dismiss(imageData)
    }

    return {
      t,
      canvaRef,
      cropperRef,
      saveImage,
      trashOutline,
      checkmarkOutline
    }
  }
}
</script>

<style scoped>

</style>
