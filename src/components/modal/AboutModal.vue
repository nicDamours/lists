<template>
  <BaseModal :title="t('modals.about.title')">
    <div class="o-about__container">
      <div class="o-about__header">
        <ion-icon :icon="cart" class="o-about__icon" size="large"></ion-icon>
        <ion-text>
          <h3>Ma Liste</h3>
        </ion-text>
      </div>
      <div class="o-about__content">
        <ion-text>
          <p>{{ t('modals.about.author') }} <a href="https://github.com/nicDamours">nicDamours</a> ❤️</p>
        </ion-text>

        <ion-text>
          <p>{{ t('modals.about.softwareCost') }}</p>
        </ion-text>

        <ion-text>
          <p>{{ t('modals.about.foundABug') }} <a
              href="https://github.com/nicDamours/lists/issues/new/choose">{{ t('modals.about.reportIssue') }}</a> 🪲
          </p>
        </ion-text>
      </div>


      <div class="o-about__footer">
        <a href="https://www.buymeacoffee.com/nicDamours" target="_blank"><img
            alt="Buy Me A Coffee" src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png"
            style="height: 60px !important;width: 217px !important;"></a>
        <a href="https://github.com/nicDamours/lists" target="_blank">
          <ion-icon :icon="logoGithub" class="o-about__github"></ion-icon>
        </a>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import {useI18n} from "vue-i18n";
import {cart, logoGithub} from 'ionicons/icons';
import {IonIcon} from "@ionic/vue";
import BaseModal from "@/components/modal/BaseModal.vue";

export default {
  name: "AboutModal",
  components: {
    BaseModal,
    IonIcon,
  },
  setup() {
    const {t} = useI18n();

    return {
      t,
      cart,
      logoGithub
    }
  }
}
</script>
