import "reflect-metadata";

import removeCurrentUserFromShare from "./remove-current-user-from-share";
import shareWithEmail from "./Functions/share-with-email";
import dependencies from "./Functions/lib/dependencies";
import acceptShareRequest from "./Functions/accept-share-request";
import unShareWithEmail from "./Functions/unshare-with-email";
import updateWeekSharingOnWeekUpdate from "./Hooks/update-week-sharing-on-week-update";

import * as functions from "firebase-functions";

dependencies();

exports.shareWithEmail = shareWithEmail;
exports.unshareWithEmail = unShareWithEmail;
exports.acceptShareRequest = acceptShareRequest;
exports.removeCurrentUserFromShare = removeCurrentUserFromShare;
exports.removeCurrentUserFromShare = removeCurrentUserFromShare;


exports.updateWeekSharingOnWeekUpdate = functions.firestore.document("/weeks/{weekId}").onWrite(updateWeekSharingOnWeekUpdate);
