import {useStore} from "vuex";
import {collection, onSnapshot, FirestoreDataConverter, query } from "firebase/firestore";
import {db} from "@/db";
import {
    MUTATION_NAME_ADD,
    MUTATION_NAME_DELETE,
    MUTATION_NAME_UPDATE
} from "@/store/modules/firestoreModule";
import {onBeforeUnmount} from "vue";
import {IdentifiableRecord} from "@/models/Interfaces/IdentifiableRecord";

export interface FireStoreBindingOptions<S extends IdentifiableRecord> {
    collectionName?: string;
    storePath?: string;
    converter?: FirestoreDataConverter<S> | null;
}

export default function useFirestoreBinding<S extends IdentifiableRecord>(storeProperty: string, options: FireStoreBindingOptions<S>) {
    const store = useStore();
    const allOptions: FireStoreBindingOptions<S> = {
        collectionName: storeProperty,
        storePath: "",
        converter: null,
        ...options
    };

    const collectionQuery = collection(db, allOptions.collectionName as string);
    if(allOptions.converter) {
        collectionQuery.withConverter(allOptions.converter);
    }

    const unsubscribe = onSnapshot(collectionQuery, async (snapshot) => {
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
    });

    onBeforeUnmount(() => {
        unsubscribe();
    })
}
