<template>
  <ion-row class="week-row ion-justify-content-center">
    <ion-col class="week-row__title" >
      <ion-text class="week-row__title-text">
        <div>{{ title }}</div>
      </ion-text>
    </ion-col>
    <WeekCell
        :content="cell.content"
        v-for="cell in cells"
        :key="cell.id"
        :class="{'--today': isCurrentDate(cell) }"
        @change="value => handleCellChange(value, cell)"
    />
  </ion-row>
</template>

<script>
import {IonCol, IonRow, IonText} from "@ionic/vue";
import WeekCell from "./WeekCell";
import useDates from "@/composable/use-dates";

export default {
  name: "WeekRow",
  emits: ["change"],
  components: {WeekCell, IonRow, IonCol, IonText },
  props: {
    cells: {
      type: Array,
      required: true,
      validator(values) {
        return values.every((value) => 'content' in value && 'id' in value)
      }
    },
    title: {
      type: String,
      required: true
    }
  },
  setup(_, { emit }) {
    const handleCellChange = (value, cell) => {
      emit('change', {
        value,
        day: cell.day
      })
    }

    const { isSameDay } = useDates();

    const isCurrentDate = (cell) => {
      return cell.day.date && isSameDay(cell.day.date, new Date());
    }

    return {
      isCurrentDate,
      handleCellChange
    }
  }
}
</script>

<style scoped lang="scss">
.week {
  &-row {
    border-bottom: solid 1px lightgray;
    min-height: 100px;

    &__title {
      width: 10px;
      border-right: solid 1px lightgray;

      &-text {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
      }
    }
  }

  &-cell {
    &.--today {
      background-color: var(--ion-color-step-150);
    }
  }
}
</style>
