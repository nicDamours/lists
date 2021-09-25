import {useStore} from "vuex";
import {computed} from "vue";

export default function useLoading() {
    const store = useStore();

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
        await startLoading();
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await cb.call({}, ...args);
        await stopLoading();
    }

    return {
        callAsync,
        loading: computed(() => store.getters['loading/isLoading']),
        stopLoading,
        startLoading,
        defineLoadingState,
    }
}
