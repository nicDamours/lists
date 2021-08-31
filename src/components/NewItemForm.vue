<template>
  <ion-item>
    <form @submit.prevent="handleSubmit" class="o-form">
      <div class="o-form__group--new">
        <ion-item class="o-form__group-input">
          <ion-label position="floating">Add new {{ name }}</ion-label>
          <ion-input type="text" v-model="newItemName"/>
        </ion-item>
        <ion-button slot="end" type="submit" color="success" fill="clear">
          add
        </ion-button>
      </div>
    </form>
  </ion-item>
</template>

<script>
import { ref } from "vue";
import {IonButton, IonInput, IonItem, IonLabel} from "@ionic/vue";
export default {
  name: "NewItemForm",
  components: {
    IonItem,
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
  setup(_, { emit }) {
    const newItemName = ref("");

    const handleSubmit = () => {
      emit("form-submit", `${newItemName.value}`)

      newItemName.value = ""
    }

    return {
      newItemName,
      handleSubmit
    }
  }
}
</script>

<style scoped>

</style>
