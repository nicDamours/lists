import {useStore} from "vuex";
import {computed} from "vue";
import ShareRequestService from "@/services/ShareRequestService";
import useLoading from "@/composable/use-loading";
import ShareRequest from "@/models/dtos/ShareRequest";
import ShareListRequest from "@/models/dtos/ShareListRequest";
import {List} from "@/models/dtos/List";

export default function useShareRequests() {
    const store = useStore();
    const { callAsync } = useLoading();
    const shareRequests = computed(() => store.getters['shareRequests/shareRequests'])

    const deleteRequest = async (request: ShareRequest) => {
        return callAsync(ShareRequestService.deleteRequest, request)
    }

    const emptyShareRequest = async () => {
        await store.dispatch("shareRequests/emptyShareRequest");
    }

    const getShareRequestsForList = (list: List): Array<ShareRequest> => {
        const storeRequests: Array<ShareRequest> = store.getters['shareRequests/shareRequests'];
        return storeRequests.filter(request => {
            return request instanceof ShareListRequest && request.listId === list.id
        })
    }

    return {
        shareRequests,
        deleteRequest,
        emptyShareRequest,
        getShareRequestsForList
    }
}
