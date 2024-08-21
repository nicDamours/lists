<template>
  <ion-item data-reorder-after="false">
    <form @submit.prevent="handleSubmit" class="o-form">
      <div v-if="!hasFocusModel" class="o-form__new-label" @click="handleLabelClick">
        <ion-button fill="clear" color="dark">
          <ion-icon :icon="addOutline" slot="start"></ion-icon>
          {{ t(text) }}
        </ion-button>
      </div>
      <div v-if="hasFocusModel" class="o-form__group--new o-form__keep-focus-on-click" @blur.capture="handleGroupBlur">
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
import {computed, ref, toRefs, watch} from "vue";
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
  emits: ["form-submit", "update:hasFocus"],
  props: {
    text: {
      type: String,
      required: true
    },
    hasFocus: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    }
  },
  setup(props, {emit}) {
    const uuid = ref(UUID.uuidv4());
    const refs = ref({});
    const inputErrors = ref([]);
    const {defineInputFocus} = useInputFocus(refs);
    const {hasFocus} = toRefs(props);

    const hasFocusModel = computed({
      get() {
        console.log('new has focus', hasFocus.value);
        return hasFocus.value
      },
      set(value) {
        emit("update:hasFocus", value)
      }
    })

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
      if(validateInputs()) {
        emit("form-submit", `${newItemModel.value}`)

        newItemModel.value = ""
        await defineInputFocus(uuid.value, false);
      } else {
        await defineInputFocus(uuid.value, true);
      }
    }

    const handleLabelClick = async () => {
      hasFocusModel.value = true;
      await defineInputFocus(uuid.value, true);
    }

    const handleGroupBlur = async (event) => {
      if(!event.relatedTarget || !event.relatedTarget.closest('.o-form__keep-focus-on-click')) {
        hasFocusModel.value = false;
        await defineInputFocus(uuid.value, false);
      }
    }

    const hasErrors = computed(() => inputErrors.value.length > 0);

    watch(hasFocus, (value) => {
      defineInputFocus(uuid.value, value);
    })

    return {
      t,
      refs,
      uuid,
      hasFocusModel,
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
