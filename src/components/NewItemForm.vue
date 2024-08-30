<template>
  <ion-item data-reorder-after="false">
    <form @submit.prevent="handleSubmit" class="o-form">
      <div v-if="!hasFocus" class="o-form__new-label" @click="handleLabelClick">
        <ion-button fill="clear" color="dark">
          <ion-icon :icon="addOutline" slot="start"></ion-icon>
          {{ t(text) }}
        </ion-button>
      </div>
      <div v-if="hasFocus" class="o-form__group--new o-form__keep-focus-on-click" @blur.capture="handleGroupBlur">
        <ion-item class="o-form__group-input">
          <ContainerWithErrors  :errors="inputErrors">
            <ion-label position="floating" :color="hasErrors ? 'danger' : 'primary'" >{{ t(text) }}</ion-label>
            <ion-input :ref="el => refs[uuid] = el" v-model="newItemModel" :color="hasErrors ? 'danger' : 'dark'"
                       class="o-form__input" type="text"/>
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
  setup(_, {emit, expose}) {
    const uuid = ref(UUID.uuidv4());
    const refs = ref({});
    const inputErrors = ref([]);
    const {defineInputFocus} = useInputFocus(refs);

    const hasFocus = ref(false);

    const newItemName = ref("");

    const newItemModel = computed({
      get() {
        return newItemName.value
      },
      set(value) {
        newItemName.value = value;
        inputErrors.value = [];
      }
    })

    const {t} = useI18n();

    const validateInputs = () => {
      inputErrors.value = [];

      if (newItemModel.value === "") {
        inputErrors.value.push("errors.fieldCannotBeEmpty");
      }

      return inputErrors.value.length === 0;
    }

    const handleSubmit = async () => {
      if (validateInputs()) {
        emit("form-submit", `${newItemModel.value}`)

        newItemModel.value = ""
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
      if (!event.relatedTarget || !event.relatedTarget.closest('.o-form__keep-focus-on-click')) {
        hasFocus.value = false;
        await defineInputFocus(uuid.value, false);
      }
    }

    const hasErrors = computed(() => inputErrors.value.length > 0);

    const exposedFocusFn = () => {
      defineInputFocus(uuid.value, true);
      hasFocus.value = true;
    }

    const exposedDefocusFn = () => {
      defineInputFocus(uuid.value, false);
      hasFocus.value = false;
    }

    expose({focus: exposedFocusFn, defocus: exposedDefocusFn});

    return {
      t,
      refs,
      uuid,
      hasFocus,
      hasErrors,
      addOutline,
      inputErrors,
      newItemModel,
      handleSubmit,
      handleGroupBlur,
      handleLabelClick
    }
  }
}
</script>

<style scoped>

</style>
