<template>
  <ion-page>
    <slot></slot>
    <OrganismPreferences/>
  </ion-page>
</template>

<script>
import OrganismPreferences from "@/components/OrganismPreferences.vue";
import {IonPage} from "@ionic/vue";

export default {
  name: "BasePageTemplate",
  components: {
    IonPage,
    OrganismPreferences
  }
}
</script>
