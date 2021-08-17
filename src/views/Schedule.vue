<template>
    <div class="schedule"><Menu class="sticky-top"></Menu>  
        <h4>{{ $t("Schedule") }} {{ format(today, 'MMM do (E)', {locale: locale}) }}</h4>
        <button class='btn btn-primary btn__'  data-toggle="modal" data-target="#demoNormalModal4" @click="setRowId4()">{{ $t("Register") }}</button>
        <datepicker 
            v-model="picked" 
            :locale="locale"
            :weekStartsOn=0
        />
        <div class="margin"></div>
        <div class="row">
            <div class="col-sm-1 col-md-2 col-lg-3"></div>
            <div class="col-sm-10 col-md-8 col-lg-6">
                <table class="table">
                    <tbody>
                        <tr>
                            <th class="width120"><fa icon="sun" />&ensp;{{ $t("Weather") }}</th>
                            <td>{{ weather }}</td>
                            <td v-if='$store.state.isAdmin' class="width70">
                                <button class='btn btn-primary btn-sm ' data-toggle="modal" data-target="#demoNormalModal2" @click="setRowId2(weather)">
                                    {{ $t("Edit") }}
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th class="width120">{{ $t("Message") }}</th>
                            <td>{{ dailyMessageText }}</td>
                            <td v-if='$store.state.isAdmin' class="width70">
                                <button class='btn btn-primary btn-sm' data-toggle="modal" data-target="#demoNormalModal3" @click="setRowId3(dailyMessage)">
                                    {{ $t("Edit") }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-1"></div>
            <div class="col-lg-10">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" class="num">#</th>
                            <th scope="col" class="time">{{ $t("In") }}</th>
                            <th scope="col" class="time">{{ $t("Out") }}</th>
                            <th scope="col" class="width100">{{ $t("Name") }}</th>
                            <th scope="col"></th>
                            <th scope="col" class="btns"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ramen, key) in ramens" :key="key">
                            <th scope="row">{{ key + 1 }}</th>
                            <td>{{ formatDate(ramen.date.toDate(), 'H:mm') }}</td>
                            <td><div v-if='ramen.outTime'>{{ formatDate(ramen.outTime.toDate(), 'H:mm') }}</div></td>
                            <td>{{ ramen.name }}</td>
                            <td>{{ ramen.message }}</td>
                            <td>
                                <div class='btn-toolbar' role="toolbar">
                                    <div v-if='$store.state.isAdmin || ramen.memberUid==loginMemberUid'>
                                        <button type="button" class="btn btn-primary btn-sm btn_" data-toggle="modal" data-target="#demoNormalModal" @click="setRowId(ramen.id, ramen.date, ramen.outTime, ramen.message)">
                                            {{ $t("Edit") }}
                                        </button>
                                        <button type="button" class='btn btn-danger btn-sm btn_' @click="deleteSchedule(ramen.id)">
                                            {{ $t("Edit") }}
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>  
                   
        </div>
        
        
        <!--<datepicker v-model="picked" />
        <hr>-->
        <!--<VueTimepicker v-model="message" />-->

        <!-- 時間入力ダイアログ update -->
        <div class="modal fade" id="demoNormalModal" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="demoModalTitle">{{ $t("Edit") }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-inline ">
                            <div class="form-row align-items-center">
                                <div class="input-group">
                                    
                                        <div class="input-group-prepend">
                                            <label class="input-group-text" for="inputGroupSelect01">入時間</label>
                                        </div>
                                        <select class="custom-select mr-sm-4" id="inlineFormCustomSelect"
                                            v-model="inTime"
                                        >
                                            <option selected>...</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                            <option value="18">18</option>
                                            <option value="19">19</option>
                                            <option value="20">20</option>
                                            <option value="21">21</option>
                                        </select>
                                    
                                        <div class="input-group-prepend">
                                            <label class="input-group-text" for="inputGroupSelect01">退時間</label>
                                        </div>
                                        <select class="custom-select mr-sm-4" id="inlineFormCustomSelect"
                                            v-model="outTime"
                                        >
                                            <option selected>...</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                            <option value="18">18</option>
                                            <option value="19">19</option>
                                            <option value="20">20</option>
                                            <option value="21">21</option>
                                        </select>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-body">
                        <input v-model="message" class='width300' :placeholder='$t("Message")'>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click='editSchedule(rowId, inTime, outTime, message)'>OK</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 天気 入力ダイアログ -->
        <div class="modal fade" id="demoNormalModal2" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="demoModalTitle">{{ $t("Weather") }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <input v-model="weather" class='width300' :placeholder='$t("Weather")'>
                    </div>
                    <div class="modal-footer">
                        
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click='editOkWeather(weather)'>OK</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- DailyMessage 入力ダイアログ -->
        <div class="modal fade" id="demoNormalModal3" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="demoModalTitle">{{ $t("Message") }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <input v-model="dailyMessageText" class='width300' :placeholder='$t("Message")'>
                    </div>
                    <div class="modal-footer">
                        
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click='editOkDailyMessage(dailyMessageText)'>OK</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 時間入力ダイアログ -->
        <div class="modal fade" id="demoNormalModal4" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="demoModalTitle">{{ $t("Register") }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <!--<div class="modal-body">
                        <input v-model="inTime" class='input' placeholder="入る時間">
                    </div>-->
                    <div class="modal-body">
                        <div class="form-inline ">
                            <div class="form-row align-items-center">
                                <div class="input-group">
                                    
                                        <div class="input-group-prepend">
                                            <label class="input-group-text" for="inputGroupSelect01">{{ $t("In") }}</label>
                                        </div>
                                        <select class="custom-select mr-sm-4" id="inlineFormCustomSelect"
                                            v-model="inTime"
                                        >
                                            <option selected>...</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                            <option value="18">18</option>
                                            <option value="19">19</option>
                                            <option value="20">20</option>
                                            <option value="21">21</option>
                                        </select>
                                    
                                        <div class="input-group-prepend">
                                            <label class="input-group-text" for="inputGroupSelect01">{{ $t("Out") }}</label>
                                        </div>
                                        <select class="custom-select mr-sm-4" id="inlineFormCustomSelect"
                                            v-model="outTime"
                                        >
                                            <option selected>...</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                            <option value="16">16</option>
                                            <option value="17">17</option>
                                            <option value="18">18</option>
                                            <option value="19">19</option>
                                            <option value="20">20</option>
                                            <option value="21">21</option>
                                        </select>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--<div class="modal-body">
                        <input v-model="outTime" class='input' placeholder="帰る時間">
                    </div>-->
                    <div class="modal-body">
                        <input v-model="message" class='width300' :placeholder='$t("Message")'>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click='entrySchedule(inTime, outTime, message)'>OK</button>
                    </div>
                </div>
            </div>
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
    //const deLocale = require('date-fns/locale/ja')
    //import VueTimepicker from 'vue3-timepicker'
    //import 'vue3-timepicker/dist/VueTimepicker.css'

    //require('firebase/firestore')

    //var memberRef = db.collection("users");
    export default {
        name: 'attendance',
        components: {
            Menu,          
            //VueTimepicker,
            Datepicker
        },
        data() {
            return {
                ramens: [],
                today: new Date(this.$route.params.id),
                innerSearchText: new Date(this.$route.params.id),
                inTime: null,
                outTime: null,
                message: null,
                dailyMessage: null,
                weather: null,
                dailyMessageText: null,
                locale: ja,
                format: format,
                loginMemberName: null,
                loginMemberUid: null,
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
                            this.loginMemberName = doc.data().displayName;
                            this.loginMemberUid = doc.id;
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            });
            this.getSchedule();
            this.getDailyMessage();
            this.setLanguage();
        },
        methods: {
            getSchedule: function() {
                this.ramens = []
                // スケジュール取得
                var d = this.today;
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("schedule").where("config", "==", this.$store.state.config).orderBy("date").startAt(startDate).endAt(endDate)
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            //console.log(doc.id, " => ", doc.data());
                            const d = doc.data();
                            d.id = doc.id;
                            array.push(d);
                        });
                        this.ramens = array
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            getDailyMessage: function() {
                this.dailyMessage = null
                this.dailyMessageText = null
                this.weather = null
                // DailyMessage取得
                var d = this.today;
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("messages").where("config", "==", this.$store.state.config).where("date", ">=", startDate).where("date", "<=", endDate).where("class", "==", "daily").orderBy("date")
                    .get(this.source)
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
            goMenu: function () {
                this.$router.push(`/main`);
            },
            selectMember: function (docid) {
                this.$router.push({ name: 'memberschedule', params: { id: docid } })
            },
            deleteSchedule: function(docid) {
                db.collection("schedule").doc(docid).delete().then(() => {
                    console.log("Document successfully deleted!");
                    // Reload
                    //this.$router.go({path: this.$router.currentRoute.path, force: true})
                    this.$router.push(`/schedule` + '/' + this.today);
                    this.getSchedule();
                    this.getDailyMessage();
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            },
            editSchedule: function(docid, in_, out_, message_) {
                console.log("in:" + in_);
                console.log("out:" + out_);
                //if (in_ || out_) return;
                var st = new Date(this.today);
                var ed = new Date(this.today);
                st.setHours(this.toHankaku(in_));
                st.setMinutes(0);
                //st.setSeconds(0);
                ed.setHours(this.toHankaku(out_));
                ed.setMinutes(0);
                //ed.setSeconds(0);
                //
                db.collection("schedule").doc(docid).update({
                    date: firebase.firestore.Timestamp.fromDate(new Date(st)),
                    outTime: firebase.firestore.Timestamp.fromDate(new Date(ed)),
                    message: message_
                })
                .then(() => {
                    console.log("Document successfully written!");
                    // Reload
                    //this.$router.go({path: this.$router.currentRoute.path, force: true})
                    this.getSchedule();
                    this.getDailyMessage();
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });              
            },
            entrySchedule: function(in_, out_, message_) {
                console.log("in:" + in_);
                console.log("out:" + out_);
                //if (in_ || out_) return;
                var st = new Date(this.today);
                var ed = new Date(this.today);
                st.setHours(this.toHankaku(in_));
                st.setMinutes(0);
                //st.setSeconds(0);
                ed.setHours(this.toHankaku(out_));
                ed.setMinutes(0);
                //ed.setSeconds(0);
                //
                db.collection("schedule").doc().set({
                    config: this.$store.state.config,
                    memberUid: this.loginMemberUid,
                    name: this.loginMemberName,
                    date: firebase.firestore.Timestamp.fromDate(new Date(st)),
                    outTime: firebase.firestore.Timestamp.fromDate(new Date(ed)),
                    message: message_
                })
                .then(() => {
                    console.log("Document successfully written!");
                    // Reload
                    //this.$router.go({path: this.$router.currentRoute.path, force: true})
                    this.getSchedule();
                    this.getDailyMessage();
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            setRowId: function(docid, in_, out_, message_) {
                this.rowId = docid;
                this.inTime = in_?this.formatDate(in_.toDate(), 'H'):"";
                this.outTime = out_?this.formatDate(out_.toDate(), 'H'):"";
                this.message = message_;
            },
            setRowId2: function(message_) {
                this.weather = message_;
            },
            setRowId3: function(message_) {
                this.dailyMessage = message_;
            },
            setRowId4: function() {
                //
            },
            editWeather: function() {
            },
            editDailyMessage: function() {
            },
            editOkWeather: function(message_) {
                if (this.dailyMessage) {
                    db.collection("messages").doc(this.dailyMessage.id).update({
                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                        weather: message_
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                        // Reload
                        //this.$router.go({path: this.$router.currentRoute.path, force: true})
                        this.getSchedule();
                        //this.getDailyMessage();
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                } else {
                    db.collection("messages").doc().set({
                        date: firebase.firestore.Timestamp.fromDate(new Date(this.today)),
                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                        config: this.$store.state.config,
                        weather: message_,
                        class: "daily"
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                        // Reload
                        //this.$router.go({path: this.$router.currentRoute.path, force: true})
                        this.getSchedule();
                        //this.getDailyMessage();
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
                //this.getSchedule();
                this.getDailyMessage();
            },
            editOkDailyMessage: function(message_) {
                if (this.dailyMessage) {
                    db.collection("messages").doc(this.dailyMessage.id).update({
                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                        message: message_
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                        // Reload
                        //this.$router.go({path: this.$router.currentRoute.path, force: true})
                        this.getSchedule();
                        //this.getDailyMessage();
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                } else {
                    db.collection("messages").doc().set({
                        date: firebase.firestore.Timestamp.fromDate(new Date(this.today)),
                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                        config: this.$store.state.config,
                        message: message_,
                        class: "daily"
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                        // Reload
                        //this.$router.go({path: this.$router.currentRoute.path, force: true})
                        this.getSchedule();
                        //this.getDailyMessage();
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
                //this.getSchedule();
                this.getDailyMessage();
            },
            changeDate: function() {
                //console.log("changeDate()")
                this.today = this.picked;
                this.$router.push({ name: 'schedule', params: { id: this.today } });
                this.getSchedule();
                this.getDailyMessage();
                /*        
                var d = new Date(this.today);
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                // Get Schedule
                db.collection("schedule").where("config", "==", this.$store.state.config).orderBy("date").startAt(startDate).endAt(endDate)
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            //console.log(doc.id, " => ", doc.data());
                            const d = doc.data();
                            d.id = doc.id;
                            array.push(d);
                        });
                        this.ramens = array;
                        // Get Daily Message
                        db.collection("messages").where("config", "==", this.$store.state.config).where("date", ">=", startDate).where("date", "<=", endDate).where("class", "==", "daily").orderBy("date")
                            .get(this.source)
                            .then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    const d = doc.data();
                                    d.id = doc.id;
                                    this.dailyMessage = d;
                                    this.dailyMessageText = d.message;
                                    this.weather = d.weather;
                                });
                                if (querySnapshot.empty) {
                                    this.dailyMessageText = "";
                                    this.dailyMessage = null;
                                    this.weather = "";
                                }
                                this.$router.push({ name: 'schedule', params: { id: this.today } });
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                        });
                        this.$router.push({ name: 'schedule', params: { id: this.today } });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                }); 
                */    
            },
            clearData: function() {
                this.ramens = []
                this.dailyMessage = null
                this.dailyMessageText = null
                this.weather = null
            },
            toHankaku: function(str) {              
                if (!str) return "";
                console.log("str", str);
                return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                });
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
                        this.locale = enUS;
                        this.$i18n.locale = "en"
                }               
            }
        }
    }
</script>

<style scoped>
    h4 {
        margin-top: 20px;
    }
    .table {
        text-align: left;
    }
    .btn_ {
        margin-left: 10px;
    }
    .btn__ {
        margin: 10px;
    }
    .schedule {
        min-width: 460px;
    }
    .input {
        min-width: 100px;
    }
    .btns {
        width: 138px;
    }
    .time {
        width: 70px;
    }
    .num {
        width: 50px;
    }
    .width90 {
        min-width: 90px;
    }
    .width100 {
        width: 100px;
    }
    .width120 {
        width: 120px;
    }
    .width200 {
        width: 200px;
    }
    .width300 {
        min-width: 300px;
    }
    .width70 {
        width: 72px;
    }
    .margin {
        margin: 20px;
    }
</style>