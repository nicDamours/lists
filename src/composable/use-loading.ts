import {useStore} from "vuex";
import {computed} from "vue";

export default function useLoading() {
    const store = useStore();

    const defineLoadingState = async (state: boolean) => {
        const actionName = state ? 'incrementLoadingCount' : 'decrementLoadingCount';

        return store.dispatch(`loading/${actionName}`, null, {root: true});
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

            return await cb.call({}, ...args);
        } finally {
            await stopLoading();
        }
    }

    return {
        callAsync,
        loading: computed(() => store.getters['loading/isLoading']),
        stopLoading,
        startLoading,
        defineLoadingState,
    }
}
