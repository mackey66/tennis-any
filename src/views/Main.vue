<template>
<<<<<<< HEAD
    <div v-if="!notMember" class='main'><Menu></Menu>
=======
    <div class='main'><Menu></Menu>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
        <div class="container-fluid">
            <h4>{{ $store.state.topTitle }} {{ format(today, 'MMM do (E)', {locale: locale}) }}</h4>
            <div class="container-fluid">
                <div v-if='isLogin' class="col-12">
                    <fa icon="baseball-ball" />
                        {{ $t("Hello,") }}{{loginUser.displayName}} {{ $t("さん") }} {{ $t("people_") }} {{ entryNum }} {{ $t("on board.") }}
                </div>
                <div class="row">
<<<<<<< HEAD
                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block fas-user' @click="goCourtDaily()"><fa icon="th-large" />&ensp;{{ $t("Today's Court") }}</button>
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goAttendance()">
                            <fa icon="clipboard" />&ensp;{{ $t("Entry") }}&ensp;<span v-if='entryNum > 0' class="badge bg-danger">{{ entryNum }}</span>
                        </button>
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goGameEntries()">
                            <fa icon="running" />&ensp;{{ $t("Game") }}&ensp;<span v-if='gameNum > 0' class="badge bg-danger">{{ gameNum }}</span>&ensp;<span v-if='waitingGameNum > 0' class="badge bg-secondary">{{ waitingGameNum }}</span>
                        </button>
=======
                    
                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goAttendance()"><fa icon="clipboard" />&ensp;{{ $t("Entry") }}</button>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
<<<<<<< HEAD
                        <button class='btn btn-primary btn-block' @click="goFinishedGame()">
                            <fa icon="couch" />&ensp;{{ $t("Finished games") }}&ensp;<span v-if='finishedGameNum > 0' class="badge bg-danger">{{ finishedGameNum }}</span>
                        </button>
=======
                        <button class='btn btn-primary btn-block' @click="goGameEntries()"><fa icon="running" />&ensp;{{ $t("Game") }}</button>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
<<<<<<< HEAD
                        <button class='btn btn-primary btn-block' @click="goMessages()"><fa icon="comment" />&ensp;{{ $t("Messages") }}</button>
=======
                        <button class='btn btn-primary btn-block' @click="goFinishedGame()"><fa icon="couch" />&ensp;{{ $t("Finished games") }}</button>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
<<<<<<< HEAD
                        <button class='btn btn-primary btn-block' @click="goSchedule()">
                            <fa icon="calendar-alt" />&ensp;{{ $t("Schedule") }}&ensp;<span v-if='scheduleNum > 0' class="badge bg-danger">{{ scheduleNum }}</span>
                        </button>
=======
                        <button class='btn btn-primary btn-block' @click="goSchedule()"><fa icon="calendar-alt" />&ensp;{{ $t("Schedule") }}</button>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goRanking()"><fa icon="trophy" />&ensp;{{ $t("Ranking") }}</button>
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block fas-user' @click="goMember()"><fa icon="address-card" />&ensp;{{ $t("Member") }}</button>
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block fas-user' @click="goOfficialSite()"><fa icon="image" />&ensp;{{ $store.state.officialTitle }}</button>
                    </div>

                    <div v-if='configs' class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div v-if='configs' class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block fas-user' @click="goConfigSelect()"><fa icon="exchange-alt" />&ensp;グループ変更</button>
                    </div>

                    <div v-if='$store.state.isAdmin' class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div v-if='$store.state.isAdmin' class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block fas-user' @click="goMaintenance()"><fa icon="wrench" />&ensp;{{ $t("Maintenance") }}</button>
                    </div>
                    
                    <div class="col-12 menubtn">
<<<<<<< HEAD
                        <input class="form-check-input" type="checkbox" id="flexCheckChecked" v-model="noCache" @change="changedNocache(noCache)">
=======
                        <input class="form-check-input" type="checkbox" id="flexCheckChecked" v-model="noCache">
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                        <label class="form-check-label" for="flexCheckChecked">
                            {{ $t("Do not use the cache") }}
                        </label>
                    </div>
                </div>
                
            </div>
            <div class="margin"></div>
            <div class="message">
                <div class="row">
                    <div class="col-sm-2 col-lg-3"></div>
                    <div class="col-sm-8 col-lg-6">
                        <table class="table">
                            <tbody>
                                <tr>
