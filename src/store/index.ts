import { createStore } from 'vuex'
import {firestoreAction, vuexfireMutations} from "vuexfire";
import { db } from "@/db";

export default createStore({
  state: {
    lists: []
  },
  mutations: {
    ...vuexfireMutations
  },
  actions: {
    bindLists: firestoreAction(({ bindFirestoreRef }) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef('lists', db.collection('lists'))
    })
  },
  modules: {
  }
})
