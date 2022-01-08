<template>
  <div class="week-calendar">
    <ion-grid class="ion-hide-sm-down">
      <WeekHeader :start-date="plan.startDate" :end-date="plan.endDate" />
      <WeekRow :cells="dinnerCells" :title="t('WeekPlanner.titles.dinner')" @change="({value, day}) => handleCellChange('dinner', value, day)"/>
      <WeekRow :cells="supperCells" :title="t('WeekPlanner.titles.supper')"  @change="({value, day}) => handleCellChange('supper', value, day)"/>
      <WeekRow :cells="activitiesCells" :title="t('WeekPlanner.titles.activities')"  @change="({value, day}) => handleCellChange('activities', value, day)"/>
    </ion-grid>

    <ion-list class="ion-hide-sm-up">
      <WeekDayListGroup v-for="day in plan.days" :key="day.date.getTime()" :day="day" @day-value-change="(value) => handleDayValueChange(value, day)" />
    </ion-list>
  </div>
</template>

<script>
import WeekRow from "./week/WeekRow";
import {IonGrid, IonList} from "@ionic/vue";
import WeekHeader from "./week/WeekHeader";
import {computed, toRefs} from "vue";
import WeekDayListGroup from "@/components/week/WeekDayListGroup";
import {useI18n} from "vue-i18n";

export default {
  name: "WeekPlanner",
  emits: ["update-plan"],
  components: {WeekRow, IonGrid, WeekHeader, WeekDayListGroup, IonList },
  props: {
    plan: {
      type: Object,
      required: true,
    }
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const { plan } = toRefs(props);

    const dinnerCells = computed(() => plan.value.days.map(day => ({content: day.dinner, id: day.id, day})));
    const supperCells = computed(() => plan.value.days.map(day => ({content: day.supper, id: day.id, day})));
    const activitiesCells = computed(() => plan.value.days.map(day => ({content: day.activities, id: day.id, day})));

    const getIndexFromDay = (day) => {
      return plan.value.days.findIndex(currentDay => currentDay.date.getTime() === day.date.getTime());
    }

    const handleDayValueChange = (value, day) => {
      const index = getIndexFromDay(day);

      plan.value.days[index] = Object.assign(day, value);

      emit("update-plan", plan.value);
    }

    const handleCellChange = (property, value, day) => {
      const updatedValue = {
        [property]: value
      }

      handleDayValueChange(updatedValue, day);
    }

    return {
      t,
      dinnerCells,
      supperCells,
      activitiesCells,
      handleCellChange,
      handleDayValueChange
    }
  }
}
</script>
