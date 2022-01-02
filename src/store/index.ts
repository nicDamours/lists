import {createStore, createLogger} from 'vuex'
import * as lists from "./modules/lists";
import * as loading from "./modules/loading"
import * as shareRequests from "./modules/shareRequests"
import * as weeks from "./modules/weeks";

export default createStore({
    modules: {
        lists,
        weeks,
        loading,
        shareRequests
    },
    plugins: process.env.NODE_ENV !== "production"
        ? [
            createLogger({
                actionFilter() {
                    return false;
                }
            })
        ]
        : []
})


export type VuexFunction<mutationObject> = {
    commit: (mutation: keyof mutationObject, value?: any) => void;
    dispatch: Function;
    getters: object;
}
