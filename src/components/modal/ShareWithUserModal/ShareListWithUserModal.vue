<template>
  <ShareWithUserModal @submit-click="handleSubmitClick">
    <template #default="{emailInput, updateEmailInput}">
      <ShareWithUserList :list="list"/>
      <ShareWithUserForm :model-value="emailInput" @update:modelValue="updateEmailInput"/>
    </template>
  </ShareWithUserModal>
</template>

<script>
import ShareWithUserModal from "@/components/modal/ShareWithUserModal/ShareWithUserModal.vue";
import {computed} from "vue";
import {toRefs} from "@vueuse/core";
import useLists from "@/composable/use-lists";
import ShareWithUserForm from "@/components/modal/ShareWithUserModal/ShareWithUserForm.vue";
import ShareWithUserList from "@/components/modal/ShareWithUserModal/ShareWithUserList.vue";
import {modalController} from "@ionic/vue";

export default {
  name: "ShareListWithUserModal",
  components: {ShareWithUserModal, ShareWithUserList, ShareWithUserForm},
  props: {
    listId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const {listId} = toRefs(props);
    const {getListById} = useLists();

    const list = computed(() => getListById(listId.value));

    const handleSubmitClick = emailInput => {
      modalController.dismiss(emailInput);
    }

    return {
      list,
      handleSubmitClick
    }
  }
}
</script>