<<<<<<< HEAD
                                    <th class="width120">{{ $t("Message") }}</th>
                                    <td>{{ dailyMessageText }}</td>
                                </tr>
                                <tr>
                                    <th class="width120">
                                        <div v-if="weatherCode >= 0 && weatherCode < 2"><fa icon="sun" />&ensp;{{ $t("Weather") }}</div>
                                        <div v-else-if="weatherCode == 2"><fa icon="cloud-sun" />&ensp;{{ $t("Weather") }}</div>
                                        <div v-else-if="weatherCode == 3"><fa icon="cloud" />&ensp;{{ $t("Weather") }}</div>
                                        <div v-else-if="weatherCode >= 50 && weatherCode < 60"><fa icon="cloud-sun-rain" />&ensp;{{ $t("Weather") }}</div>
                                        <div v-else-if="weatherCode >= 60 && weatherCode < 99"><fa icon="umbrella" />&ensp;{{ $t("Weather") }}</div>
                                        <div v-else>{{ $t("Weather") }}</div>    
                                    </th>
                                    <td>{{ weather }}</td>
                                </tr>   
=======
                                    <th class="width120"><fa icon="sun" />&ensp;{{ $t("Weather") }}</th>
                                    <td>{{ weather }}</td>
                                    <!--<td class="width70">
                                        <button class='btn btn-primary btn-sm ' @click='editWeather()'>
                                            編集
                                        </button>
                                    </td>-->
                                </tr>
                                <tr>
                                    <th class="width120">{{ $t("Message") }}</th>
                                    <td>{{ dailyMessageText }}</td>
                                    <!--<td class="width70">
                                        <button class='btn btn-primary btn-sm' @click='editDailyMessage()'>
                                            編集
                                        </button>
                                    </td>-->
                                </tr>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import Menu from '@/components/Menu.vue'
    import { db } from "../main";
    import { format } from 'date-fns'
    import { ja, enUS, zhCN, zhTW, ru, de, fr, nl, es, pt, it, arSA, ko, sr, cs, ro, hr, sv, sk } from 'date-fns/locale'
    //import Vue from 'vue'
    //import 'vue-awesome/icons'
    //import Icon from 'vue-awesome/components/Icon'
    //Vue.component('v-icon', Icon)

    export default {
        name: 'Main',
        components: {
            Menu
            //'v-icon': Icon
        },
        computed: {
            noCache: {
                get: function() {
                    return this.$store.state.noCache
                },
                set: function(value) {
                    this.$store.commit('setNocache', value)
                }              
            }   
        },
        data() {
            return {
                isLogin: false,
                loginUser: null,
                entryNum: null,
<<<<<<< HEAD
                scheduleNum: 0,
                gameNum: 0,
                finishedGameNum: 0,
                waitingGameNum: 0,
                today: new Date(),
                weather: null,
                weatherCode: null,
=======
                today: new Date(),
                weather: null,
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                dailyMessage: null,
                dailyMessageText: null,
                locale: ja,
                format: format,
                lastGameDate: new Date(),
<<<<<<< HEAD
                configs: false,
                notMember: true
            };
        },
        mounted() {
            console.log("mounted");
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(async user => {
                console.log("onAuthStateChanged")
                this.isLogin = true;
                this.loginUser = user;
                /*
                var user_ = await db.collection('members').doc(this.loginUser.uid).get({
                    source: 'cache',
                });
                console.log("fromCache : " + user_.metadata.fromCache);
                */
                var ref = db.collection('members').doc(this.loginUser.uid);
                try {
                    await ref.get({
                        source: 'cache',
                    });
                    console.log("cache")
                }
                    catch (e) {
                    await ref.get({
                        source: 'server',
                    });
                    console.log("server")
                }
                
                db.collection("members").where("userUid", "==", this.loginUser.uid)
                    .get(this.source)
=======
                configs: false
            };
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
                db.collection("members").where("userUid", "==", this.loginUser.uid)
                    .get()
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data()
                            d.id = doc.id                        
                            array.push(d)
                            console.log(d.id)
                        });
                        // ユーザデータがなければ招待コード画面に遷移
                        if (array.length == 0) { 
<<<<<<< HEAD
                            this.notMember = false;
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                            this.$router.push(`/invite`);
                            return
                        }
                        // ユーザデータが1つだったら
                        if (array.length == 1) {
                            console.log("config", array[0].config)
<<<<<<< HEAD
                            this.notMember = false;
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                            // ユーザのconfigフィールドがあれば
                            if (array[0].config) {
                                this.$store.commit('setConfig', array[0].config)
                                this.$store.commit('setAdmin', array[0].admin)
                                // configを読んで
                                var docRef = db.collection("configs").doc(array[0].config);
<<<<<<< HEAD
                                docRef.get(this.source).then((doc) => {
                                    if (doc.exists) {
                                        console.log("doc.exists")
=======
                                docRef.get().then((doc) => {
                                    if (doc.exists) {
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                                        // Storeに値をセット
                                        this.$store.commit('setName', doc.data().name)
                                        this.$store.commit('setTopTitle', doc.data().topTitle)
                                        this.$store.commit('setOfficialUrl', doc.data().officialUrl)
                                        this.$store.commit('setOfficialTitle', doc.data().officialTitle) 
                                        this.$store.commit('setOpas', doc.data().opas)
<<<<<<< HEAD
                                        this.$store.commit('setMinutesPerSession', doc.data().minutesPerSession)
                                        this.$store.commit('setWeekdayRatesPerHour', doc.data().weekdayRatesPerHour)
                                        this.$store.commit('setHolidayRatesPerHour', doc.data().holidayRatesPerHour)
                                        this.$store.commit('setSessionsPerDay', doc.data().sessionsPerDay)
                                        this.$store.commit('setLatitude', doc.data().latitude)
                                        this.$store.commit('setLongitude', doc.data().longitude)
                                        this.$store.commit('setMemberCheckName', doc.data().memberCheckName)
                                        this.getEntryNum();
                                        this.getScheduleNum();
                                        this.getGameNum();
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                                    } else {
                                        console.log("No such document!", array[0].config);
                                        // 設定データがなければ（正常であればありえない）
                                        alert("設定データがありません。管理者に連絡してください。");
                                        return;
                                    }
                                }).catch((error) => {
                                    console.log("Error getting document:", error);
                                });
                            } else {
                                // ユーザにconfigフィールドがなければ
                                alert("ユーザに設定へのリンクがありません。管理者に連絡してください。");
                                return;
                            }
<<<<<<< HEAD
                        } else {
                            console.log("array.length = ", array.length)
                        }
                        // ユーザデータが複数だったら
                        if (array.length > 1) {
                            alert("ユーザデータが複数あります")
=======
                        }
                        // ユーザデータが複数だったら
                        if (array.length > 1) {
                            console.log("ユーザデータが複数あります")
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                            this.configs = true
                        }
                    })
                    .catch((error) => {
<<<<<<< HEAD
                        alert("Error getting documents: ", error);
                });
            });              
            this.getDailyMessage();
            this.setLanguage();
            
