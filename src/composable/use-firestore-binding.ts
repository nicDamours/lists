import {useStore} from "vuex";
import {FirestoreDataConverter, onSnapshot, Query} from "firebase/firestore";
import {MUTATION_NAME_ADD, MUTATION_NAME_DELETE, MUTATION_NAME_UPDATE} from "@/store/modules/firestoreModule";
import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import useLoading from "@/composable/use-loading";
import firebase from "firebase/compat";
import Unsubscribe = firebase.Unsubscribe;

export interface FireStoreBindingOptions<S extends IdentifiableRecord> {
    collectionName?: string;
    storePath?: string;
    converter?: FirestoreDataConverter<S> | null;
}

export default function useFirestoreBinding() {
    const store = useStore();

    const {startLoading, stopLoading} = useLoading();

    const registerBindings = <S extends IdentifiableRecord>(storeProperty: string, collectionQueries: Iterable<Query>, options: FireStoreBindingOptions<S>, callback: ((data: any) => Unsubscribe[]) | null = null) => {
        const allOptions: FireStoreBindingOptions<S> = {
            collectionName: storeProperty,
            storePath: "",
            converter: null,
            ...options
        };

        const unSubscribeFunctions: Unsubscribe[] = [];

        for (const collectionQuery of collectionQueries) {
            if (allOptions.converter) {
                collectionQuery.withConverter(allOptions.converter);
            }

            unSubscribeFunctions.push(onSnapshot(collectionQuery, async (snapshot) => {
                await startLoading()

                snapshot.docChanges().forEach((change) => {
                    let data;
                    if (allOptions.converter) {
                        data = allOptions.converter.fromFirestore(change.doc);
                    } else {
                        data = change.doc.data();
                    }

                    if (change.type === "added") {
                        store.commit(`${allOptions.storePath}${MUTATION_NAME_ADD}${storeProperty.toUpperCase()}`, data, {root: true})
                    }
                    if (change.type === "modified") {
                        store.commit(`${allOptions.storePath}${MUTATION_NAME_UPDATE}${storeProperty.toUpperCase()}`, {
                            id: change.doc.id,
                            value: data
                        }, {root: true})
                    }
                    if (change.type === "removed") {
                        store.commit(`${allOptions.storePath}${MUTATION_NAME_DELETE}${storeProperty.toUpperCase()}`, change.doc.id, {root: true})
                    }
                });

                if (callback !== null) {
                    const data: Record<string, unknown>[] = [];

                    snapshot.forEach(doc => {
                        data.push(doc.data())
                    })

                    const callbackUnsubscribeFunctions: Unsubscribe[] = [];

                    if (callbackUnsubscribeFunctions.length > 0) {
                        for (const callbackUnsubscribeFunction of callbackUnsubscribeFunctions) {
                            callbackUnsubscribeFunction();
                        }
                    }

                    callbackUnsubscribeFunctions.push(...callback(data));
                }

                await stopLoading();
            }));
        }

        return unSubscribeFunctions;
    }

    const registerDynamicBindings = (collectionQueries: Iterable<Query>, callback: (data: any) => Unsubscribe[]) => {
        const unSubscribeFunctions: Unsubscribe[] = [];

        for (const collectionQuery of collectionQueries) {
            unSubscribeFunctions.push(onSnapshot(collectionQuery, async (snapshot) => {
                await startLoading()
                const data: Record<string, unknown>[] = [];

                snapshot.forEach(doc => {
                    data.push(doc.data())
                })

                const callbackUnsubscribeFunctions: Unsubscribe[] = [];

                if (callbackUnsubscribeFunctions.length > 0) {
                    for (const callbackUnsubscribeFunction of callbackUnsubscribeFunctions) {
                        callbackUnsubscribeFunction();
                    }
                }

                callbackUnsubscribeFunctions.push(...callback(data));

                await stopLoading();
            }));
        }
    }

    return {
        registerBindings,
        registerDynamicBindings
    }
}
