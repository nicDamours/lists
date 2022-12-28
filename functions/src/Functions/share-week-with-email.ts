import * as functions from "firebase-functions";
import {getApp} from "../app-instance";
import {IWeekSharingService} from "./lib/Interfaces/IWeekSharingService";
import {Container} from "./lib/Utils/Container";
import {ISingleWeekSharingService} from "./lib/Interfaces/ISingleWeekSharingService";
import {IAllWeeksSharingService} from "./lib/Interfaces/IAllWeeksSharingService";

const getServiceForShareType = (isSharingAllWeeks: boolean): IWeekSharingService => {
  const app = getApp();

  if (isSharingAllWeeks) {
    return Container.get<IAllWeeksSharingService>("IAllWeeksSharingService", app);
  } else {
    return Container.get<ISingleWeekSharingService>("ISingleWeekSharingService", app);
  }
};

const shareWeekWithEmail = functions.https.onCall(async (data: any, context) => {
  const payload = JSON.parse(data.text);
  if (!context.auth) {
    throw new functions.https.HttpsError("failed-precondition",
        "This function must be called while authenticated");
  }

  const {shareAllWeeks} = payload;


  const service = getServiceForShareType(shareAllWeeks);

  const sharingExists = await service.sharingAlreadyExists(payload);

  if (sharingExists) {
    throw new functions.https.HttpsError("failed-precondition",
        service.getExistingSharingError());
  }

  return service.createNewSharingRequest(payload);
});

export default shareWeekWithEmail;
