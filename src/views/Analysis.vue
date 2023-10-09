<template>
    <Menu class="sticky-top"></Menu>
    <div class="about">   
        <h4>{{ $t("Number of entries") }} {{ format(today, 'MMM do (E)', {locale: locale}) }}</h4>
        <datepicker 
            v-model="picked" 
            :locale="locale"
            :weekStartsOn=0
        />
        <div class="margin"></div>
        <div class="row">
            <div class="col-sm-2 col-md-3"></div>
            <div class="col-sm-8 col-md-6">
                <table class="table">
                    <tbody>
                        <tr>
                            <th class="width120"><fa icon="sun" />&ensp;{{ $t("Weather") }}</th>
                            <td>{{ weather }}</td>
                        </tr>
                        <tr>
                            <th class="width120">{{ $t("Message") }}</th>
                            <td>{{ dailyMessageText }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">    
            <div class="col-sm-2 col-md-3 col-lg-4"></div>
            <div class="col-sm-8 col-md-6 col-lg-4">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" class="time">{{ $t("Time") }}</th>
                            <th scope="col" class="width100">{{ $t("Number of people") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ramen, key) in analysis" :key="key">
                            <td>{{ formatDate(ramen.date.toDate(), 'H:mm') }}</td>
                            <td>{{ ramen.count }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>            
        </div>
        <!--<button class='btn btn-primary btn__' @click="fillData(analysis)">グラフ</button>-->
        <div class="margin40"><DailyChart v-bind:chartData="dataCollection" v-bind:chartOptions="chartOption" /></div>
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
    import { defineComponent } from 'vue'
    import DailyChart from '@/components/DailyChart.vue'

    //const deLocale = require('date-fns/locale/ja')
    //import VueTimepicker from 'vue3-timepicker'
    //import 'vue3-timepicker/dist/VueTimepicker.css'

    //require('firebase/firestore')

    //var memberRef = db.collection("users");
    export default defineComponent({
        name: 'attendance',
        components: {
            Menu,          
            Datepicker,
            DailyChart
        },
        data() {
            return {
                ramens: [],
                analysis: [],
                today: new Date(this.$route.params.id),
                innerSearchText: new Date(),
                inTime: null,
                outTime: null,
                message: null,
                dailyMessage: null,
                weather: null,
                dailyMessageText: null,
                locale: ja,
                format: format,
                chartOption: { responsive: true, 
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true, 
                                    min: 0,
                                    max: 50 
                                }
                            }
                        ]
                    }
                },
                dataCollection: { labels:[], datasets: [] },
                sd: null,
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
                /*
                db.collection("members").where("userUid", "==", this.loginUser.uid)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            this.admin = doc.data().admin;
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                */
            });
            //this.getLastAttendance();
            this.getUser(this.today);
            // 日付をセット
            this.innerSearchText = this.today;
            this.setLanguage();
        },
        methods: {
            getUser: function(date) {
                // エントリー取得
                var d = date;
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                this.getAttendance(startDate, endDate);
                this.sd = sd;
                setTimeout(this.getAnalysisAttendance, 1000);
                //this.getAnalysisAttendance(sd);
            },
            getAttendance: function(start, end) {
                db.collection("attendance").where("config", "==", this.$store.state.config).orderBy("inTime").startAt(start).endAt(end)
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            array.push(d);
                        });
                        this.ramens = array;
                        // DailyMessage
                        this.getDailyMessage();
                        // 集計
                        this.doTabulate();
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
                db.collection("attendance").where("config", "==", this.$store.state.config).where("inTime", "<=", endDate).orderBy("inTime", "desc").limit(1)
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        var d;
                        querySnapshot.forEach((doc) => {
                            d = doc.data().inTime;
                        });
                        if (!querySnapshot.empty) {
                            this.getUser(d.toDate());
                            // 日付をセット
                            this.innerSearchText = d.toDate();                          
                        } else {
                            this.getUser(new Date());                            
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            doTabulate: function() {
                // 集計
                let times = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
                times.forEach(time => {
                    this.getAttendanceTime(time)
                });  
            },
            getAttendanceTime: function(time) {
                // カウント
                var cnt = 0;
                this.ramens.forEach(ramen => {
                    var ih = ramen.inTime.toDate().getHours();
                    var oh = ramen.outTime?ramen.outTime.toDate().getHours():"";     
                    if (time >= ih && time <= oh) cnt++;                                     
                });
                //console.log(time, cnt);
                // DBに書き込み
                var d = this.today;
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), time, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), time, 59, 59);
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("analysis").where("config", "==", this.$store.state.config).where("date", ">=", startDate).where("date", "<=", endDate).where("class", "==", "attendanceDaily").orderBy("date")
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        let a = null;
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            a = d;
                        });
                        if (querySnapshot.empty) {
                            db.collection("analysis").doc()
                                .set({
                                    config: this.$store.state.config,
                                    date: startDate,
                                    class: "attendanceDaily",
                                    count: cnt
                                })
                                .then(() => {
                                    console.log("Document successfully written!");
                                    // Reload
                                    //this.$router.go({path: this.$router.currentRoute.path, force: true})
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                            });
                        } else {
                            db.collection("analysis").doc(a.id)
                                .update({
                                    count: cnt
                                })
                                .then(() => {
                                    console.log("Document successfully written!");
                                    // Reload
                                    //this.$router.go({path: this.$router.currentRoute.path, force: true})
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                            });
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                
            },
            getAnalysisAttendance: function() {
                //var d = date;
                var d = this.sd;
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("analysis").where("config", "==", this.$store.state.config).where("date", ">=", startDate).where("date", "<=", endDate).where("class", "==", "attendanceDaily").orderBy("date")
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = []
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            array.push(d);    
                        });
                        this.analysis = array;
                        if (array.length) this.fillData(array);
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            getDailyMessage: function() {
                // DailyMessageの取得
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
            changeDate: function() {
                window.open(this.picked, "_self");
                /*
                this.today = this.picked;
                var d = new Date(this.today);
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                this.getAttendance(startDate, endDate);
                this.getAnalysisAttendance(sd);
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
            fillDataTest () {               
                this.dataCollection = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    datasets: [
                        {
                        label: 'GitHub Commits',
                        backgroundColor: '#f87979',
                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
                        }
                    ]
                }
            },
            fillData (data) {
                if (!data) return; 
                this.chartOption = { responsive: true, 
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true, 
                                    min: 0,
                                    max: 50 
                                }
                            }
                        ]
                    }
                }                  
                this.dataCollection = {
                    labels: [this.formatDate(data[0].date.toDate(), 'H:mm'), 
                        this.formatDate(data[1].date.toDate(), 'H:mm'), 
                        this.formatDate(data[2].date.toDate(), 'H:mm'), 
                        this.formatDate(data[3].date.toDate(), 'H:mm'), 
                        this.formatDate(data[4].date.toDate(), 'H:mm'), 
                        this.formatDate(data[5].date.toDate(), 'H:mm'), 
                        this.formatDate(data[6].date.toDate(), 'H:mm'), 
                        this.formatDate(data[7].date.toDate(), 'H:mm'), 
                        this.formatDate(data[8].date.toDate(), 'H:mm'),
                        this.formatDate(data[9].date.toDate(), 'H:mm'),
                        this.formatDate(data[10].date.toDate(), 'H:mm'),
                        this.formatDate(data[11].date.toDate(), 'H:mm'),
                        this.formatDate(data[12].date.toDate(), 'H:mm'),
                        this.formatDate(data[13].date.toDate(), 'H:mm'),
                        this.formatDate(data[14].date.toDate(), 'H:mm'),
                        this.formatDate(data[15].date.toDate(), 'H:mm'),
                        this.formatDate(data[16].date.toDate(), 'H:mm')
                    ],
                    datasets: [{
                        label: this.$t("Number of people"),
                        backgroundColor: '#f87979',
                        data: [data[0].count, 
                            data[1].count, 
                            data[2].count, 
                            data[3].count, 
                            data[4].count, 
                            data[5].count, 
                            data[6].count, 
                            data[7].count, 
                            data[8].count,
                            data[9].count,
                            data[10].count
                        ]}
                    ]
                }
                
            },
            getRandomInt () {
                return Math.floor(Math.random() * (50 - 5 + 1)) + 5
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
    })
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
    .about {
        min-width: 600px;
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
    .width100 {
        width: 100px;
    }
    .width120 {
        width: 120px;
    }
    .width90 {
        min-width: 90px;
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
    .margin40 {
        margin: 40px;
    }
</style>