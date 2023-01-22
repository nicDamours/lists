<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title> {{ t('pages.week.title') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="false" @click="handleCopyWeekClick">
            {{ t('pages.week.copyWeek') }}
          </ion-button>
          <ion-button @click="openPopover">
            <ion-icon slot="icon-only" :icon="settingsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('pages.week.title') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card>
        <ion-card-content>
          <WeekSharingSelector v-model="selectedSharingModel"/>
          <WeekSelector v-model="viewDate" />

          <WeekPlanner :plan="selectedWeekPlan" @update-plan="handleWeekPlanChange"/>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  popoverController
} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import WeekPlanner from "@/components/WeekPlanner";
import useWeeKPlans from "@/composable/use-week-plans";
import {computed, ref} from "vue";
import WeekSelector from "@/components/week/WeekSelector";
import useWeekService from "@/composable/use-week-service";
import WeekOptionPopOver from "@/components/WeekOptionPopOver.vue";
import {settingsOutline} from "ionicons/icons";
import WeekSharingSelector from "@/components/week/WeekSharingSelector.vue";
import useWeekSharing from "@/composable/use-week-sharing";
import SharedWeekOptionPopOver from "@/components/SharedWeekOptionPopOver.vue";

export default {
  name: "WeekView",
  components: {
    WeekSharingSelector,
    IonPage,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    WeekPlanner,
    WeekSelector,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent
  },
  setup() {
    const {t} = useI18n();
    const viewDate = ref(new Date())
    const {updateWeekPlan, createWeekPlan} = useWeekService()
    const {currentWeekPlan} = useWeeKPlans(viewDate);
    const selectedSharing = ref(null);
    const {currentSharedWeekForUser} = useWeekSharing(selectedSharing, viewDate)
    const copyWeekModalVisible = ref(false);

    const handleWeekPlanChange = async (updatedValue) => {
      if (updatedValue.id !== "") {
        await updateWeekPlan(updatedValue);
      } else {
        if (selectedSharing.value) {
          updatedValue.author = selectedSharing.value.author
        }
        await createWeekPlan(updatedValue)
      }
    }

    const showCopyWeekModal = () => {
      copyWeekModalVisible.value = true;
    }

    const hideCopyWeekModal = () => {
      copyWeekModalVisible.value = false;
    }

    const handleCopyWeekSelection = (selectedWeek) => {
      console.log(selectedWeek);
    }

    const handleEmptyWeekClick = () => {
      console.log('empty week clicked');
    }

    const getPopOverComponent = (ev) => {
      const popOverComponent = selectedSharing.value ? SharedWeekOptionPopOver : WeekOptionPopOver

      const popOverProps = selectedSharing.value ? {
        sharing: selectedSharing.value
      } : {
        dates: {
          startDate: currentWeekPlan.value.startDate,
          endDate: currentWeekPlan.value.endDate
        }
      }

      return popoverController
          .create({
            component: popOverComponent,
            componentProps: popOverProps,
            event: ev,
            translucent: true
          })
    }

    const openPopover = async (ev) => {
      const popover = await getPopOverComponent(ev);
      await popover.present();

      const {data} = await popover.onDidDismiss();

      if (data && 'changeWeekSharing' in data && data.changeWeekSharing) {
        selectedSharing.value = null;
      }
    }

    const selectedWeekPlan = computed(() => {
      if (!selectedSharing.value) {
        return currentWeekPlan.value;
      }

      return currentSharedWeekForUser.value;
    })

    const selectedSharingModel = computed({
      get() {
        return selectedSharing.value ? selectedSharing.value : null
      },
      set(value) {
        selectedSharing.value = value;
      }
    })

    return {
      t,
      viewDate,
      openPopover,
      selectedSharing,
      settingsOutline,
      currentWeekPlan,
      selectedWeekPlan,
      showCopyWeekModal,
      hideCopyWeekModal,
      selectedSharingModel,
      handleWeekPlanChange,
      handleEmptyWeekClick,
      handleCopyWeekSelection
    }
  }
}
</script>
