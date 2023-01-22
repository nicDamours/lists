import {useStore} from "vuex";
import {computed} from "vue";
import ShareRequestService from "@/services/ShareRequestService";
import useLoading from "@/composable/use-loading";
import ShareRequest from "@/models/dtos/ShareRequest";

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

    return {
        shareRequests,
        deleteRequest,
        emptyShareRequest
    }
}
