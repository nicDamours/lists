<template>
  <ion-row class="week-header">
    <ion-col class="week-header__cell"></ion-col>
    <ion-col
        class="week-header__cell"
        v-for="date in daysOfWeek"
        :key="date.date">
      <span class="week-header__cell-content">{{ date.title }}</span>
    </ion-col>
  </ion-row>
</template>

<script>
import {IonCol, IonRow} from "@ionic/vue";
import {toRefs} from "@vueuse/core";
import useDates from "@/composable/use-dates";
import {computed} from "vue";

export default {
  name: "WeekHeader",
  components: {IonRow, IonCol},
  props: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  setup(props) {
    const { startDate, endDate } = toRefs(props);
    const { getDaysFromDates } = useDates()

    const daysOfWeek = computed(() => getDaysFromDates(startDate.value, endDate.value).value);

    return {
      daysOfWeek
    }
  }
}
</script>

<style lang="scss">
.week-header {
  &__cell {
    border-bottom: solid 1px lightgray;
    display: flex;
    justify-content: center;
    align-items: center;

    &:not(:last-child) {
      border-right: solid 1px lightgray;
    }

    &-content {
      white-space: pre-line;
    }
  }
}
</style>
