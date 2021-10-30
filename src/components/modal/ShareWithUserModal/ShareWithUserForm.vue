<template>
  <div class="o-form">
    <ion-title size="h2">{{ t('shareWithUserModal.formTitle') }}</ion-title>
    <div class="o-form__group ion-padding">
      <ion-text>{{ t('shareWithUserModal.form.headerText') }}</ion-text>
    </div>
    <div class="o-form__group ion-padding">
      <container-with-errors :errors="errors">
        <ion-item>
          <ion-label position="floating">{{ t('shareWithUserModal.form.email')}}</ion-label>
          <ion-input type="text" @ionChange="handleInputChange" v-model="model" debounce="500"/>
          <ion-icon slot="end" :icon="iconForStatus" :color="colorForStatus" v-if="status !== null && !pending" />
          <ion-spinner v-if="pending" name="dots" slot="end"/>
        </ion-item>
      </container-with-errors>
    </div>
  </div>
</template>

<script>
import ContainerWithErrors from "../../ContainerWithErrors";
import {IonIcon, IonInput, IonItem, IonLabel, IonSpinner, IonText} from "@ionic/vue";
import useUsers from "../../../composable/use-users";
import useCurrentUser from "../../../composable/use-current-user";
import useValidation from "../../../composable/use-validation";
import {computed, ref, toRefs} from "vue";
import {alertCircleOutline, checkmarkOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";

export default {
  name: "ShareWithUserForm",
  components: { ContainerWithErrors, IonText, IonIcon, IonItem, IonLabel, IonInput, IonSpinner },
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      required: false
    }
  },
  setup(props, { emit }){
    const { t } = useI18n();
    const { modelValue } = toRefs(props);
    const { doesUserExists } = useUsers();
    const { getCurrentUser } = useCurrentUser();
    const { validateEmail } = useValidation();

    const errors = ref([]);
    const status = ref(null);
    const pending = ref(false);

    const model = computed({
      get() {
        return modelValue.value;
      },
      set(value) {
        emit("update:modelValue", value);
      }
    })

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
      if(modelValue.value !== '') {
        if(validateEmail(modelValue.value)) {
          if(!isCurrentUserEmail(modelValue.value)) {
            pending.value = true;
            const existingUserPredicate = await doesUserExists(modelValue.value);

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

    return {
      t,
      model,
      status,
      errors,
      pending,
      iconForStatus,
      colorForStatus,
      handleInputChange
    }
  }
}
</script>

<style scoped>

</style>
