<template>
    <div class='main'><Menu></Menu>
        <div class="container-fluid">
            <h4>{{ $store.state.topTitle }} {{ format(today, 'MMM do (E)', {locale: locale}) }}</h4>
            <div class="container-fluid">
                <div v-if='isLogin' class="col-12">
                    <fa icon="baseball-ball" />
                        {{ $t("Hello,") }}{{loginUser.displayName}} {{ $t("さん") }} {{ $t("people_") }} {{ entryNum }} {{ $t("on board.") }}
                </div>
                <div class="row">
                    
                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goAttendance()"><fa icon="clipboard" />&ensp;{{ $t("Entry") }}</button>
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goGameEntries()"><fa icon="running" />&ensp;{{ $t("Game") }}</button>
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goFinishedGame()"><fa icon="couch" />&ensp;{{ $t("Finished games") }}</button>
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goSchedule()"><fa icon="calendar-alt" />&ensp;{{ $t("Schedule") }}</button>
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
                        <input class="form-check-input" type="checkbox" id="flexCheckChecked" v-model="noCache">
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
                today: new Date(),
                weather: null,
                dailyMessage: null,
                dailyMessageText: null,
                locale: ja,
                format: format,
                lastGameDate: new Date(),
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
                            this.$router.push(`/invite`);
                            return
                        }
                        // ユーザデータが1つだったら
                        if (array.length == 1) {
                            console.log("config", array[0].config)
                            // ユーザのconfigフィールドがあれば
                            if (array[0].config) {
                                this.$store.commit('setConfig', array[0].config)
                                this.$store.commit('setAdmin', array[0].admin)
                                // configを読んで
                                var docRef = db.collection("configs").doc(array[0].config);
                                docRef.get().then((doc) => {
                                    if (doc.exists) {
                                        // Storeに値をセット
                                        this.$store.commit('setName', doc.data().name)
                                        this.$store.commit('setTopTitle', doc.data().topTitle)
                                        this.$store.commit('setOfficialUrl', doc.data().officialUrl)
                                        this.$store.commit('setOfficialTitle', doc.data().officialTitle) 
                                        this.$store.commit('setOpas', doc.data().opas)
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
                        }
                        // ユーザデータが複数だったら
                        if (array.length > 1) {
                            console.log("ユーザデータが複数あります")
                            this.configs = true
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            });           
            this.getEntryNum();
            this.getDailyMessage();
            this.setLanguage();
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
            goSchedule: function() {
                this.$router.push({ name: 'schedule', params: { id: this.today } });
            },
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
            getLastGame: function() {
                var d = new Date();
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                
                db.collection("gameEntries").where("end", "<=", endDate).orderBy("end", "desc").limit(1)
                    .get()
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
                var d = new Date();
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
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
            getDailyMessage: function() {
                // DailyMessage取得
                var d = new Date();
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("messages").where("config", "==", this.$store.state.config).where("date", ">=", startDate).where("date", "<=", endDate).where("class", "==", "daily").orderBy("date")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            this.dailyMessage = d;
                            this.dailyMessageText = d.message;
                            this.weather = d.weather;
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
                        this.locale = enUS;
                        this.$i18n.locale = "en"
                }  
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