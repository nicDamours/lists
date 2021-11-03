import {computed} from "vue";
import {useStore} from "vuex";

export default function useLists() {
    const store = useStore();

    const lists = computed(() => store.getters['lists/lists']);

    const getListById = (id: string | number) => {
        return store.getters['lists/getListById'](id);
    }

    const removeAllLists = async () => {
        return store.dispatch('lists/removeAllLists');
    }

    return {
        lists,
        getListById,
        removeAllLists
    }
}
