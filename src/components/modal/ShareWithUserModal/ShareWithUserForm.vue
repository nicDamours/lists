<template>
  <form class="o-form ion-padding">
    <ion-title size="h2">{{ t('shareWithUserModal.formTitle') }}</ion-title>
    <div class="o-form__group ion-padding">
      <ion-text>{{ t('shareWithUserModal.form.headerText') }}</ion-text>
    </div>
    <div class="o-form__group ion-padding">
      <container-with-errors :errors="errorsModel">
        <ion-item>
          <ion-label position="floating">{{ t('shareWithUserModal.form.email') }}</ion-label>
          <ion-input v-model="model" debounce="500" required type="text" @ionChange="handleInputChange"/>
          <ion-icon v-if="!pending" slot="end" :color="colorForStatus" :icon="iconForStatus"/>
          <ion-spinner v-if="pending" name="dots" slot="end"/>
        </ion-item>
      </container-with-errors>
    </div>
  </form>
</template>

<script>
import ContainerWithErrors from "../../ContainerWithErrors";
import {IonIcon, IonInput, IonItem, IonLabel, IonSpinner, IonText, IonTitle} from "@ionic/vue";
import useUsers from "../../../composable/use-users";
import useCurrentUser from "../../../composable/use-current-user";
import useValidation from "../../../composable/use-validation";
import {computed, ref, toRefs} from "vue";
import {alertCircleOutline, checkmarkOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";

export default {
  name: "ShareWithUserForm",
  components: {ContainerWithErrors, IonText, IonIcon, IonItem, IonLabel, IonInput, IonSpinner, IonTitle},
  emits: ["update:modelValue", "update:errors"],
  props: {
    modelValue: {
      type: String,
      required: false
    },
    errors: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  setup(props, {emit}) {
    const {t} = useI18n();
    const {modelValue, errors} = toRefs(props);
    const {doesUserExists} = useUsers();
    const {getCurrentUser} = useCurrentUser();
    const {validateEmail} = useValidation();

    const errorsModel = computed({
      get() {
        return errors.value
      },
      set(value) {
        emit("update:errors", value);
      }
    })

    const pending = ref(false);


    const status = computed(() => {
      return errorsModel.value.length === 0;
    })

    const model = computed({
      get() {
        return modelValue.value;
      },
      set(value) {
        emit("update:modelValue", value);
      }
    })

    const addError = (error) => {
      if (!errorsModel.value.includes(error)) {
        errorsModel.value.push(error)
        pending.value = false;
      }
    }

    const isCurrentUserEmail = (email) => {
      return getCurrentUser().email === email;
    }

    const handleInputChange = async () => {
      errorsModel.value = [];
      if(modelValue.value !== '') {
        if(validateEmail(modelValue.value)) {
          if(!isCurrentUserEmail(modelValue.value)) {
            pending.value = true;
            const existingUserPredicate = await doesUserExists(modelValue.value);

            if(!existingUserPredicate) {
              addError('errors.userDoesntExists');
            } else {
              errorsModel.value = [];
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
      pending,
      errorsModel,
      iconForStatus,
      colorForStatus,
      handleInputChange
    }
  }
}
</script>
