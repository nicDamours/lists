import { createStore } from 'vuex'
import * as lists from "./modules/lists";

export default createStore({
  modules: {
    lists
  }
})


export type VuexFunction = {
  commit: Function;
  dispatch: Function;
  getters: object;
}
