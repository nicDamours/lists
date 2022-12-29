import {FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import ShareListRequest from "@/models/dtos/ShareListRequest";
import firebase from "firebase/compat";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import {Container} from "@/utils/Container";
import ShareAllWeekRequest from "@/models/dtos/ShareAllWeekRequest";
import ShareSingleWeekRequest from "@/models/dtos/ShareSingleWeekRequest";
import ShareRequest from "@/models/dtos/ShareRequest";
import parse from "date-fns/parse"
import DocumentData = firebase.firestore.DocumentData;

const createDTOForType = (id: string, data: DocumentData) => {
    if (data.type === "list") {
        return new ShareListRequest(id, data.targetId, data.targetEmail, data.authorEmail, data.authorId, data.listId, data.listName);
    } else {
        if (data.allWeeks) {
            return new ShareAllWeekRequest(id, data.targetId, data.targetEmail, data.authorEmail, data.authorId);
        } else {
            const startDate = parse(data.dates.startDate, "yyyy-MM-dd", new Date());
            const endDate = parse(data.dates.endDate, "yyyy-MM-dd", new Date());
            return new ShareSingleWeekRequest(id, data.targetId, data.targetEmail, data.authorEmail, data.authorId, startDate, endDate);
        }
    }
}

export const ShareRequestConverter: FirestoreDataConverter<ShareRequest> = {
    fromFirestore: function (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ShareRequest {
        const {auth} = Container.get<FirebaseAuthService>('FirebaseAuthService');
        const data = snapshot.data(options);

        const dto = createDTOForType(snapshot.id, data);


        if (auth.currentUser) {
            dto.isCurrentUserTheAuthor = data.authorId === auth.currentUser.uid;
        }

        return dto;
    },
    toFirestore: function (): DocumentData {
        return {}
    }
}
