import store from "@/store";
import vuex from "vuex";

export default function useRealStore() {
    vi.unmock("vuex");

    const originalState = JSON.parse(JSON.stringify(store.state));

    (vuex as any).useStore = vi.fn().mockReturnValue(store);

    const storeConfig = {
        global: {
            plugins: [store]
        }
    };

    const mockRealStoreAccess = () => {
        return vi.doMock("vuex", () => ({
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
