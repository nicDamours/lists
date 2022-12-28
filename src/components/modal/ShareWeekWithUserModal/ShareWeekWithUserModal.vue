<template>
  <ShareWithUserModal @submit-click="handleSubmitClick">
    <template #default="{emailInput, updateEmailInput}">
      <ShareWithUserForm :model-value="emailInput" @update:modelValue="updateEmailInput"/>
      <div class="ion-padding">
        <ShareWeekSelector v-model="datesModel" v-model:share-all-weeks="shareAllWeekModel"/>
      </div>
    </template>
  </ShareWithUserModal>
</template>

<script>
import ShareWithUserForm from "@/components/modal/ShareWithUserModal/ShareWithUserForm.vue";
import ShareWithUserModal from "@/components/modal/ShareWithUserModal/ShareWithUserModal.vue";
import weekPropsValidator from "@/propsValidators/weekPropsValidator";
import ShareWeekSelector from "@/components/ShareWeekSelector.vue";
import {modalController} from "@ionic/vue";
import {ref, toRefs} from "vue";

export default {
  name: "ShareWeekWithUserModal",
  components: {ShareWithUserModal, ShareWithUserForm, ShareWeekSelector},
  props: {
    dates: {
      type: Object,
      required: true,
      validator(value) {
        return weekPropsValidator(value)
      }
    }
  },
  setup(props) {
    const {dates} = toRefs(props);

    const shareAllWeekModel = ref(true)

    const datesModel = ref(dates.value);

    const handleSubmitClick = emailInput => {
      const output = {
        email: emailInput
      };
      output.shareAllWeeks = shareAllWeekModel.value

      if (!shareAllWeekModel.value) {
        output.weekDates = datesModel.value
      }

      modalController.dismiss(output)
    }

    return {
      datesModel,
      handleSubmitClick,
      shareAllWeekModel
    }
  }
}
</script>
