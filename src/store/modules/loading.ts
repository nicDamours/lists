import {VuexFunction} from "@/store";

export const namespaced = true;

type LoadingState = {
    loading: boolean;
}
export const state: LoadingState = {
    loading: false
}

export const getters = {
    isLoading(state: LoadingState) {
        return state.loading;
    }
}

export const mutations = {
    SET_LOADING_STATE(state: LoadingState, value: boolean) {
        state.loading = value;
    }
}

export const actions = {
    defineLoadingState({ commit }: VuexFunction<typeof mutations>, value: boolean) {
        commit('SET_LOADING_STATE', value);
    }
}
