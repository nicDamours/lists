<template>
  <div class="ion-padding o-camera-snapshot" v-show="!cameraStarting">
    <div class="o-camera-snapshot__language-selector">
      <ion-item>
        <ion-label>
          Langue de la recette
        </ion-label>
        <ion-select v-model="selectedLanguage">
          <ion-select-option value="fra">Français</ion-select-option>
          <ion-select-option value="eng">Anglais</ion-select-option>
        </ion-select>
      </ion-item>
    </div>
    <canvas ref="canvaElementRef" class="o-camera-snapshot__canvas" :width="canvaWidth" :height="canvaHeight"></canvas>
    <video ref="videoElementRef" autoplay class="o-camera-snapshot__stream"></video>
    <div class="o-camera-snapshot__zoom">
      <ion-item>
        <ion-range slot="" v-model="zoomValue" @ion-change="updateRangeZoomValue" min="1" max="6"
                   step="0.1" v-if="zoomSupported">
          <ion-icon slot="start" :icon="searchOutline">Zoom</ion-icon>
          <ion-text slot="end">{{ zoomValue.toFixed(1) }}</ion-text>
        </ion-range>
      </ion-item>
    </div>
    <div class="o-camera-snapshot__buttons ion-padding-top">
      <InputFile @file-selection="handleFileChosen" class="o-camera-snapshot__button --upload"/>
      <ion-button fill="outline" @click="triggerPicture" class="o-camera-snapshot__button --shutter">
        <ion-icon :icon="cameraOutline" slot="icon-only"/>
      </ion-button>
      <ion-button fill="clear" @click="switchFacingMode" class="o-camera-snapshot__button --switch"
                  color="tertiary">
        <ion-icon :icon="cameraReverseOutline" slot="icon-only"/>
      </ion-button>
    </div>
  </div>
  <ion-title v-show="cameraStarting">
    Starting camera, please wait.
  </ion-title>
</template>

<script>
import {cameraOutline, cameraReverseOutline, cloudUploadOutline, searchOutline} from "ionicons/icons"
import {
  IonButton,
  IonIcon,
  IonItem, IonLabel,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  modalController
} from "@ionic/vue";
import {computed, onMounted, ref, watch} from "vue";
import useToast from "@/composable/use-toast";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import CropModal from "@/components/modal/CropModal";
import useTesseract from "@/composable/use-tesseract";
import InputFile from "@/components/InputFile";
import useLoading from "@/composable/use-loading";

export default {
  name: "CameraSnapshot",
  components: {
    IonButton,
    IonIcon,
    IonTitle,
    IonRange,
    IonItem,
    IonText,
    InputFile,
    IonLabel,
    IonSelect,
    IonSelectOption
  },
  emits: ["snapshot-taken"],
  setup(props, {emit}) {
    const {t} = useI18n();
    const router = useRouter();
    const cameraStarting = ref(true);
    const videoElementRef = ref(null);
    const canvaElementRef = ref(null);
    const {imageToText, workerProgress} = useTesseract();
    const { presentLoadingDialog, dismissLoadingDialog } = useLoading();
    const {dangerToast} = useToast();
    const currentFacingMode = ref("");
    const zoomValue = ref(1);
    const selectedLanguage = ref('fra');

    const stopCurrentVideoTrack = () => {
      if (videoElementRef.value && videoElementRef.value.srcObject) {
        videoElementRef.value.srcObject.getVideoTracks().forEach(track => track.stop());
      }
    }

    const updateVideoContraints = async (facingMode) => {
      try {
        stopCurrentVideoTrack();

        currentFacingMode.value = facingMode;

        videoElementRef.value.srcObject = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            focusMode: "continuous"
          },
          audio: false
        });

      } catch (error) {
        await dangerToast(error)
        console.error(error);
      }
    }

    onMounted(async () => {
      try {
        const mediaDevices = navigator.mediaDevices;
        if (mediaDevices) {
          await updateVideoContraints("user");
          cameraStarting.value = false;
        } else {
          await dangerToast(t('error.noMediaDevicesSupported'))
          await router.push({path: "/lists"})
        }
      } catch (error) {
        await dangerToast(error)
        await router.push({path: "/lists"})
      }
    });


    const canvaWidth = computed(() => videoElementRef.value ? videoElementRef.value.getBoundingClientRect().width : 0);
    const canvaHeight = computed(() => videoElementRef.value ? videoElementRef.value.getBoundingClientRect().height : 0);

    const handleImageToTextConversion = async (data) => {
      await presentLoadingDialog(workerProgress);

      const items = await imageToText(selectedLanguage.value, data);

      emit('snapshot-taken', items);
      await dismissLoadingDialog();
    }

    const presentCropModal = async (image) => {
      const modal = await modalController.create({
        component: CropModal,
        componentProps: {
          imageData: image
        }
      });


      await modal.present();

      const data = await modal.onDidDismiss();

      const value = 'data' in data ? data.data : data;

      if (value) {
        await handleImageToTextConversion(value)
      }
    }

    const triggerPicture = async () => {
      canvaElementRef.value.getContext('2d').drawImage(videoElementRef.value, 0, 0, canvaElementRef.value.width, canvaElementRef.value.height);
      const imageData = canvaElementRef.value.toDataURL('image/jpeg')

      await presentCropModal(imageData)
    }

    const switchFacingMode = async () => {
      const newFacingMode = currentFacingMode.value === 'user' ? 'environment' : 'user';

      await updateVideoContraints(newFacingMode)
    }

    const zoomSupported = computed(() => {
      if (videoElementRef.value && videoElementRef.value.srcObject) {
        return 'zoom' in videoElementRef.value.srcObject.getVideoTracks()[0].getCapabilities();
      } else {
        return true;
      }
    });
    const trackCapabilities = computed(() => videoElementRef.value && videoElementRef.value.srcObject ? videoElementRef.value.srcObject.getVideoTracks()[0].getCapabilities().zoom : {})

    const zoomMinValue = computed(() => zoomSupported.value && trackCapabilities.value.min);
    const zoomMaxValue = computed(() => zoomSupported.value && trackCapabilities.value.max);
    const zoomStepValue = computed(() => zoomSupported.value && trackCapabilities.value.step);

    const updateRangeZoomValue = async () => {
      if (zoomSupported.value) {
        await videoElementRef.value.srcObject.getVideoTracks()[0].applyConstraints({advanced: [{zoom: zoomValue.value}]});
      }

    }

    const handleFileChosen = async (file) => {
      const reader = new FileReader();

      reader.addEventListener("load", async () => {
        // convert image file to base64 string
        await presentCropModal(reader.result);
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    }

    return {
      zoomValue,
      zoomMinValue,
      zoomMaxValue,
      zoomStepValue,
      cameraStarting,
      searchOutline,
      selectedLanguage,
      cameraReverseOutline,
      cloudUploadOutline,
      updateRangeZoomValue,
      handleFileChosen,
      cameraOutline,
      switchFacingMode,
      triggerPicture,
      zoomSupported,
      canvaWidth,
      canvaHeight,
      canvaElementRef,
      videoElementRef,
      presentLoadingDialog
    }
  }
}
</script>

<style scoped>

</style>
