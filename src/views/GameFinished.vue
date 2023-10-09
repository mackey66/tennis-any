<template>
    <div class="game"><Menu class="sticky-top"></Menu>
        <div class="container-fluid">  
            <h4>{{ $t("Finished games") }} {{ format(today, 'MMM do (E)', {locale: locale}) }}</h4>
<<<<<<< HEAD
            <div class="row">
                <div class="col-4"></div>
                <div class="col-4">
                    <datepicker 
                        v-model="picked"
                        :locale="locale"
                        :weekStartsOn=0
                    />
                </div>
                <div class="col-4"></div>
            </div>
            <button class='btn btn-primary btn_' @click="back()">{{ $t("Back") }}</button>
=======
            <div class="margin"></div>
            <datepicker 
                v-model="picked"
                :locale="locale"
                :weekStartsOn=0
            />
            <div class="margin"></div>
            <h6>
                <router-link :to="{ name: 'game', params: { id: $route.params.id } }">{{ $t("Game") }}</router-link>
            </h6>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
            <div class="margin"></div>
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-10">
<<<<<<< HEAD
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col" class="court">{{ $t("Court") }}</th>
                                    <th scope="col" class="nowrap">{{ $t("Start") }}</th>
                                    <th scope="col" class="nowrap">{{ $t("End") }}</th>
                                    <th scope="col" class="width250">{{ $t("Member") }}</th>
                                    <th scope="col" class="court">{{ $t("Result") }}</th>      
                                    <th scope="col" class="width150"></th>      
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(ramen, key) in ramens" :key="key">
                                    <th scope="row">{{ key + 1 }}</th>
                                    <td>{{ ramen.courtName }}</td>
                                    <td><div v-if='ramen.start'>{{ formatDate(ramen.start.toDate(), 'H:mm') }}</div></td>
                                    <td><div v-if='ramen.end'>{{ formatDate(ramen.end.toDate(), 'H:mm') }}</div></td>
                                    <td>
                                        <div v-if='ramen.member3Name'>
                                            <p v-if='ramen.member1Name'>{{ ramen.member1Name }}・</p>
                                            <p v-if='ramen.member2Name'>{{ ramen.member2Name }}</p>
                                            −
                                            <p v-if='ramen.member3Name'>{{ ramen.member3Name }}・</p>
                                            <p v-if='ramen.member4Name'>{{ ramen.member4Name }}</p>
                                        </div>
                                        <div v-else>
                                            <p v-if='ramen.member1Name'>{{ ramen.member1Name }}</p>
                                            −
                                            <p v-if='ramen.member2Name'>{{ ramen.member2Name }}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if='ramen.interruption' class="form-inline">
                                            <div class="form-row align-items-center">
                                                <div class="col-auto my-1">
                                                    <select class="custom-select mr-sm-1" id="inlineFormCustomSelect"
                                                        v-model="ramen.score"
                                                        :disabled="!ramen.start" 
                                                        @change="updateScore(ramen.id, ramen.score)"
                                                    >
                                                        <option selected>...</option>
                                                        <option value="0">0</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                    </select>
                                                </div>
                                                <div class="col-auto my-1">
                                                    <select class="custom-select mr-sm-1" id="inlineFormCustomSelect"
                                                        v-model="ramen.opponentScore"
                                                        :disabled="!ramen.start" 
                                                        @change="updateOpponentScore(ramen.id, ramen.opponentScore)"
                                                    >
                                                        <option selected>...</option>
                                                        <option value="0">0</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                    </select>
                                                </div>
                                                <div class="col-auto my-1">
                                                <input style="width:80px;" type="text" class="form-control" aria-label="Remarks"
                                                    v-model="ramen.remarks"
                                                    :disabled="!ramen.start" 
                                                    @change="updateRemarks(ramen.id, ramen.remarks)"
                                                >
                                                </div>
                                            </div>   
                                        </div>
                                        <div v-else>
                                            {{ ramen.score }} - {{ ramen.opponentScore }} {{ ramen.remarks }}
                                        </div>
                                    </td>
                                    <td>
                                        <button v-if='today>yesterday && !ramen.interruption' class='btn btn-primary btn-sm' @click="ramen.interruption=true">
                                            {{ $t("Edit") }}
                                        </button>
                                        <button v-if='today>yesterday && ramen.interruption' class='btn btn-primary btn-sm' @click="ramen.interruption=false">
                                            {{ $t("Confirm") }}
                                        </button>
                                        <button v-if='$store.state.isAdmin' class='btn btn-danger btn-sm btn__' @click="deleteGame(ramen.id)">
                                            {{ $t("Delete") }}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
