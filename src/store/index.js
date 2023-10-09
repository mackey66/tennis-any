import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"
//import auth from "./modules/auth"

/*const initialState = {
  masterNocache: true
}*/

const state = {
  noCache: false,
  getOption: { source: 'server' },
  name: "",
  topTitle: "",
  officialUrl: "",
  officialTitle: "",
  opas: false,
  config: "",
  invite: false,
  isAdmin: false,
  minutesPerSession: 0,
  weekdayRatesPerHour: 0,
  holidayRatesPerHour: 0,
  sessionsPerDay: 0,
  latitude: 0,
  longitude: 0,
  memberCheckName: "",
  lineNo: 1,
  thursdayMeeting: false,
  seaside: false,
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
    setMinutesPerSession(state, value) {
			state.minutesPerSession = value
		},
    setWeekdayRatesPerHour(state, value) {
			state.weekdayRatesPerHour = value
		},
    setHolidayRatesPerHour(state, value) {
			state.holidayRatesPerHour = value
		},
    setSessionsPerDay(state, value) {
			state.sessionsPerDay = value
		},
    setLatitude(state, value) {
			state.latitude = value
		},
    setLongitude(state, value) {
			state.longitude = value
		},
    setMemberCheckName(state, value) {
			state.memberCheckName = value
		},
    resetLineNo(state) {
			state.lineNo = 1
		},
    addLineNo(state, value) {
      let result = value++
			state.lineNo = result
		},
    setThursdayMeeting(state, value) {
			state.thursdayMeeting = value
		},
    setSeaside(state, value) {
			state.seaside = value
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
