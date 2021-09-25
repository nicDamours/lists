import {useStore} from "vuex";
import {FirestoreDataConverter, onSnapshot, Query} from "firebase/firestore";
import {MUTATION_NAME_ADD, MUTATION_NAME_DELETE, MUTATION_NAME_UPDATE} from "@/store/modules/firestoreModule";
import {onBeforeUnmount} from "vue";
import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";
import useLoading from "@/composable/use-loading";

export interface FireStoreBindingOptions<S extends IdentifiableRecord> {
    collectionName?: string;
    storePath?: string;
    converter?: FirestoreDataConverter<S> | null;
}

export default function useFirestoreBinding<S extends IdentifiableRecord>() {
    const store = useStore();

    const { startLoading, stopLoading } = useLoading();

    const registerBindings = (storeProperty: string, collectionQuery: Query, options: FireStoreBindingOptions<S>) => {
        const allOptions: FireStoreBindingOptions<S> = {
            collectionName: storeProperty,
            storePath: "",
            converter: null,
            ...options
        };

        if(allOptions.converter) {
            collectionQuery.withConverter(allOptions.converter);
        }

        const unsubscribe = onSnapshot(collectionQuery, async (snapshot) => {
            await startLoading()

            snapshot.docChanges().forEach((change) => {
                let data;
                if(allOptions.converter) {
                    data =  allOptions.converter.fromFirestore(change.doc);
                } else {
                    data = change.doc.data();
                }

                if (change.type === "added") {
                    store.commit(`${allOptions.storePath}${MUTATION_NAME_ADD}${storeProperty.toUpperCase()}`, data, { root: true})
                }
                if (change.type === "modified") {
                    store.commit(`${allOptions.storePath}${MUTATION_NAME_UPDATE}${storeProperty.toUpperCase()}`, {
                        id: change.doc.id,
                        value: data
                    }, { root: true})
                }
                if (change.type === "removed") {
                    store.commit(`${allOptions.storePath}${MUTATION_NAME_DELETE}${storeProperty.toUpperCase()}`, change.doc.id, { root: true})
                }
            });

            await stopLoading();
        });

        onBeforeUnmount(() => {
            unsubscribe();
        })
    }

    return {
        registerBindings
    }
}
