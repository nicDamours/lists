import * as functions from "firebase-functions";
import {getApp} from "../app-instance";

exports.updateWeekSharingOnWeekUpdate = functions.database.ref("/weeks").onCreate(async (snapshot) => {
    const original = snapshot.val();
    const app = getApp();
});
