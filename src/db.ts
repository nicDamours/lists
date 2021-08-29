import { getFirestore, collection, onSnapshot, DocumentSnapshot } from 'firebase/firestore'
import { app } from "@/app"

// Get a Firestore instance
export const db = getFirestore(app)
