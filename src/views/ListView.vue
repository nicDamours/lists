<template>
  <ion-page v-if="list">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title size="large">{{ list.name }}</ion-title>
        <ion-buttons slot="start">
          <ion-back-button default-href="/lists"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="handleDeleteList" color="danger">
            Delete
            <ion-icon :icon="trashOutline" slot="end"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ list.name }}</ion-title>
          <ion-buttons slot="end">

          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-list v-for="(section, sectionIndex) in list.sections" :key="section.id">
        <ion-list-header lines="full">
            <ion-title>{{ section.name }}</ion-title>
            <ion-button color="danger" @click="deleteSection(section.id)">
              remove
              <ion-icon :icon="removeOutline" slot="end"></ion-icon>
            </ion-button>
        </ion-list-header>

        <ion-item-sliding v-for="(item, itemIndex) in section.items" :key="item.id" class="o-list__item">
          <ion-item-options side="start">
            <ion-item-option @click="deleteItem(sectionIndex, item.id)" color="danger">
              delete
              <ion-icon :icon="trashOutline" slot="end"></ion-icon>
            </ion-item-option>
          </ion-item-options>

          <ion-item button detail="false" @click="event => toggleItemDone(sectionIndex, itemIndex, !item.done, event)">
            <ion-text>{{ item.name }}</ion-text>
            <ion-text class="o-list__item__quantity" @click="event => showQuantityChange(sectionIndex, itemIndex, event)"> x {{ item.quantity }}</ion-text>
            <ion-checkbox :checked="item.done" slot="end"/>
          </ion-item>
        </ion-item-sliding>
        <NewItemForm @form-submit="value => createNewItem(sectionIndex, value)" name="item"/>
      </ion-list>

      <ion-list>
        <NewItemForm @form-submit="createNewSection" name="section"/>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {computed, ref} from "vue";
import {addOutline, removeOutline, trashOutline} from 'ionicons/icons';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader, IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar
} from "@ionic/vue";
import ListService from "@/services/ListService";
import {Item} from "@/models/dtos/Item";
import UUID from "@/utils/UUID";
import {Section} from "@/models/dtos/Section";
import NewItemForm from "@/components/NewItemForm";
import useConfirm from "@/composable/use-confirm";
import useAlert from "@/composable/use-alerts";

export default {
  name: "ListView",
  components: {
    IonPage,
    IonContent,
    IonList,
    IonIcon,
    IonListHeader,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonItemOption,
    IonItemOptions,
    IonText,
    IonItem,
    IonCheckbox,
    IonItemSliding,
    IonButton,
    NewItemForm,
    IonBackButton,
    IonButtons
  },
  setup() {
    const route = useRoute();
    const store = useStore()
    const router = useRouter();

    const currentListId = computed(() => route.params.id)

    const { showNumberAlert } = useAlert();

    const newSectionName = ref("");

    const list = computed(() => store.getters['lists/getListById'](currentListId.value));

    const toggleItemDone = async (sectionIndex, itemIndex, value, $event) => {
      const target = $event.target;
      if(!target.classList.contains("o-list__item__quantity")) {
        const copiedList = list.value.clone();
        copiedList.sections[sectionIndex].items[itemIndex].done = value;

        await ListService.updateList(copiedList)
      }
    }

    const createNewItem = async (sectionIndex, value) => {
      const newItem = new Item(UUID.uuidv4(), value);

      const copiedList = list.value.clone();
      copiedList.sections[sectionIndex].items.push(newItem);

      await ListService.updateList(copiedList);
    }

    const createNewSection = async (value) => {
      const newSection = new Section(UUID.uuidv4());

      newSection.name = value

      const copiedList = list.value.clone();
      copiedList.sections.push(newSection)

      await ListService.updateList(copiedList);
    }

    const deleteSection = async (sectionId) => {
      const results = await useConfirm("Are you sure you want to delete this section ?");

      if(results) {
        const copiedList = list.value.clone();

        copiedList.sections = copiedList.sections.filter(item => item.id !== sectionId)

        await ListService.updateList(copiedList);
      }
    }

    const deleteItem = async (sectionIndex, itemId) => {
      const results = await useConfirm("Are you sur you want to delete this item ?");

      if(results) {
        const copiedList = list.value.clone();
        copiedList.sections[sectionIndex].items = copiedList.sections[sectionIndex].items.filter(item => item.id !== itemId);

        await ListService.updateList(copiedList);
      }
    }

    const handleDeleteList = async () => {
      const results = await useConfirm("Are you sur you want to delete this list ?");

      if(results) {

        await ListService.deleteList(list.value);

        await router.push({ name: "Home"})
      }
    }

    const showQuantityChange = async (sectionIndex, itemIndex, event) => {
      const target = event.target
      if(target.classList.contains("o-list__item__quantity")) {
        const copiedList = list.value.clone();
        const currentItem = copiedList.sections[sectionIndex].items[itemIndex];

        const results = await showNumberAlert("Please enter a quantity", currentItem.quantity);

        if(results !== false) {
          copiedList.sections[sectionIndex].items[itemIndex].quantity = results;

          await ListService.updateList(copiedList)
        }
      }
    }

    return {
      addOutline,
      removeOutline,
      trashOutline,
      list,
      deleteItem,
      deleteSection,
      createNewItem,
      newSectionName,
      toggleItemDone,
      handleDeleteList,
      createNewSection,
      showQuantityChange
    }
  }
}
</script>
