import "reflect-metadata";

import unShareWithEmail from "./unshare-with-email";
import removeCurrentUserFromShare from "./remove-current-user-from-share";
import shareWithEmail from "./Functions/share-with-email";
import dependencies from "./Functions/lib/dependencies";
import acceptShareRequest from "./Functions/accept-share-request";

dependencies();

exports.shareWithEmail = shareWithEmail;
exports.unshareWithEmail = unShareWithEmail;
exports.acceptShareRequest = acceptShareRequest;
exports.removeCurrentUserFromShare = removeCurrentUserFromShare;
