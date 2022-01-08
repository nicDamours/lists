import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import 'firebaseui/dist/firebaseui.css'

import "@/assets/main.scss";

import store from './store'
import loadLocaleMessages from './i18n'

import {createI18n} from "vue-i18n";

import containerRegistrationFunction from "@/dependeciesInjections";
import {Container} from "@/utils/Container";
import {FirebaseAppService} from "@/services/FirebaseAppService";

import "./registerServiceWorker";

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBurgerSoda as falBurgerAndSoda, faBiking as falBiking, faUtensils as falUtensils } from '@fortawesome/pro-light-svg-icons'

containerRegistrationFunction();

const currentLocale = window.localStorage.getItem("preferred-locale");

library.add(falBurgerAndSoda, falBiking, falUtensils)

const i18n = createI18n({
  legacy: false,
  locale: currentLocale || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})

Container.get<FirebaseAppService>('FirebaseAppService');

const app = createApp(App)
    .use(i18n)
  .use(store)
  .use(IonicVue)
  .use(router);

app.component('font-awesome-icon', FontAwesomeIcon)

router.isReady().then(() => {
  app.mount('#app');
});

