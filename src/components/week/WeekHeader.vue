<template>
  <ion-col class="ion-no-padding">
    <div class="week-header">
      <div class="week-header__cell --header">
        <ion-text>&nbsp;</ion-text>
      </div>
      <div class="week-header__cell">
        {{ t('WeekPlanner.titles.dinner') }}
      </div>
      <div class="week-header__cell">
        {{ t('WeekPlanner.titles.supper') }}
      </div>
      <div class="week-header__cell">
        {{ t('WeekPlanner.titles.activities') }}
      </div>
    </div>
  </ion-col>
</template>

<script>
import {IonCol, IonText} from "@ionic/vue";
import {useI18n} from "vue-i18n";

export default {
  name: "WeekHeader",
  components: {IonCol, IonText},
  setup() {
    const {t} = useI18n()

    return {
      t
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
    padding: 8px;

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
