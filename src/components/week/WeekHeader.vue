<template>
  <ion-col class="ion-no-padding">
    <div class="week-header">
      <div class="week-header__cell --header">
        <ion-text>&nbsp;</ion-text>
      </div>
      <div class="week-header__cell">
        Dinner
      </div>
      <div class="week-header__cell">
        Supper
      </div>
      <div class="week-header__cell">
        Activities
      </div>
    </div>
  </ion-col>
</template>

<script>
import {IonCol, IonText} from "@ionic/vue";
import {toRefs} from "@vueuse/core";
import useDates from "@/composable/use-dates";
import {computed} from "vue";

export default {
  name: "WeekHeader",
  components: {IonCol, IonText},
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
    const { getDaysFromDates, isSameDay } = useDates()

    const daysOfWeek = computed(() => getDaysFromDates(startDate.value, endDate.value));

    const isCurrentDate = (date) => {
      return date && isSameDay(date, new Date());
    }
    return {
      daysOfWeek,
      isCurrentDate
    }
  }
}
</script>

<style lang="scss">
.week-header {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__cell {
    flex: 1 1 auto;
    border-bottom: solid 1px lightgray;
    display: flex;
    justify-content: center;
    align-items: center;

    &:not(:last-child) {
      border-bottom: solid 1px lightgray;
    }

    &-content {
      white-space: pre-line;
    }


    &.--today {
      background-color: var(--ion-color-step-150);
    }

    &.--header {
      flex: 0 1 auto;
    }
  }
}
</style>
