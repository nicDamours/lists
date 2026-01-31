<template>
  <div class="week-calendar">
    <ion-grid class="ion-hide-sm-down">
      <ion-row>
        <WeekHeader :end-date="plan.endDate" :start-date="plan.startDate"/>
        <WeekColumn v-for="(day, $index) in plan.days" :key="day.id" :day="day"
                    :previousDay="getPreviousDay($index)"
                    @day-value-change="(value) => handleDayValueChange(value, day)"/>
      </ion-row>
    </ion-grid>

    <ion-list class="ion-hide-sm-up">
      <WeekDayListGroup v-for="(day, $index) in plan.days" :key="day.date.getTime()" :day="day"
                        :index="$index"
                        :previousDay="getPreviousDay($index)" @day-value-change="(value) => handleDayValueChange(value, day)"/>
    </ion-list>
  </div>
</template>

<script>
import WeekColumn from "./week/WeekColumn.vue";
import {IonGrid, IonList, IonRow} from "@ionic/vue";
import WeekHeader from "./week/WeekHeader";
import {computed, toRefs} from "vue";
import WeekDayListGroup from "@/components/week/WeekDayListGroup";
import {useI18n} from "vue-i18n";

export default {
  name: "WeekPlanner",
  emits: ["update-plan"],
  components: {WeekColumn, IonGrid, IonRow, WeekHeader, WeekDayListGroup, IonList},
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

    const getPreviousDay = (currentDayIndex) => {
      if (currentDayIndex === 0) {
        return null;
      }

      return plan.value.days[currentDayIndex - 1]
    }

    return {
      t,
      dinnerCells,
      supperCells,
      activitiesCells,
      getPreviousDay,
      handleCellChange,
      handleDayValueChange
    }
  }
}
</script>
