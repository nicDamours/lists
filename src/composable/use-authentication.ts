import {useStore} from "vuex";
import {useStorage} from "@vueuse/core"
import {modalController} from "@ionic/vue";
import LoginModal from "@/components/modal/LoginModal.vue";

export default function useAuthentication() {
    const store = useStore();
    const currentUser = useStorage('current-user', null);

    const defineCurrentUser = (user: any) => {
        store.dispatch("user/defineCurrentUser", user);
        currentUser.value = user;
    }

    const showAuthenticationModal = async () => {
        return new Promise(resolve => {
            return modalController.create({
                component: 'LoginModal',
                cssClass: 'o-modal__authentication',
                componentProps: {
                    title: 'New Title'
                },
            })
            .then(modal => {
                modal.present()
                return modal;
            })
            .then(modal => {
                modal.onDidDismiss().then(result => {
                    resolve(result);
                })
            })
        })

    }

    return {
        currentUser,
        defineCurrentUser,
        showAuthenticationModal
    }
}
