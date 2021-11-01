<template>
  <ion-item class="a-empty-list-item">
    <ion-text class="--muted ion-text-center">{{ t('global.noData') }}</ion-text>
  </ion-item>
</template>

<script>
import {IonItem, IonText} from "@ionic/vue";
import {useI18n} from "vue-i18n";

export default {
  name: "EmptyListItem",
  components: { IonText, IonItem },
  setup() {
    const { t } = useI18n();

    return {
      t
    }
  }
}
</script>
