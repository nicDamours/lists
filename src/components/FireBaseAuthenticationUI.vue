<template>
  <div id="firebase-authentication-ui"></div>
</template>

<script>
import * as firebaseUI from 'firebaseui';
import getAuthInstance from "@/auth"
import {computed, onMounted} from "vue";
import { GoogleAuthProvider } from "firebase/auth";

export default {
  name: "FireBaseAuthenticationUI",
  emits: ["authentication-success"],
  setup(_, { emit }) {

    const UI = computed(() => {
      const instance = firebaseUI.auth.AuthUI.getInstance();
      return instance || new firebaseUI.auth.AuthUI(getAuthInstance());
    });

    onMounted(() => {
      UI.value.start('#firebase-authentication-ui', {
        callbacks: {
          signInSuccessWithAuthResult: () => {
            emit("authentication-success")
            return false;
          }
        },
        signInOptions: [
          GoogleAuthProvider.PROVIDER_ID
        ]
      });
    })
  }
}
</script>
