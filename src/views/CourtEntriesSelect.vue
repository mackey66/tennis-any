<template>
    <div class="about">
        
        <h4>{{ $t("Please make a selection.") }}</h4>
        <div class="row margin">
            <div class="col-sm-2 col-md-3"></div>
            <div class="col-sm-8 col-md-6" >
                <date-picker 
                    locale="en" 
                    format="YYYY/MM/DD" 
                    v-model="dates" 
                    multiple 
                    @change="selectedDate()" 
                />
            </div>
        </div>
        <div class="margin"></div>
        <div class="row">
            <div class="col-sm-2"></div>
            <div class="col-sm-4">
                <div class="form-check-inline">
                    <input class="form-check-input" type="checkbox" value="" v-model="thursdayMeeting" @change="changedThursdayMeetingCheck()">
                    <label class="form-check-label" for="flexCheckChecked">
                        {{ $t("Thursday meeting") }}
                    </label>
                </div>
                <div class="form-check-inline">
                    <input class="form-check-input" type="checkbox" value="" v-model="seaside" @change="changedSeasideCheck()">
                    <label class="form-check-label" for="flexCheckChecked">
                        {{ $t("Seaside") }}
                    </label>
                </div>
            </div>
            <div class="col-sm-2"></div>
        </div>
        <div class="row">         
            <div class="col-sm-2 col-md-3"></div>
            <div class="col-sm-8 col-md-6">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{{ $t("Court") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ramen, key) in ramens" :key="key">
                            <th scope="row">{{ key + 1 }}</th>
                            <td>
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.payment" @change="selectCourt(ramen.no, ramen.id, ramen.name)">
                                <label class="form-check-label" for="flexCheckChecked">
                                    {{ ramen.name }}
                                </label>
                            </td>
                            <!--<td><button class='btn btn-primary btn-sm' @click='entryCourt(ramen.id, ramen.name)'>{{ $t("Choice") }}</button></td>-->
                        </tr>
                    </tbody>
                </table>
            </div>             
        </div>
        <button class='btn btn-secondary btn_' @click="cancel()">{{ $t("Cancel") }}</button>
        <button class='btn btn-primary btn_' @click="entryOk()">{{ $t("OK") }}</button>
    </div>    
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase'
    import { db } from "../main";
    //import { ref } from 'vue'
    import DatePicker from 'vue3-persian-datetime-picker'
    import { ja, enUS, zhCN, zhTW, ru, de, fr, nl, es, pt, it, arSA, ko, sr, cs, ro, hr, sv, sk } from 'date-fns/locale'
    //import Menu from '@/components/Menu.vue'
    //require('firebase/firestore')

    //var memberRef = db.collection("users");
    export default {
        name: 'courts',
        components: {   
            DatePicker,
        },
        data() {
            return {
                ramens: [],
                isLogin: false,
                loginUser: null,
                source: this.$store.state.getOption,
                today: new Date(this.$route.params.id),
                selected: [],
                dates: [this.formatDate(new Date(this.$route.params.id), 'yyyy/MM/dd')],
                thursdayMeeting: false,
                seaside: false,
            }
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
            });
            this.getCourt()
            this.setLanguage()
            this.thursdayMeeting = this.$store.state.thursdayMeeting
            this.seaside = this.$store.state.seaside
        },
        methods: {
            getCourt: function() {
                // コート取得
                db.collection("courts").where("config", "==", this.$store.state.config).orderBy("no")
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            if (d.no != 0) {
                                array.push(d);
                            }                           
                        });
                        this.ramens = array
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            selectedDate: function() {
                console.log("dates: ", this.dates);
            },
            selectCourt: function(no, docid, name) {
                if (!this.selected.find(e => e.uid === docid)) {
                    this.selected.push({no: no, uid: docid, name: name});
                } else {
                    this.selected = this.selected.filter((item) => item.uid !== docid)
                }
                /*
                if (!this.selected[no]) {
                    this.selected[no] = docid;
                    this.selected[no] = name;
                } else {
                    delete this.selected[no];
                }
                */
                //console.log("selected: ", this.selected);
            },
            changedThursdayMeetingCheck: function() { 
                // 両方チェックはない 
                if (this.thursdayMeeting && this.seaside) {
                    this.seaside = false
                }  
            },
            changedSeasideCheck: function() {
                // 両方チェックはない 
                if (this.thursdayMeeting && this.seaside) {
                    this.thursdayMeeting = false
                }
            },
            entryOk: function() {
                const courts = this.selected.sort((a,b) => a.no - b.no)
                const dates = this.dates.sort()
                const config = this.$store.state.config;
                console.log(this.thursdayMeeting)
                // 9時から17時までs時間単位で
                let from = 9
                let to = 17
                // 木曜会の時間帯
                if (this.thursdayMeeting) {
                    from = 10
                    to = 12
                }
                // 臨海の時間帯
                if (this.seaside) {
                    from = 11
                }
                const s = 2;
                const tm = this.thursdayMeeting
                const ss = this.seaside
                if (Object.keys(courts).length && Object.keys(dates).length) {
                    //console.log("selected: ", obj);
                    Object.keys(dates).forEach(function (key) {
                        courts.forEach(function (element) {
                            for (let i = from; i < to; i += s){
                                //let court = courts.find((item) => item.uid === key);
                                //console.log(config + " " + dates[key_] + " " + i + ":00 " + key + ":" + courts[key]);             
                                db.collection("courtEntries").doc().set({
                                    config: config,
                                    courtUid: element.uid,
                                    courtName: element.name,
                                    courtNo: element.no,
                                    date: firebase.firestore.Timestamp.fromDate(new Date(dates[key] + " " + i + ":00:00")),
                                    end: firebase.firestore.Timestamp.fromDate(new Date(dates[key] + " " + (i + s) + ":00:00")),
                                    thursdayMeeting: tm,
                                    seaside: ss,
                                })
                                .then(() => {
                                    console.log("Document successfully written!");
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });            
                            }                          
                        });
                    });
                    // 戻る
                    this.$router.push({ name: 'courtentries', params: { id: this.today } });
                } else {
                    // 日付とコートが選択されてなければ警告
                    window.alert(this.$t("Please make a selection."));
                }
                
            },
            cancel: function() {
                this.$router.go(-1)
            },
            formatDate: function (date, format) {
                format = format.replace(/yyyy/g, date.getFullYear());
                format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
                format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
                format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
                //format = format.replace(/M/g, (date.getMonth() + 1));
                //format = format.replace(/d/g, (date.getDate()));
                //format = format.replace(/H/g, (date.getHours()));
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
    .btn {
        margin: 10px;
    }
    .margin {
        margin: 20px;
    }

</style>