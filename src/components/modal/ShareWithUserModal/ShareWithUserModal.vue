<template>
  <BaseModal :title="t('shareWithUserModal.title')">
    <template #default>
      <div class="o-share-with-user-model__content">
        <slot :email-input="emailInput" :update-email-input="handleEmailInputUpdate"></slot>
      </div>
    </template>
    <template #buttons>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="danger" slot="start" @click="() => dismiss(null)">
            {{ t('global.cancel') }}
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button slot="end" color="primary" @click="handleSubmitClick">
            {{ t('global.submit') }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from "../BaseModal";
import {useI18n} from "vue-i18n";
import {IonButton, IonButtons, IonToolbar, modalController} from "@ionic/vue";
import {ref} from "vue";

export default {
  name: "ShareWithUserModal",
  emits: ["submit-click"],
  components: {BaseModal, IonButton, IonToolbar, IonButtons},
  setup(_, {emit}) {
    const {t} = useI18n();
    const emailInput = ref("");

    const handleEmailInputUpdate = value => {
      emailInput.value = value
    }

    const dismiss = (value) => {
      modalController.dismiss(value);
    }

    const handleSubmitClick = () => {
      emit("submit-click", emailInput.value)
    }

    return {
      t,
      dismiss,
      emailInput,
      handleSubmitClick,
      handleEmailInputUpdate
    }
  }
}
</script>
