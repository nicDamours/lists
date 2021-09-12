<template>
  <ion-item>
    <form @submit.prevent="handleSubmit" class="o-form">
      <div class="o-form__new-label" v-if="!hasFocus" @click="handleLabelClick">
        <ion-button fill="clear" color="dark">
          <ion-icon :icon="addOutline" slot="start"></ion-icon>
          {{ t(text) }}
        </ion-button>
      </div>
      <div class="o-form__group--new" v-if="hasFocus">
        <ion-item class="o-form__group-input">
          <ion-label position="floating">{{ t(text) }}</ion-label>
            <ion-input type="text" v-model="newItemName" :autofocus="hasFocus" @ion-blur="handleGroupBlur" />
        </ion-item>
        <ion-button slot="end" type="submit" color="success" fill="clear">
          {{ t("global.add") }}
          <ion-icon :icon="addOutline" slot="end"></ion-icon>
        </ion-button>
      </div>
    </form>
  </ion-item>
</template>

<script>
import {ref} from "vue";
import {IonButton, IonIcon, IonInput, IonItem, IonLabel} from "@ionic/vue";
import {addOutline} from "ionicons/icons";
import UUID from "@/utils/UUID";
import {useI18n} from "vue-i18n";

export default {
  name: "NewItemForm",
  components: {
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

    const hasFocus = ref(false);

    const elementRef = ref(null);

    const newItemName = ref("");

    const { t } = useI18n();

    const handleSubmit = () => {
      emit("form-submit", `${newItemName.value}`)

      newItemName.value = ""
    }

    const handleLabelClick = () => {
      hasFocus.value = true;

    }

    const handleGroupBlur = () => {
      hasFocus.value = false;
    }

    return {
      t,
      uuid,
      hasFocus,
      addOutline,
      elementRef,
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
