import {VuexFunction} from "@/store";

export const namespaced = true;

type LoadingState = {
    loadingCount: number;
}
export const state: LoadingState = {
    loadingCount: 0
}

export const getters = {
    isLoading(state: LoadingState) {
        return state.loadingCount > 0;
    }
}

export const mutations = {
    INCREMENT_LOADING_COUNT(state: LoadingState) {
        state.loadingCount += 1
    },
    DECREMENT_LOADING_COUNT(state: LoadingState) {
        state.loadingCount -= 1;
    }
}
export const actions = {
    incrementLoadingCount({commit}: VuexFunction<typeof mutations>) {
        commit('INCREMENT_LOADING_COUNT');
    },
    decrementLoadingCount({commit}: VuexFunction<typeof mutations>) {
        commit('DECREMENT_LOADING_COUNT')
    }
}
