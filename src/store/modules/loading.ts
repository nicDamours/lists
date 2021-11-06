import {VuexFunction} from "@/store";

export const namespaced = true;

type LoadingState = {
    loading: boolean;
    loadingProgress: null|number;
}
export const state: LoadingState = {
    loading: false,
    loadingProgress: null
}

export const getters = {
    isLoading(state: LoadingState) {
        return state.loading;
    },
    loadingProgress(state: LoadingState) {
        return state.loadingProgress
    }
}

export const mutations = {
    SET_LOADING_STATE(state: LoadingState, value: boolean) {
        state.loading = value;
    },
    SET_LOADING_PROGRESS(state: LoadingState, value: null|number){
        state.loadingProgress = value;
    }
}

export const actions = {
    defineLoadingState({ commit }: VuexFunction<typeof mutations>, value: boolean) {
        commit('SET_LOADING_STATE', value);
    },
    defineLoadingProgress({ commit }: VuexFunction<typeof mutations>, value: null|number){
        commit('SET_LOADING_PROGRESS', value);
    }
}
