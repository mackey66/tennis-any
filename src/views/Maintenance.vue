<template>  
    <div class='maintenance'><Menu></Menu> 
        <div class="container-fluid">
            <h4>{{ $t("Maintenance") }}</h4>
            <div class="container-fluid">  
                <div class="row">
                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goMember()"><fa icon="address-card" />&ensp;{{ $t("Member") }}</button>
                    </div>

                    <div v-if='$store.state.isAdmin' class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div v-if='$store.state.isAdmin' class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goCourtEntries()"><fa icon="th" />&ensp;{{ $t("Court List") }}</button>
                    </div>

                    <div v-if='$store.state.isAdmin' class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div v-if='$store.state.isAdmin' class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goCourtLottery()"><fa icon="record-vinyl" />&ensp;{{ $t("Court Lottery") }}</button>
                    </div>

                    <div v-if='$store.state.isAdmin' class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div v-if='$store.state.isAdmin' class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goIndividual()"><fa icon="male" />&ensp;{{ $t("Individual Amount") }}</button>
                    </div>
                    
                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goAnalysis()"><fa icon="chart-bar" />&ensp;{{ $t("Number of entries") }}</button>
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goAnalysisSchedule()"><fa icon="chart-bar" />&ensp;{{ $t("Estimated number of people") }}</button>
                    </div>

                    <div v-if='$store.state.isAdmin' class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div v-if='$store.state.isAdmin' class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goCourt()"><fa icon="th-large" />&ensp;{{ $t("Court") }}</button>
                    </div>

                    <div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goChat()"><fa icon="comments" />&ensp;{{ $t("Chat") }}</button>
                    </div>

                    <div v-if='$store.state.isAdmin' class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div v-if='$store.state.isAdmin' class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="goConfig()"><fa icon="cog" />&ensp;{{ $t("Config") }}</button>
                    </div>
                    <!--<div class="col-sm-2 col-md-3 col-lg-4"></div>
                    <div v-if='admin' class="col-sm-8 col-md-6 col-lg-4 menubtn">
                        <button class='btn btn-primary btn-block' @click="doReplace()"><fa icon="cog" />&ensp;全置換テスト</button>
                    </div>-->
                    <div class="col-12 menubtn">
                        <input class="form-check-input" type="checkbox" id="flexCheckChecked" v-model="noCache">
                        <label class="form-check-label" for="flexCheckChecked">
                            {{ $t("Do not use the cache") }}
                        </label>
                    </div>
                    <!--<div class="locale-changer">
                        <select v-model="$i18n.locale">
                        <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">
                            {{ lang }}
                        </option>
                        </select>
                    </div>-->
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

    export default {
        name: 'Main',
        components: {
            Menu
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
                admin: false,
                weather: null,
                dailyMessage: null,
                dailyMessageText: null,
                locale: ja,
                format: format,
                lastAttendanceDate: new Date(),
                //langs: ['ja', 'en', 'zh']
            };
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
            });
            this.getEntryNum();
            this.getDailyMessage();
            this.setLanguage();   
        },
        methods: {
            goMember: function() {
                this.$router.push(`/member`);
            },
            goCourt: function() {
                this.$router.push({ name: 'court' });
            },
            goCourtEntries: function() {
                this.$router.push({ name: 'courtentries', params: { id: this.today } });
            },
            goCourtLottery: function() {
                //const d = new Date(this.today.getFullYear(), this.today.getMonth() + 2, 0)
                this.$router.push({ name: 'courtlottery', params: { id: this.today } });
            },
            goIndividual: function() {
                this.$router.push({ name: 'individual', params: { id: this.today } });
            },
            goAnalysis: function() {
                this.getLastAttendance();
            },
            goAnalysisSchedule: function() {
                this.$router.push({ name: 'analysisschedule', params: { id: this.today } });
            },
            goReservation: function() {
                this.$router.push({ name: 'reservation' });
            },
            goMessages: function() {
                this.$router.push({ name: 'messages', params: { id: this.today } });
            },
            goChat: function() {
                this.$router.push({ name: 'chat' });
            },
            goConfig: function() {
                this.$store.commit('setInvite', false)
                this.$router.push({ name: 'config' });
            },
            getEntryNum: function() {
                // 参加人数
                var d = new Date();
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                this.entryNum = 0
                db.collection("entryNum").where("date", ">=", startDate).orderBy("date", "desc").limit(1)
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
                db.collection("messages").where("date", ">=", startDate).where("date", "<=", endDate).where("class", "==", "daily").orderBy("date")
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
            getLastAttendance: function() {
                // 直近のエントリー日付を取得
                var d = new Date();
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);         
                db.collection("attendance").where("inTime", "<=", endDate).orderBy("inTime", "desc").limit(1)
                    .get()
                    .then((querySnapshot) => {
                        var d;
                        querySnapshot.forEach((doc) => {
                            d = doc.data().inTime;
                        });
                        if (!querySnapshot.empty) {
                            this.lastAttendanceDate = d.toDate();                           
                        }
                        this.$router.push({ name: 'analysis', params: { id: this.lastAttendanceDate } });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            doReplace: function() {
                // firebaseのキャッシュをクリア
                //firebase.firestore().clearPersistence()
                /*
                // membersのconfigを全置換
                db.collection("members")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection("members").doc(doc.id).update({
                                config: this.$store.state.config
                            })
                            .then(() => {
                                console.log("Document successfully written! config = ", this.$store.state.config);                  
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                */
                // attencanceのconfigを全置換
                const coll = 'gameEntries'
                db.collection(coll)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection(coll).doc(doc.id).update({
                                config: this.$store.state.config
                            })
                            .then(() => {
                                console.log("Document successfully written! config = ", this.$store.state.config, coll);                  
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                /*
                const coll2 = 'entryNum'
                db.collection(coll2)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection(coll2).doc(doc.id).update({
                                config: this.$store.state.config
                            })
                            .then(() => {
                                console.log("Document successfully written! config = ", this.$store.state.config, coll2);                  
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                */
            },
            setLanguage: function() {
                const lg = navigator.language
                console.log(lg)
                //this.$i18n.locale = lg
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
                        this.locale = ja;
                        this.$i18n.locale = "ja"
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
    .maintenance {
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
</style>