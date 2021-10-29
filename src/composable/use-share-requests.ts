import {useStore} from "vuex";
import {computed} from "vue";
import ShareRequest from "@/models/dtos/ShareRequest";
import ShareRequestService from "@/services/ShareRequestService";
import useLoading from "@/composable/use-loading";

export default function useShareRequests() {
    const store = useStore();
    const { callAsync } = useLoading();
    const shareRequests = computed(() => store.getters['shareRequests/shareRequests'])

    const deleteRequest = async (request: ShareRequest) => {
        return callAsync(ShareRequestService.deleteRequest, request)
    }

    return {
        shareRequests,
        deleteRequest
    }
}
