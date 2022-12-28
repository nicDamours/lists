import "reflect-metadata";

import shareListWithEmail from "./share-list-with-email";
import unShareWithEmail from "./unshare-with-email";
import acceptShareRequest from "./accept-share-request";
import removeCurrentUserFromShare from "./remove-current-user-from-share";
import shareWeekWithEmail from "./Functions/share-week-with-email";

exports.shareWithEmail = shareListWithEmail;
exports.shareWeekWithEmail = shareWeekWithEmail;
exports.unshareWithEmail = unShareWithEmail;
exports.acceptShareRequest = acceptShareRequest;
exports.removeCurrentUserFromShare = removeCurrentUserFromShare;