=======
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col" class='court'>{{ $t("Court") }}</th>
                                <th scope="col">{{ $t("Start") }}</th>
                                <th scope="col">{{ $t("End") }}</th>
                                <th scope="col" class="width250">{{ $t("Member") }}</th>
                                <th scope="col" class='court'>{{ $t("Result") }}</th>      
                                <th scope="col" class="width150"></th>      
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(ramen, key) in ramens" :key="key">
                                <th scope="row">{{ key + 1 }}</th>
                                <td>{{ ramen.courtName }}</td>
                                <td><div v-if='ramen.start'>{{ formatDate(ramen.start.toDate(), 'H:mm') }}</div></td>
                                <td><div v-if='ramen.end'>{{ formatDate(ramen.end.toDate(), 'H:mm') }}</div></td>
                                <td>
                                    <div v-if='ramen.member3Name'>
                                        <p v-if='ramen.member1Name'>{{ ramen.member1Name }}・</p>
                                        <p v-if='ramen.member2Name'>{{ ramen.member2Name }}</p>
                                        −
                                        <p v-if='ramen.member3Name'>{{ ramen.member3Name }}・</p>
                                        <p v-if='ramen.member4Name'>{{ ramen.member4Name }}</p>
                                    </div>
                                    <div v-else>
                                        <p v-if='ramen.member1Name'>{{ ramen.member1Name }}</p>
                                        −
                                        <p v-if='ramen.member2Name'>{{ ramen.member2Name }}</p>
                                    </div>
                                </td>
                                <td>
                                    <div v-if='ramen.interruption' class="form-inline">
                                        <div class="form-row align-items-center">
                                            <div class="col-auto my-1">
                                                <select class="custom-select mr-sm-1" id="inlineFormCustomSelect"
                                                    v-model="ramen.score"
                                                    :disabled="!ramen.start" 
                                                    @change="updateScore(ramen.id, ramen.score)"
                                                >
                                                    <option selected>...</option>
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                </select>
                                            </div>
                                            <div class="col-auto my-1">
                                                <select class="custom-select mr-sm-1" id="inlineFormCustomSelect"
                                                    v-model="ramen.opponentScore"
                                                    :disabled="!ramen.start" 
                                                    @change="updateOpponentScore(ramen.id, ramen.opponentScore)"
                                                >
                                                    <option selected>...</option>
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                </select>
                                            </div>
                                            <div class="col-auto my-1">
                                            <input style="width:80px;" type="text" class="form-control" aria-label="Remarks"
                                                v-model="ramen.remarks"
                                                :disabled="!ramen.start" 
                                                @change="updateRemarks(ramen.id, ramen.remarks)"
                                            >
                                            </div>
                                        </div>   
                                    </div>
                                    <div v-else>
                                        {{ ramen.score }} - {{ ramen.opponentScore }} {{ ramen.remarks }}
                                    </div>
                                </td>
                                <td>
                                    <button v-if='today>yesterday && !ramen.interruption' class='btn btn-primary btn-sm' @click="ramen.interruption=true">
                                        {{ $t("Edit") }}
                                    </button>
                                    <button v-if='today>yesterday && ramen.interruption' class='btn btn-primary btn-sm' @click="ramen.interruption=false">
                                        {{ $t("Confirm") }}
                                    </button>
                                    <button v-if='$store.state.isAdmin' class='btn btn-danger btn-sm btn__' @click="deleteGame(ramen.id)">
                                        {{ $t("Delete") }}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                </div>         
            </div>
            <hr>
        </div>
    </div>  
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase'
    import { db } from "../main";
    import Menu from '@/components/Menu.vue'
    import Datepicker from 'vue3-datepicker'
    import { format } from 'date-fns'
    import { ja, enUS, zhCN, zhTW, ru, de, fr, nl, es, pt, it, arSA, ko, sr, cs, ro, hr, sv, sk } from 'date-fns/locale'
    //require('firebase/firestore')

    //var memberRef = db.collection("users");
    export default {
        name: 'attendance',
        components: {
            Menu,
            Datepicker
        },
        data() {
            return {
                ramens: [],
                today: new Date(this.$route.params.id),
                yesterday: new Date(),
                innerSearchText: new Date(this.$route.params.id),
                locale: ja,
                format: format,
                rowId: null,
                result: null,
                loginMemberUid: null,
                member1Text: null,
                member2Text: null,
                member3Text: null,
                member4Text: null,
                source: this.$store.state.getOption
            }
        },
        computed: {
            picked: {
                get () {
                    return this.innerSearchText
                },
                set (value) {                    
                    this.innerSearchText = value
                    this.changeDate()                
                }
            }
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
                db.collection("members").where("userUid", "==", this.loginUser.uid)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            //this.admin = doc.data().admin;
                            this.loginMemberUid = doc.id;
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            });
            this.now = new Date();
            this.yesterday = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 1);
            this.getGameEntries(this.today);
            // 日付をセット
            this.innerSearchText = this.today;
            this.setLanguage();
        },
        methods: {
            getGameEntries: function(date) {
                // ゲームデータ取得
                var d = date;
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("gameEntries").where("config", "==", this.$store.state.config).orderBy("date").startAt(startDate).endAt(endDate)
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            if (d.end) array.push(d);
                        });
                        this.ramens = array
                        console.log("source", this.source)
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            goMenu: function () {
                this.$router.push(`/main`);
            },
            goGameEntries: function () {
                this.$router.push(`/game`);
            },
            selectCourt: function () {
                this.$router.push(`/courtselect`);
            },
            goSelectMember: function (docid) {
                console.log(docid)
                this.$router.push({ name: 'memberselect', params: { id: docid } })              
            },
            startGame: function(docid) {
                db.collection("gameEntries").doc(docid).update({
                    start: firebase.firestore.Timestamp.fromDate(new Date())
                })
                .then(() => {
                    console.log("Document successfully written!");
                    // Reload
                    this.$router.go({path: this.$router.currentRoute.path, force: true})
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            endGame: function(docid) {
                db.collection("gameEntries").doc(docid).update({
                    end: firebase.firestore.Timestamp.fromDate(new Date())
                })
                .then(() => {
                    console.log("Document successfully written!");
                    // Reload
                    this.$router.go({path: this.$router.currentRoute.path, force: true})
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            deleteGame: function(docid) {
                db.collection("gameEntries").doc(docid).delete().then(() => {
                    console.log("Document successfully deleted!");
                    // Reload
<<<<<<< HEAD
                    //this.$router.go({path: this.$router.currentRoute.path, force: true})
                    this.getGameEntries(this.today)
=======
                    this.$router.go({path: this.$router.currentRoute.path, force: true})
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            },
            setRowId: function(docid, member1_, member2_, member3_, member4_, result_) {
                this.rowId = docid;
                this.member1Text = member1_;
                this.member2Text = member2_;
                this.member3Text = member3_;
                this.member4Text = member4_;
                this.result = result_;
                
            },
            editOkResult: function(id, member1_, member2_, member3_, member4_, result_) {
                db.collection("gameEntries").doc(id).update({
                    member1Name: member1_,
                    member2Name: member2_,
                    member3Name: member3_,
                    member4Name: member4_,
                    result: this.toHankaku(result_)
                })
                .then(() => {
                    console.log("Document successfully written!");
                    // Reload
                    this.$router.go({path: this.$router.currentRoute.path, force: true})
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });               
            },
            updateScore: function(id, value) {
<<<<<<< HEAD
                db.collection("gameEntries").doc(id).update({
                    score: Number(this.toHankaku(value))
                })
                .then(() => {
                    console.log("Document successfully written!(Score)");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            updateOpponentScore: function(id, value) {
                db.collection("gameEntries").doc(id).update({
                    opponentScore: Number(this.toHankaku(value))
                })
                .then(() => {
                    console.log("Document successfully written!(Score)");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            updateRemarks: function(id, value) {
                db.collection("gameEntries").doc(id).update({
                    remarks: value
                })
                .then(() => {
                    console.log("Document successfully written!(Score)");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            back: function() {
                this.$router.go(-1)
                //this.$router.push({ name: 'game', params: { id: this.$route.params.id } });
=======
                    db.collection("gameEntries").doc(id).update({
                        score: Number(this.toHankaku(value))
                    })
                    .then(() => {
                        console.log("Document successfully written!(Score)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            },
            updateOpponentScore: function(id, value) {
                    db.collection("gameEntries").doc(id).update({
                        opponentScore: Number(this.toHankaku(value))
                    })
                    .then(() => {
                        console.log("Document successfully written!(Score)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            },
            updateRemarks: function(id, value) {
                    db.collection("gameEntries").doc(id).update({
                        remarks: value
                    })
                    .then(() => {
                        console.log("Document successfully written!(Score)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
            },
            changeDate: function() {
                this.today = this.picked;
                this.$router.push({ name: 'gamefinished', params: { id: this.today } });
                this.getGameEntries(this.today);
                /*
                var d = new Date(this.today);
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("gameEntries").where("config", "==", this.$store.state.config).orderBy("date").startAt(startDate).endAt(endDate)
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            if (d.end) array.push(d);
                        });
                        this.ramens = array
                        console.log("source", this.source)
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                */
            },
            formatDate: function (date, format) {
                format = format.replace(/yyyy/g, date.getFullYear());
                //format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
                //format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
                //format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
                format = format.replace(/M/g, (date.getMonth() + 1));
                format = format.replace(/d/g, (date.getDate()));
                format = format.replace(/H/g, (date.getHours()));
                format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
                format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
                format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
                return format;
            },
            toHankaku: function(str) {
                if (!str) return "";
                return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                });
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
<<<<<<< HEAD
                        this.locale = ja;
                        this.$i18n.locale = "ja"
=======
                        this.locale = enUS;
                        this.$i18n.locale = "en"
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                }               
            }
        }
    }
</script>

<style scoped>
    .game {
<<<<<<< HEAD
        min-width: 376px;
    }
    .nowrap {
        white-space: nowrap;
=======
        min-width: 770px;
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
    }
    h4 {
        margin-top: 20px;
    }
    .table {
        text-align: left;
    }
    .btn_ {
        margin: 10px;
    }
    .margin {
        margin: 20px;
    }
    .court {
        min-width: 80px;
    }
    .btn__ {
        margin: 0 0 0 10px;
    }
    .width80 {
        min-width: 80px;
    }
    .width150 {
        min-width: 150px;
    }
    .width250 {
        min-width: 250px;
    }
    .width300 {
        min-width: 300px;
    }
    .width350 {
        min-width: 350px;
    }
    p {display: inline-block; _display: inline;}
</style>