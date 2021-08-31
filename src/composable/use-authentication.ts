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
        const modal = await modalController
            .create({
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                component: LoginModal,
                cssClass: 'my-custom-class',
                componentProps: {
                    title: 'New Title'
                },
            })

        await modal.present();
    }

    return {
        currentUser,
        defineCurrentUser,
        showAuthenticationModal
    }
}
