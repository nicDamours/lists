<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title> {{ t('pages.week.title') }}</ion-title>
        <ion-buttons slot="end">

        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('pages.week.title') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <WeekSelector v-model="viewDate" />

      <WeekPlanner :plan="currentWeekPlan" @update-plan="handleWeekPlanChange" />
    </ion-content>
  </ion-page>
</template>

<script>
import {IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import WeekPlanner from "@/components/WeekPlanner";
import useWeeKPlans from "@/composable/use-week-plans";
import { ref } from "vue";
import WeekSelector from "@/components/week/WeekSelector";
import useWeekService from "@/composable/use-week-service";

export default {
  name: "WeekView",
  components: {
    IonPage,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    WeekPlanner,
    WeekSelector
  },
  setup() {
    const { t } = useI18n();
    const viewDate = ref(new Date())
    const {updateWeekPlan, createWeekPlan } = useWeekService()
    const { currentWeekPlan } = useWeeKPlans(viewDate);

    const handleWeekPlanChange = async (updatedValue) => {
      if(updatedValue.id !== "") {
        await updateWeekPlan(updatedValue);
      } else {
        await createWeekPlan(updatedValue)
      }
    }

    return {
      t,
      viewDate,
      currentWeekPlan,
      handleWeekPlanChange
    }
  }
}
</script>
