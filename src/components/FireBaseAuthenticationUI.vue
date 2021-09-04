<template>
  <div id="firebase-authentication-ui" v-if="!isMobile"></div>
  <div v-if="isMobile">
    <ion-button @click="handleSignInWithGoogleClick">
      {{ t('authentication.signInWithGoogle') }}
      <ion-icon :icon="google" />
    </ion-button>
  </div>
</template>

<script>
import * as firebaseUI from 'firebaseui';
import {computed, onMounted} from "vue";
import {GoogleAuthProvider, EmailAuthProvider} from "firebase/auth";
import {IonIcon, isPlatform} from "@ionic/vue";
import { FirebaseAuthentication } from "@ionic-native/firebase-authentication";
import {useI18n} from "vue-i18n";
import { logoGoogle } from "ionicons/icons"
import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";

export default {
  name: "FireBaseAuthenticationUI",
  emits: ["authentication-success"],
  components: {
    IonIcon
  },
  setup(_, {emit}) {
    const { t } = useI18n();
    const auth = Container.get('FirebaseAuthService').auth
    const UI = computed(() => {
      const instance = firebaseUI.auth.AuthUI.getInstance();
      return instance || new firebaseUI.auth.AuthUI(auth);
    });

    const isMobile = computed(() => isPlatform('ios') || isPlatform('android'))

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


    const handleSignInWithGoogleClick = async () => {
      console.log('before signIn')
      const results = await FirebaseAuthentication.signInWithGoogle(process.env.VUE_APP_FIRESTORE_PROJECT_ID, process.env.VUE_APP_FIRESTORE_API_KEY);
      console.log('results', results);
      if(results) {
        emit("authentication-success")
      }
    }

    return {
      t,
      isMobile,
      logoGoogle,
      handleSignInWithGoogleClick
    }
  }
}
</script>
