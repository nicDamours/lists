/*
 * @jest-environment node
 */
const admin = require('firebase-admin');

const firebaseTest = require("firebase-functions-test")({
    apiKey: process.env.VUE_APP_FIRESTORE_API_KEY,
    projectId: process.env.VUE_APP_FIRESTORE_PROJECT_ID,
});

describe("addParticipantOnBillGroupCreate test", () => {
    const addParticipantOnBillGroupCreateFn = require("../../src/Hooks/add-participant-on-bill-group-create")

    afterEach(() => {
        firebaseTest.cleanup();
    });

    it("should create a bill participant with the current user", async () => {
        // given a current user
        firebaseTest.auth.makeUserRecord({
            uid: "someUid",
            email: "irrelevent@irrelevent.com"
        });

        // and a payload to create a new bill group
        const givenID = "123123";

        const documentSnapshot = firebaseTest.firestore.makeDocumentSnapshot({
            name: "irrelevent"
        }, `document/billGroups/${givenID}`)

        // when running the function
        const wrapped = firebaseTest.wrap(addParticipantOnBillGroupCreateFn);
        await wrapped(documentSnapshot);

        // then the newly created group should contain the current user as a participant
        const createdBillGroup = await admin.firestore.ref(`document/billGroups/${givenID}`);
    })
})
