<template>
  <ShareWithUserModal :title="t('ShareWeekWithUserModal.title')" @submit-click="handleSubmitClick">
    <template #default="{emailInput, updateEmailInput, emailInputErrors, updateEmailInputErrors}">
      <ShareWeekWithUserList/>
      <ShareWithUserForm :errors="emailInputErrors" :model-value="emailInput" @update:modelValue="updateEmailInput"
                         :header-text="t('ShareWeekWithUserModal.form.headerText')"
                         @update:errors="updateEmailInputErrors"/>
      <div v-if="false" class="ion-padding">
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
import useWeekSharingUsers from "@/composable/use-week-sharing-users";
import {useI18n} from "vue-i18n";
import ShareWeekWithUserList from "@/components/modal/ShareWeekWithUserModal/ShareWeekWithUserList.vue";

export default {
  name: "ShareWeekWithUserModal",
  components: {ShareWithUserModal, ShareWithUserForm, ShareWeekSelector, ShareWeekWithUserList},
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
    const {t} = useI18n();
    const {dates} = toRefs(props);

    const shareAllWeekModel = ref(true)

    const datesModel = ref(dates.value);

    const {weekSharingUsers} = useWeekSharingUsers()

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
      t,
      datesModel,
      handleSubmitClick,
      shareAllWeekModel
    }
  }
}
</script>
