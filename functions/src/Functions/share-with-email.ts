import * as functions from "firebase-functions";
import {getApp} from "../app-instance";
import {Container} from "./lib/Utils/Container";
import {app} from "firebase-admin";
import {HttpsError} from "./lib/Errors/HttpsError";
import {ISharingService} from "./lib/Interfaces/ISharingService";
import {IAllWeeksSharingService} from "./lib/Interfaces/Weeks/IAllWeeksSharingService";
import {ISingleWeekSharingService} from "./lib/Interfaces/Weeks/ISingleWeekSharingService";
import {WeekSharingPayload} from "./lib/Interfaces/Weeks/WeekSharingPayload";
import {SharingPayload} from "./lib/Interfaces/SharingPayload";
import {IListServiceSharing} from "./lib/Interfaces/Lists/IListServiceSharing";
import {ListSharingPayload} from "./lib/Interfaces/Lists/ListSharingPayload";
import {SharingRequestResponsePayload} from "./lib/Interfaces/ShareRequestResponsePayload";
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

const shareWithEmail = functions.https.onCall(async (data: any, context) => {
    const payload = JSON.parse(data.text);
    if (!context.auth) {
        throw new functions.https.HttpsError("failed-precondition",
            "This function must be called while authenticated");
    }

    try {
        const app = getApp();

        const service = getServiceForShareType(payload, app);

        await service.assertShareRequestPayloadIsValid(payload, context.auth?.uid);

        const output = await service.createNewSharingRequest(payload, context.auth?.uid);

        const createdRequest = await output.get();

        return createdRequest.id;
    } catch (e: unknown) {
        const messageCode = e instanceof HttpsError ? e.code : "internal";
        const err = e as Error;

        throw new functions.https.HttpsError(messageCode, err.message, err.stack);
    }
});

export default shareWithEmail;
