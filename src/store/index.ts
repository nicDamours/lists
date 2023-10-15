import {createLogger, createStore} from 'vuex'
import * as lists from "./modules/lists";
import * as loading from "./modules/loading"
import * as shareRequests from "./modules/shareRequests"
import * as weeks from "./modules/weeks";
import * as weekSharing from "./modules/weekSharing"
import * as sharedWeeks from "./modules/sharedWeeks"

export default createStore({
    modules: {
        lists,
        weeks,
        loading,
        weekSharing,
        sharedWeeks,
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

type VuexDispatchContext = {
    commit: (mutation: string, ...values: any[]) => void;
}

export type VuexFunction<mutationObject> = {
    commit: (mutation: keyof mutationObject, value?: any) => void;
    dispatch: (Context: VuexDispatchContext, ...args: any[]) => Promise<any>;
    getters: { [key: string]: any };
}
