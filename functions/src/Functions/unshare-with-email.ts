import * as functions from "firebase-functions";
import {getApp} from "../app-instance";
import {HttpsError} from "./lib/Errors/HttpsError";
import {SharingPayload} from "./lib/Interfaces/SharingPayload";
import {Container} from "./lib/Utils/Container";
import {app} from "firebase-admin";
import {WeekUnSharingPayload} from "./lib/Interfaces/Weeks/WeekUnSharingPayload";
import {IListUnSharingService} from "./lib/Interfaces/Lists/IListUnSharingService";
import {IUnSharingService} from "./lib/Interfaces/IUnSharingService";
import {IAllWeekUnSharingService} from "./lib/Interfaces/Weeks/IAllWeekUnSharingService";
import {ISingleWeekUnSharingService} from "./lib/Interfaces/Weeks/ISingleWeekUnSharingService";
import App = app.App;

const getServiceForShareType = (payload: SharingPayload, app: App): IUnSharingService<SharingPayload> => {
    if (payload.type === "list") {
        return Container.get<IListUnSharingService>("IListUnSharingService", app);
    } else {
        const weekPayload = payload as WeekUnSharingPayload;

        if (weekPayload.shareAllWeeks) {
            return Container.get<IAllWeekUnSharingService>("IAllWeekUnSharingService", app);
        } else {
            return Container.get<ISingleWeekUnSharingService>("ISingleWeekUnSharingService", app);
        }
    }
};


const unShareWithEmail = functions.https.onCall(async (data: any, context) => {
    const payload = JSON.parse(data.text);
    if (!context.auth) {
        throw new functions.https.HttpsError("failed-precondition",
            "This function must be called while authenticated");
    }

    try {
        const app = getApp();

        const service = getServiceForShareType(payload, app);

        await service.assertUnShareRequestPayloadIsValid(payload, context.auth?.uid);

        await service.revokeShareRequest(payload, context.auth?.uid);

        console.log("successfully unshared with user");
    } catch (e: unknown) {
        const messageCode = e instanceof HttpsError ? e.code : "internal";
        const err = e as Error;

        throw new functions.https.HttpsError(messageCode, err.message, err.stack);
    }
});

export default unShareWithEmail;
