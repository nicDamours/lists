import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import {Container} from "@/utils/Container";
import {FirebaseDatabaseService} from "@/services/FirebaseDatabaseService";
import {addDoc, collection} from "firebase/firestore";
import {BillGroupConverter} from "@/models/converter/Bill/BillGroupConverter";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";

export const BillGroupService = {
    async addNewBillGroup(group: BillGroup) {
        const authenticationService = Container.get<FirebaseAuthService>('FirebaseAuthService').auth;

        const databaseInstance = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

        const currentUser = authenticationService.currentUser;

        if (!currentUser) {
            throw new Error("Authentication required")
        }

        const currentUserParticipant = new BillParticipant(currentUser.uid, currentUser.email);
        currentUserParticipant.displayName = currentUser.displayName

        group.participants = [currentUserParticipant]

        const data = BillGroupConverter.toFirestore(group);
        return addDoc(collection(databaseInstance, "billGroups"), data)
    }
}
