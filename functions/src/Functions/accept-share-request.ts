import * as functions from "firebase-functions";
import {getApp} from "../app-instance";
import {SharingPayload} from "./lib/Interfaces/SharingPayload";
import {ISharingService} from "./lib/Interfaces/ISharingService";
import {Container} from "./lib/Utils/Container";
import {IListServiceSharing} from "./lib/Interfaces/Lists/IListServiceSharing";
import {ListSharingPayload} from "./lib/Interfaces/Lists/ListSharingPayload";
import {WeekSharingPayload} from "./lib/Interfaces/Weeks/WeekSharingPayload";
import {IAllWeeksSharingService} from "./lib/Interfaces/Weeks/IAllWeeksSharingService";
import {ISingleWeekSharingService} from "./lib/Interfaces/Weeks/ISingleWeekSharingService";
import {app} from "firebase-admin";
import {SharingRequestResponsePayload} from "./lib/Interfaces/ShareRequestResponsePayload";
import {HttpsError} from "./lib/Errors/HttpsError";
import App = app.App;

const getServiceForShareType = (payload: SharingPayload, app: App): ISharingService<SharingPayload, SharingRequestResponsePayload> => {
    if (payload.type === "list") {
        return Container.get<IListServiceSharing<ListSharingPayload, SharingRequestResponsePayload>>("IListServiceSharing", app);
    } else {
        const weekPayload = payload as WeekSharingPayload;

        if (weekPayload.shareAllWeeks) {
            return Container.get<IAllWeeksSharingService<WeekSharingPayload, SharingRequestResponsePayload>>("IAllWeeksSharingService", app);
        } else {
            return Container.get<ISingleWeekSharingService<WeekSharingPayload, SharingRequestResponsePayload>>("ISingleWeekSharingService", app);
        }
    }
};

const acceptShareRequest = functions.https.onCall(async (data: any, context) => {
    const payload = JSON.parse(data.text) as SharingRequestResponsePayload;
    if (!context.auth) {
        throw new functions.https.HttpsError("failed-precondition",
            "This function must be called while authenticated");
    }
    try {
        const app = getApp();

        const service = getServiceForShareType(payload, app);

        await service.assertShareRequestIsValid(payload, context.auth?.uid);

        await service.applyNewShare(payload, context.auth?.uid);

        const deleteResults = await app.firestore().doc(`/shareRequest/${payload.requestId}`).delete();

        return deleteResults.writeTime;
    } catch (e: unknown) {
        const messageCode = e instanceof HttpsError ? e.code : "internal";
        const err = e as Error;

        throw new functions.https.HttpsError(messageCode, err.message, err.stack);
    }
});


export default acceptShareRequest;
