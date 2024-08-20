import store from "@/store";
import vuex from "vuex";

export default function useRealStore() {
    jest.unmock("vuex");

    const originalState = JSON.parse(JSON.stringify(store.state));

    (vuex as any).useStore = jest.fn().mockReturnValue(store);

    const storeConfig = {
        global: {
            plugins: [store]
        }
    };

    const mockRealStoreAccess = () => {
        return jest.doMock("vuex", () => ({
            useStore: () => store
        }));
    };

    const resetRealStore = () => {
        store.replaceState(originalState);
    };

    return {
        store,
        storeConfig,
        resetRealStore,
        mockRealStoreAccess
    };
}
