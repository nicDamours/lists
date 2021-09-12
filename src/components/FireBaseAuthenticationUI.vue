<template>
  <div id="firebase-authentication-ui" v-if="!isMobile"></div>
</template>

<script>
import * as firebaseUI from 'firebaseui';
import {computed, onMounted} from "vue";
import {EmailAuthProvider, GoogleAuthProvider} from "firebase/auth";
import {useI18n} from "vue-i18n";
import {logoGoogle} from "ionicons/icons"
import {Container} from "@/utils/Container";

export default {
  name: "FireBaseAuthenticationUI",
  emits: ["authentication-success"],
  setup(_, {emit}) {
    const { t } = useI18n();
    const auth = Container.get('FirebaseAuthService').auth
    const UI = computed(() => {
      const instance = firebaseUI.auth.AuthUI.getInstance();
      return instance || new firebaseUI.auth.AuthUI(auth);
    });

    const isMobile = computed(() => false)

    onMounted(() => {
      if(!isMobile.value) {
        UI.value.start('#firebase-authentication-ui', {
          callbacks: {
            signInSuccessWithAuthResult: () => {
              emit("authentication-success")
              return false;
            }
          },
          signInOptions: [
            GoogleAuthProvider.PROVIDER_ID,
            EmailAuthProvider.PROVIDER_ID,
          ]
        });
      }
    });

    return {
      t,
      isMobile,
      logoGoogle
    }
  }
}
</script>
