import {Container} from "@/utils/Container";
import {FirebaseDatabaseService} from "@/services/FirebaseDatabaseService";
import {deleteDoc, doc} from "firebase/firestore";
import ShareRequest from "@/models/dtos/ShareRequest";

const ShareRequestService = {
    async deleteRequest(request: ShareRequest) {
        const databaseInstance = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

        return deleteDoc(doc(databaseInstance, "shareRequest", request.id))
    }
}

export default ShareRequestService
