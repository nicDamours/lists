import {BillTransaction} from "@/models/dtos/Bills/BillTransaction";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import {FirebaseDatabaseService} from "@/services/FirebaseDatabaseService";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";
import {BillGroupConverter} from "@/models/converter/Bill/BillGroupConverter";
import {doc, setDoc} from "firebase/firestore";

export const BillTransactionService = {
    async createNewTransaction(group: BillGroup, transaction: BillTransaction) {
        const authenticationService = Container.get<FirebaseAuthService>('FirebaseAuthService').auth;

        const databaseInstance = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

        const currentUser = authenticationService.currentUser;

        if (!currentUser) {
            throw new Error("Authentication required")
        }

        const currentUserParticipant = new BillParticipant(currentUser.uid, currentUser.email);
        currentUserParticipant.displayName = currentUser.displayName

        transaction.creator = currentUserParticipant;

        group.transactions.push(transaction);

        const data = BillGroupConverter.toFirestore(group);

        console.log('data', data, group.id);
        const databaseDoc = doc(databaseInstance, "billGroups", group.id);
        return setDoc(databaseDoc, data, {merge: true})
    }
}
