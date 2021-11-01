import {computed} from "vue";
import {useStore} from "vuex";

export default function useLists() {
    const store = useStore();

    const lists = computed(() => store.getters['lists/lists']);

    const getListById = (id: string | number) => {
        return store.getters['lists/getListById'](id);
    }

    return {
        lists,
        getListById
    }
}
