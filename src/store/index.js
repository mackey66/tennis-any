import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"
//import auth from "./modules/auth"

/*const initialState = {
  masterNocache: true
}*/

const state = {
  noCache: false,
  getOption: { source: 'cache' },
  name: "",
  topTitle: "",
  officialUrl: "",
  officialTitle: "",
  opas: false,
  config: "",
  invite: false,
  isAdmin: false
};


export default createStore({
  //state: initialState,
  state: state,
  mutations: {
    setNocache(state, value) {
			state.noCache = value;
      if (value) {
        state.getOption = { source: 'server' }
      } else {
        state.getOption = { source: 'cache' }
      }
		},
    setName(state, value) {
			state.name = value
		},
    setTopTitle(state, value) {
			state.topTitle = value
		},
    setOfficialUrl(state, value) {
			state.officialUrl = value
		},
    setOfficialTitle(state, value) {
			state.officialTitle = value
		},
    setOpas(state, value) {
			state.opas = value
		},
    setConfig(state, value) {
			state.config = value
		},
    setEntryNum(state, num) {
			state.entryNum = num
		},
    setInvite(state, value) {
			state.invite = value;
		},
    setAdmin(state, value) {
			state.isAdmin = value;
		},
  },
  actions: {
  },
  /*modules: {
    auth,
  },
  strict: true,*/
  plugins: [createPersistedState({
    key: 'TennisApp',

    storage: window.sessionStorage
  })]
})

/*
//import { createStore } from "vuex";
//import createPersistedState from "vuex-persistedstate"

const state = {
  masterNocache: false
};
const mutations = {
  setMasterNocache(state, masterNocache) {
    masterNocache == !masterNocache;
    console.log("store.masterNocache =", masterNocache);
  }
};
const actions = {
};
const plugins = [createPersistedState({
  key: 'TennisApp',
  paths: ['masterNocache'],
  storage: window.sessionStorage
})]

export default createStore({
  state,
  actions,
  mutations,
  plugins
});
*/
