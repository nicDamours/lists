import { getAuth } from 'firebase/auth'
import getAppInstance from "@/app";

// Get a Firebase auth instance
export default function getAuthInstance() {
    if(!('firebaseAuth' in window) || !(window as any).firebaseAuth) {
        (window as any).firebaseAuth = getAuth(getAppInstance())
    }

    return (window as any).firebaseAuth
}

