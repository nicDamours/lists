<template>
  <ion-item>
    <form @submit.prevent="handleSubmit" class="o-form">
      <div class="o-form__new-label" v-if="!hasFocus" @click="handleLabelClick">
        <ion-button fill="clear" color="dark">
          <ion-icon :icon="addOutline" slot="start"></ion-icon>
          {{ t(text) }}
        </ion-button>
      </div>
      <div class="o-form__group--new o-form__keep-focus-on-click" v-if="hasFocus" @blur.capture="handleGroupBlur">
        <ion-item class="o-form__group-input">
          <ContainerWithErrors  :errors="inputErrors">
            <ion-label position="floating" :color="hasErrors ? 'danger' : 'primary'" >{{ t(text) }}</ion-label>
            <ion-input type="text" v-model="newItemName" :ref="el => refs[uuid] = el" :color="hasErrors ? 'danger' : 'dark'" class="o-form__input"/>
          </ContainerWithErrors>
        </ion-item>
        <ion-button slot="end" type="submit" color="success" fill="clear" class="o-form__submit-button">
          {{ t("global.add") }}
          <ion-icon :icon="addOutline" slot="end"></ion-icon>
        </ion-button>
      </div>
    </form>
  </ion-item>
</template>

<script>
import {computed, ref} from "vue";
import {IonButton, IonIcon, IonInput, IonItem, IonLabel} from "@ionic/vue";
import {addOutline} from "ionicons/icons";
import UUID from "@/utils/UUID";
import {useI18n} from "vue-i18n";
import useInputFocus from "@/composable/use-input-focus";
import ContainerWithErrors from "@/components/ContainerWithErrors";

export default {
  name: "NewItemForm",
  components: {
    ContainerWithErrors,
    IonItem,
    IonIcon,
    IonLabel,
    IonInput,
    IonButton
  },
  emits: ["form-submit"],
  props: {
    text: {
      type: String,
      required: true
    }
  },
  setup(_, {emit}) {
    const uuid = ref(UUID.uuidv4());
    const refs = ref({});
    const inputErrors = ref([]);
    const { defineInputFocus } = useInputFocus(refs);

    const hasFocus = ref(false);

    const newItemName = ref("");

    const { t } = useI18n();

    const validateInputs = () => {
      inputErrors.value = [];

      if(newItemName.value === "") {
        inputErrors.value.push("errors.fieldCannotBeEmpty");
      }

      return inputErrors.value.length === 0;
    }

    const handleSubmit = async () => {
      if(validateInputs()) {
        emit("form-submit", `${newItemName.value}`)

        newItemName.value = ""
        await defineInputFocus(uuid.value, false);
      } else {
        await defineInputFocus(uuid.value, true);
      }
    }

    const handleLabelClick = async () => {
      hasFocus.value = true;
      await defineInputFocus(uuid.value, true);
    }

    const handleGroupBlur = async (event) => {
      if(!event.relatedTarget || !event.relatedTarget.closest('.o-form__keep-focus-on-click')) {
        hasFocus.value = false;
        await defineInputFocus(uuid.value, false);
      }
    }

    const hasErrors = computed(() => inputErrors.value.length > 0);

    return {
      t,
      refs,
      uuid,
      hasFocus,
      hasErrors,
      addOutline,
      inputErrors,
      newItemName,
      handleSubmit,
      handleGroupBlur,
      handleLabelClick
    }
  }
}
</script>

<style scoped>

</style>
