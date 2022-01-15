<template>
  <ion-list-header>{{ getTitleForDay(day) }}</ion-list-header>
  <ion-item>
    <font-awesome-icon :icon="['fal', 'burger-soda']"  slot="start"/>
    <ion-input v-model="dinnerModel"  debounce="500"/>
  </ion-item>
  <ion-item>
    <font-awesome-icon :icon="['fal', 'utensils']"  slot="start"/>
    <ion-input v-model="supperModel"  debounce="500"/>
  </ion-item>
  <ion-item>
    <font-awesome-icon :icon="['fal', 'biking']" slot="start"/>
    <ion-input v-model="activitiesModel"  debounce="500"/>
  </ion-item>
</template>

<script>
import {WeekPlanDays} from "@/models/dtos/WeekPlan/WeekPlanDays";
import {IonInput, IonItem, IonListHeader} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import useDates from "@/composable/use-dates";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {toRefs} from "vue";
import useWeekDayModels from "@/composable/use-week-day-models";

export default {
  name: "WeekDayListGroup",
  emits: ["day-value-change"],
  components: {
    FontAwesomeIcon,
    IonInput,
    IonItem,
    IonListHeader
  },
  props: {
    day: {
      type: Object,
      required: true,
      validator(value) {
        return value instanceof WeekPlanDays
      }
    }
  },
  setup(props, { emit }) {
    const { day } = toRefs(props);
    const { t } = useI18n();

    const { formatDateForDayOfWeek } = useDates();

    const getTitleForDay = day => {
      return formatDateForDayOfWeek(day.date).value;
    }

    return {
      t,
      getTitleForDay,
      ...useWeekDayModels(day, emit)
    }
  }
}
</script>

<style scoped>

</style>
