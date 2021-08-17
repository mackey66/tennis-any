const state = {
    masterNocache: false
};
 
const mutations = {
    /*login (state, payload) {
        state.token = payload;
    },
    logout (state) {
        state.token = null;
    },*/
    setMasterNocache(state, masterNocache) {
        masterNocache == !masterNocache
        console.log("store.masterNocache =", masterNocache)
    },
};
 
export default {
    namespaced: true,
    state,
    mutations
};