import {VuexFunction} from "@/store";

export const namespaced = true;

type UserType = { id: string };
type UserState = {
    currentUser: UserType | null;
}
export const state: UserState = {
    currentUser: null
}

export const getters = {
    currentUser(state: UserState) {
        return state.currentUser;
    }
}

export const mutations = {
    DEFINE_CURRENT_USER(state: UserState, user: UserType) {
        state.currentUser = user;
    },
}
export const actions = {
    defineCurrentUser({commit}: VuexFunction<typeof mutations>, user: UserType) {
        commit('DEFINE_CURRENT_USER', user);
    },
}
