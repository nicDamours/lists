import {useStore} from "vuex";
import {modalController} from "@ionic/vue";
import LoginModal from "@/components/modal/LoginModal.vue";
import {ComponentRef} from "@ionic/core";
import {computed} from "vue";

export default function useAuthentication() {
    const store = useStore();
    const currentUser = computed(() => {
        return store.getters["users/currentUser"];
    })

    const defineCurrentUser = async (user: any) => {
        await store.dispatch("users/defineCurrentUser", user);
    }

    const showAuthenticationModal = async () => {
        return new Promise(resolve => {
            return modalController.create({
                component: LoginModal as any as ComponentRef,
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
