//import '@babel/polyfill'
//import 'mutationobserver-shim'
//import Vue from 'vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'firebase/firestore'
<<<<<<< HEAD

// bootstrap-vue読み込み
=======
//require('firebase/firestore')
/*
import VuejsDialog from 'vuejs-dialog';
import VuejsDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
*/

// bootstrap-vue読み込み
//import './plugins/bootstrap-vue'
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
/* ここから */
//import BootstrapVue from 'bootstrap-vue' // bootstrap-vue v2.21.2はVue3未対応
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
<<<<<<< HEAD
=======
//App.use(BootstrapVue)
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
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

<<<<<<< HEAD
library.add(fas)

// Firebase設定
let firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
=======
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
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
};

firebase.initializeApp(firebaseConfig);

<<<<<<< HEAD
=======
/*const store = createStore({
  modules: modules, 
  plugins: [createPersistedState({storage: window.sessionStorage})]

})*/

>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
//const projectAuth = firebase.auth()
const db = firebase.firestore()
//const timestamp = firebase.firestore.FieldValue.serverTimestamp

// The default cache size threshold is 40 MB. Configure "cacheSizeBytes"
// for a different threshold (minimum 1 MB) or set to "CACHE_SIZE_UNLIMITED"
// to disable clean-up.
firebase.firestore().settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

<<<<<<< HEAD
// テストで一時的にキャッシュをクリアしたい場合は以下を有効にする（enablePersistence()の前に行う）
// Safariやスマホブラウザのログイン時のキャッシュがおかしいので仕方なしに有効に #2023-05-18
firebase.firestore().clearPersistence()

// キャッシュを有効にする
=======
// テストでキャッシュをクリアしたい場合は以下を有効に
//firebase.firestore().clearPersistence()

>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
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

<<<<<<< HEAD

=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
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

<<<<<<< HEAD
var app = createApp(App).use(store).use(router).use(i18n)/*.use(VuejsDialog).use(BootstrapVue)*/ //.mount('#app'); // bootstrap-vue v2.21.2はVue3未対応

app.component('fa', FontAwesomeIcon );
app.mount('#app');

=======

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
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
export {db}