=======
                        console.log("Error getting documents: ", error);
                });
            });           
            this.getEntryNum();
            this.getDailyMessage();
            this.setLanguage();
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
        },
        methods: {          
            goAttendance: function() {
                this.$router.push({ name: 'entry', params: { id: this.today } });
            },
            goGameEntries: function() {
                this.$router.push({ name: 'game', params: { id: this.today } });
            },
            goFinishedGame: function() {
                this.getLastGame();
            },
<<<<<<< HEAD
            goMessages: function() {
                this.$router.push({ name: 'messages', params: { id: this.today } });
            },
            goSchedule: function() {
                this.$router.push({ name: 'schedule', params: { id: this.today } });
            },
            goCourtDaily: function() {
                this.$router.push({ name: 'courtdaily', params: { id: this.today } });
            },
=======
            goSchedule: function() {
                this.$router.push({ name: 'schedule', params: { id: this.today } });
            },
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
            goMember: function() {
                this.$router.push(`/member?active=1`);
            },
            goRanking: function() {
                this.$router.push({ name: 'analysisindividual' });
            },
            goOfficialSite: function() {
                window.open(this.$store.state.officialUrl, '_blank');
            },
            goConfigSelect: function() {
                this.$router.push({ name: 'configselect' });
            },
            goMaintenance: function() {
                this.$router.push({ name: 'maintenance' });
            },
<<<<<<< HEAD
            changedNocache: function(item) {
                if (item) {
                    localStorage.clear();
                    sessionStorage.clear()
                    console.log("clear local and sessionStorage");
                    //window.localStorage.removeItem('vuex');
                    //console.log("clear store");    
                }               
            },
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
            getLastGame: function() {
                var d = new Date();
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                
                db.collection("gameEntries").where("end", "<=", endDate).orderBy("end", "desc").limit(1)
<<<<<<< HEAD
                    .get(this.source)
=======
                    .get()
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                    .then((querySnapshot) => {
                        var d;
                        querySnapshot.forEach((doc) => {
                            d = doc.data().date;
                        });
                        if (!querySnapshot.empty) {
                            this.lastGameDate = d.toDate();                          
                        }
                        this.$router.push({ name: 'gamefinished', params: { id: this.lastGameDate } });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            getEntryNum: function() {
                // 参加人数
<<<<<<< HEAD
                let d = new Date();
                let sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
=======
                var d = new Date();
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                this.entryNum = 0
                db.collection("entryNum").where("config", "==", this.$store.state.config).where("date", ">=", startDate).orderBy("date", "desc").limit(1)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            this.entryNum = doc.data().num;
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
<<<<<<< HEAD
            getScheduleNum: function() {
                // 予定人数
                let d = new Date();
                let sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                let ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                this.scheduleNum = 0
                db.collection("schedule").where("config", "==", this.$store.state.config).orderBy("date").startAt(startDate).endAt(endDate)
                    .get(this.source)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            if (doc.data().outTime) this.scheduleNum++
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            getGameNum: function() {
                // Game人数
                let d = new Date();
                let sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                let ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                this.gameNum = 0
                this.finishedGameNum = 0
                this.waitingGameNum = 0
                db.collection("gameEntries").where("config", "==", this.$store.state.config).orderBy("date").startAt(startDate).endAt(endDate)
                    .get(this.source)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            if (!doc.data().start) {
                                this.waitingGameNum++
                            } else if (!doc.data().end) {
                                this.gameNum++
                            } else {
                                this.finishedGameNum++
                            }
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
            getDailyMessage: function() {
                // DailyMessage取得
                var d = new Date();
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("messages").where("config", "==", this.$store.state.config).where("date", ">=", startDate).where("date", "<=", endDate).where("class", "==", "daily").orderBy("date")
<<<<<<< HEAD
                    .get(this.source)
=======
                    .get()
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            this.dailyMessage = d;
                            this.dailyMessageText = d.message;
                            this.weather = d.weather;
<<<<<<< HEAD
                            this.weatherCode = d.weatherCode;
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            consoleLog: function() {
                //this.$store.commit('setMasterNocache', value)
                //console.log("noCache", this.noCache, this.$store.state.noCache)
            },
            setLanguage: function() {
<<<<<<< HEAD
                
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                const lg = (window.navigator.languages && window.navigator.languages[0]) ||
                    window.navigator.language ||
                    window.navigator.userLanguage ||
                    window.navigator.browserLanguage;
                console.log(lg)
                //this.$i18n.locale = navigator.language
                switch (lg) {
                    case "en-US":
                        this.locale = enUS;
                        this.$i18n.locale = "en"
                        break;
                    case "ja":
                        this.locale = ja;
                        this.$i18n.locale = "ja"
                        break;
                    case "zh-CN":
                        this.locale = zhCN;
                        this.$i18n.locale = "zhCN"
                        break;
                    case "zh-TW":
                        this.locale = zhTW;
                        this.$i18n.locale = "zhTW"
                        break;
                    case "ru-RU":
                        this.locale = ru;
                        this.$i18n.locale = "ru"
                        break;
                    case "de":
                        this.locale = de;
                        this.$i18n.locale = "de"
                        break;
                    case "fr":
                        this.locale = fr;
                        this.$i18n.locale = "fr"
                        break;
                    case "nl":
                        this.locale = nl;
                        this.$i18n.locale = "nl"
                        break;
                    case "es-ES":
                        this.locale = es;
                        this.$i18n.locale = "es"
                        break;
                    case "pt-PT":
                        this.locale = pt;
                        this.$i18n.locale = "pt"
                        break;
                    case "it-IT":
                        this.locale = it;
                        this.$i18n.locale = "it"
                        break;
                    case "ar":
                        this.locale = arSA;
                        this.$i18n.locale = "ar"
                        break;
                    case "ko-KR":
                        this.locale = ko;
                        this.$i18n.locale = "ko"
                        break;
                    case "sr-RS":
                        this.locale = sr;
                        this.$i18n.locale = "sr"
                        break;
                    case "cs":
                        this.locale = cs;
                        this.$i18n.locale = "cs"
                        break;
                    case "ro-RO":
                        this.locale = ro;
                        this.$i18n.locale = "ro"
                        break;
                    case "hr":
                        this.locale = hr;
                        this.$i18n.locale = "hr"
                        break;
                    case "sv-SE":
                        this.locale = sv;
                        this.$i18n.locale = "sv"
                        break;
                    case "sk":
                        this.locale = sk;
                        this.$i18n.locale = "sk"
                        break;
                    default:
<<<<<<< HEAD
                        this.locale = ja;
                        this.$i18n.locale = "ja"
                    
                }
                
=======
                        this.locale = enUS;
                        this.$i18n.locale = "en"
                }  
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
            }
        }
    }
</script>

<style scoped>
    h3 {
        margin-top: 80px;
        text-align: center;
    }
    h4 {
        margin-top: 20px;
    }
    .main {
        min-width: 376px;
    }
    .container {
        margin-top: 20px;
        text-align: center;
    }
    .menubtn {
        margin: 10px;
    }
    .message {
        text-align: left;
    }
    .width70 {
        width: 70px;
    }
    .width120 {
        width: 120px;
    }
    .margin {
        margin: 20px;
    }
</style>