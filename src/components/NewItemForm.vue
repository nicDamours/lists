<template>
  <ion-item>
    <form @submit.prevent="handleSubmit" class="o-form">
      <div class="o-form__new-label" v-if="!hasFocus" @click="handleLabelClick">
        <ion-button fill="clear" color="dark">
          <ion-icon :icon="addOutline" slot="start"></ion-icon>
          Add new {{ name }}
        </ion-button>
      </div>
      <div class="o-form__group--new" v-if="hasFocus" @blur="handleGroupBlur">
        <ion-item class="o-form__group-input">
          <ion-label position="floating">Add new {{ name }}</ion-label>
            <ion-input type="text" v-model="newItemName" autofocus/>
        </ion-item>
        <ion-button slot="end" type="submit" color="success" fill="clear">
          add
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
    name: {
      type: String,
      required: true
    }
  },
  setup(_, {emit}) {
    const uuid = ref(UUID.uuidv4());

    const hasFocus = ref(false);

    const elementRef = ref(null);

    const newItemName = ref("");

    const handleSubmit = () => {
      emit("form-submit", `${newItemName.value}`)

      newItemName.value = ""
      hasFocus.value = false;
    }

    const handleLabelClick = () => {
      hasFocus.value = true;

    }

    const handleGroupBlur = () => {
      console.log('blured ! ')
      hasFocus.value = false;
    }

    return {
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
