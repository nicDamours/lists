<template>
  <BaseModal title="Share with user">
    <template #default>
      <div class="o-share-with-user-model__content">
        <div class="o-form__group">
          <ion-text>{{ t('modal.shareWithUser.headerText') }}</ion-text>
        </div>
        <div class="o-form__group">
          <container-with-errors :errors="errors">
            <ion-item>
              <ion-label position="floating">{{ t('shared.email')}}</ion-label>
              <ion-input type="text" @ionChange="handleInputChange" v-model="emailInput" debounce="500"/>
              <ion-icon slot="end" :icon="iconForStatus" :color="colorForStatus" v-if="status !== null && !pending" />
              <ion-spinner v-if="pending" name="dots" slot="end"/>
            </ion-item>
          </container-with-errors>
        </div>
      </div>
    </template>
    <template #buttons>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="danger" slot="start" @click="() => dismiss(null)">
            {{ t('shared.cancel') }}
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button color="primary" slot="end" @click="() => dismiss(emailInput)">
            {{ t('shared.submit') }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from "./BaseModal";
import {IonIcon, IonInput, IonItem, IonLabel, IonSpinner, IonText, modalController} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import {computed, ref} from "vue";
import ContainerWithErrors from "../ContainerWithErrors";
import useUsers from "../../composable/use-users";
import useValidation from "../../composable/use-validation";
import { checkmarkOutline, alertCircleOutline } from "ionicons/icons"
import useCurrentUser from "@/composable/use-current-user";
export default {
  name: "ShareWithUserModal",
  components: {ContainerWithErrors, BaseModal, IonText, IonIcon, IonItem, IonLabel, IonInput, IonSpinner },
  setup() {
    const { t } = useI18n();
    const { doesUserExists } = useUsers();
    const { getCurrentUser } = useCurrentUser();
    const { validateEmail } = useValidation();
    const emailInput = ref("");

    const errors = ref([]);
    const status = ref(null);
    const pending = ref(false);

    const addError = (error) => {
      if(!errors.value.includes(error)) {
        errors.value.push(error)
        status.value = false;
        pending.value = false;
      }
    }

    const isCurrentUserEmail = (email) => {
      return getCurrentUser().email === email;
    }

    const handleInputChange = async () => {
      errors.value = [];
      if(emailInput.value !== '') {
        if(validateEmail(emailInput.value)) {
          if(!isCurrentUserEmail(emailInput.value)) {
            pending.value = true;
            const existingUserPredicate = await doesUserExists(emailInput.value);

            if(!existingUserPredicate) {
              addError('errors.userDoesntExists');
            } else {
              errors.value = [];
              status.value = true;
            }
          } else {
            addError('errors.cannotShareListWithYourself');
          }
        } else {
          addError('errors.invalidEmail');
        }
      }

      pending.value = false;
    }

    const iconForStatus = computed(() =>
      status.value === true ? checkmarkOutline : alertCircleOutline
    )

    const colorForStatus = computed(() =>
      status.value === true ? 'primary' : 'danger'
    )

    const dismiss = (value) => {
      modalController.dismiss(value);
    }

    return {
      t,
      status,
      errors,
      pending,
      dismiss,
      emailInput,
      iconForStatus,
      colorForStatus,
      handleInputChange
    }
  }
}
</script>
