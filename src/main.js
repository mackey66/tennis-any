//import '@babel/polyfill'
//import 'mutationobserver-shim'
//import Vue from 'vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'firebase/firestore'
//require('firebase/firestore')
/*
import VuejsDialog from 'vuejs-dialog';
import VuejsDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
*/

// bootstrap-vue読み込み
//import './plugins/bootstrap-vue'
/* ここから */
//import BootstrapVue from 'bootstrap-vue' // bootstrap-vue v2.21.2はVue3未対応
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
//App.use(BootstrapVue)
/* ここまで */

// Firebase読み込み
//import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// FirebaseUI読み込み
//import firebaseui from 'firebaseui-ja'
import 'firebaseui-ja/dist/firebaseui.css';

import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { createI18n } from 'vue-i18n'

//import { createStore } from 'vuex';
//import createPersistedState from 'vuex-persistedstate';

library.add(fas)

//Vue.config.productionTip = false

// Firebase設定
let firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx.firebaseapp.com",
  databaseURL: "https://xxx.firebaseio.com", // Firebase Consoleにない！
  projectId: "tennis-any",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx",
  measurementId: "xxx"
};

firebase.initializeApp(firebaseConfig);

/*const store = createStore({
  modules: modules, 
  plugins: [createPersistedState({storage: window.sessionStorage})]

})*/

//const projectAuth = firebase.auth()
const db = firebase.firestore()
//const timestamp = firebase.firestore.FieldValue.serverTimestamp

// The default cache size threshold is 40 MB. Configure "cacheSizeBytes"
// for a different threshold (minimum 1 MB) or set to "CACHE_SIZE_UNLIMITED"
// to disable clean-up.
firebase.firestore().settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// テストでキャッシュをクリアしたい場合は以下を有効に
//firebase.firestore().clearPersistence()

firebase.firestore().enablePersistence({synchronizeTabs:true})
.catch(function(err) {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
});

const i18n = createI18n({
  locale: 'en',
  messages: {
    // 翻訳用のjson
    ja : require('./lang/ja.json'),
    en : require('./lang/en.json'),
    zhCN : require('./lang/zhCN.json'),
    zhTW : require('./lang/zhTW.json'),
    ru : require('./lang/ru.json'),
    de : require('./lang/de.json'),
    fr : require('./lang/fr.json'),
    nl : require('./lang/nl.json'),
    es : require('./lang/es.json'),
    pt : require('./lang/pt.json'),
    it : require('./lang/it.json'),
    ar : require('./lang/ar.json'),
    ko : require('./lang/ko.json'),
    sr : require('./lang/sr.json'),
    cs : require('./lang/cs.json'),
    ro : require('./lang/ro.json'),
    hr : require('./lang/hr.json'),
    sv : require('./lang/sv.json'),
    sk : require('./lang/sk.json')
  }
});


//createApp(App).use(store).use(router).mount('#app');
var app = createApp(App).use(store).use(router).use(i18n)/*.use(VuejsDialog).use(BootstrapVue)*/ //.mount('#app'); // bootstrap-vue v2.21.2はVue3未対応
/*
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
*/
app.component('fa', FontAwesomeIcon );
app.mount('#app');

//export const db = firebase.firestore();
//export {projectAuth, db, timestamp}
export {db}
