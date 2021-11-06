import {useStore} from "vuex";
import {computed, Ref, ref} from "vue";
import {modalController} from "@ionic/vue";
import LoadingModal from "@/components/modal/LoadingModal.vue"

export default function useLoading() {
    const store = useStore();
    const loadingDialog: Ref<HTMLIonModalElement|null> = ref(null);

    const defineLoadingState = async (state: boolean) => {
        return store.dispatch('loading/defineLoadingState', state, {root: true});
    }

    const startLoading = async () => {
        return defineLoadingState(true)
    };
    const stopLoading = async () => {
        return defineLoadingState(false);
    }

    const callAsync = async (cb: (...args: any[]) => Promise<any>, ...args: any[]) => {
        try {
            await startLoading();
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            await cb.call({}, ...args);
        } finally {
            await stopLoading();
        }
    }

    const presentLoadingDialog = async () => {
        loadingDialog.value = await modalController.create({
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            component: LoadingModal,
            cssClass: 'o-loading-modal',
            componentProps: {
                hasProgress: true
            }
        })

        loadingDialog.value.present();
    }

    const dismissLoadingDialog = async () => {
        if(loadingDialog.value) {
            await loadingDialog.value.dismiss();
        }
    }

    const defineLoadingProgress = async (value: null|number) => {
        return store.dispatch('loading/defineLoadingProgress', value)
    }

    return {
        callAsync,
        loading: computed(() => store.getters['loading/isLoading']),
        loadingProgress: computed(() => store.getters['loading/loadingProgress']),
        stopLoading,
        startLoading,
        defineLoadingState,
        presentLoadingDialog,
        dismissLoadingDialog,
        defineLoadingProgress,
    }
}
