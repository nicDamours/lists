// @ts

import firebase from 'firebase/app'
import 'firebase/firestore'

// Get a Firestore instance
export const db = (firebase
    .initializeApp({ projectId: process.env.VUE_APP_FIRESTORE_PROJECT_ID }) as any)
    .firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { TimeStamp, GeoPoint } = (firebase as any).firestore
export { TimeStamp, GeoPoint }

// if using Firebase JS SDK < 5.8.0
db.settings({ timestampsInSnapshots: true })
