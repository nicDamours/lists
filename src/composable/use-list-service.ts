import useLoading from "@/composable/use-loading";
import ListService from "@/services/ListService";
import {List} from "@/models/dtos/List";

export default function useListService() {
    const { callAsync} = useLoading();

    const updateList = async (list: List) => {
       return callAsync(ListService.updateList, list);
    }

    const deleteList = async (list: List) => {
        return callAsync(ListService.deleteList, list);

    }

    const addList = async (list: List) => {
        return callAsync(ListService.addList, list);
    }

    return {
        addList,
        updateList,
        deleteList,
    }
}
