<template>
    <div class="attendance"><Menu class="sticky-top"></Menu>
        <div class="container-fluid">    
            <h4>{{ $t("Entry") }} {{ format(today, 'MMM do (E)', {locale: locale}) }}</h4>
            <!--<button @click='getUser' class='btn btn-primary mt-3'>Get User</button>-->
            <div>{{ $t("people_") }} {{ entryNum }} {{ $t("on board.") }}</div>
            
            <button v-if='today.getFullYear() === today0.getFullYear() && today.getMonth() === today0.getMonth() && today.getDate() === today0.getDate()' class='btn btn-primary btn_' @click='entryMe(memberUid, member.displayName)'>{{ $t("Entry") }}</button>
            <button v-if='today.getFullYear() === today0.getFullYear() && today.getMonth() === today0.getMonth() && today.getDate() === today0.getDate()' class='btn btn-primary btn_' @click="selectMember()">{{ $t("Register others") }}</button>
            <button v-if='today.getFullYear() === today0.getFullYear() && today.getMonth() === today0.getMonth() && today.getDate() === today0.getDate()' class='btn btn-secondary btn_' @click='outMe(memberUid)'>{{ $t("Exit") }}</button>
            <button v-if='entryNum > 0 && $store.state.isAdmin' class='btn btn-secondary btn_' @click='outAllMember'>{{ $t("All exits") }}</button>
            <div class="row">
                <div class="col-sm-2"></div>
                <div class="col-sm-8"> 
                    <datepicker 
                        v-model="picked" 
                        :locale="locale"
                        :weekStartsOn=0
                    />
                </div>
                <div class="col-sm-2"></div>
            </div>
            <div class="margin"></div>
            <div class="row">
                <div class="col-md-1 col-lg-2"></div>
                <div class="col-md-10 col-lg-8">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col" class="width70">{{ $t("In") }}</th>
                                    <th scope="col" class="width70">{{ $t("Out") }}</th>
                                    <th scope="col" class="width120">{{ $t("Name") }}</th>
                                    <th scope="col" class="width80"></th>
                                    <th scope="col" class="width70"></th>
                                    <th scope="col" class="width70"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(ramen, key) in ramens" :key="key">
                                    <th scope="row">{{ key + 1 }}</th>
                                    <td>{{ formatDate(ramen.inTime.toDate(), 'H:mm') }}</td>
                                    <td><div v-if='ramen.outTime'>{{ formatDate(ramen.outTime.toDate(), 'H:mm') }}</div></td>
                                    <td>{{ ramen.name }}</td>
                                    <td>
                                        <div class="form-check-inline nowrap">
                                            <input :disabled="memberUid!=ramen.memberUid || !(today.getFullYear() === today0.getFullYear() && today.getMonth() === today0.getMonth() && today.getDate() === today0.getDate())" 
                                                class="form-check-input" type="checkbox" value="" id="flexCheckChecked" 
                                                v-model="ramen.payment" @change="updateAttendance(ramen.id, ramen.payment)"
                                            >
                                            <label class="form-check-label" for="flexCheckChecked">
                                                {{ $t("entry fee") }}
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <button v-if='!ramen.outTime && $store.state.isAdmin' class='btn btn-secondary btn-sm' @click="outMember(ramen.id, ramen.memberUid, ramen.name)">
                                            {{ $t("Exit") }}
                                        </button>
                                    </td>
                                    <td>
                                        <button v-if='$store.state.isAdmin' class='btn btn-danger btn-sm' @click="deleteAttendance(ramen.id, ramen.memberUid, ramen.name)">
                                            {{ $t("Delete") }}
                                        </button>
                                        
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
                today0: new Date(),
                innerSearchText: new Date(this.$route.params.id),
                locale: ja,
                format: format,
                entryNum: null,
                source: this.$store.state.getOption,
                member: null,
                memberUid: null
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
                // メンバー情報取得
                db.collection("members").where("userUid", "==", this.loginUser.uid)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            console.log(doc.id, " => ", doc.data());
                            this.member = doc.data()
                            this.memberUid = doc.id
                        });
                        //this.getGameEntries()
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
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
            this.getAttendance()
            this.getEntryNum()           
            // 日付をセット
            this.innerSearchText = this.today;
            this.setLanguage();
        },
        methods: {
            getAttendance: function () {
                // 出欠データ取得
                var d = this.today;
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("attendance").where("config", "==", this.$store.state.config).orderBy("inTime").startAt(startDate).endAt(endDate)
                    .get(this.soruce)
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
            goMenu: function () {
                this.$router.push(`/main`);
            },
            selectMember: function () {
                this.$router.push(`/memberattendance`);
            },
            outMember: function(docid, uid, name) {
                let result = true
                if (name) result = window.confirm(this.$t("I'm leaving. May I ") + name + "?");
                if (result) {
                    db.collection("attendance").doc(docid).update({
                        outTime: firebase.firestore.Timestamp.fromDate(new Date())
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                        // メンバーのエントリーフラグを変更
                        db.collection("members").doc(uid).update({
                            entry: false,
                            game: false,
                            reserved: false
                        })
                        .then(() => {
                            console.log("Document successfully written!");
                            // 参加人数をカウント
                            db.collection("members").where("config", "==", this.$store.state.config).where("entry", "==", true)
                                .get(this.source)
                                .then((querySnapshot) => {
                                    var cnt = 0;
                                    querySnapshot.forEach((doc) => {
                                        console.log(doc.id, " => ", doc.data()); 
                                        cnt++;
                                    });
                                    db.collection("entryNum").doc().set({
                                        config: this.$store.state.config,
                                        date: firebase.firestore.Timestamp.fromDate(new Date()),
                                        num: cnt
                                    })
                                    .then(() => {
                                        // Reload
                                        //this.$router.go({path: this.$router.currentRoute.path, force: true})
                                        this.getAttendance()
                                        this.getEntryNum()
                                        return true
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                                    
                                })
                                .catch((error) => {
                                    console.log("Error getting documents: ", error);
                            });
                        })
                        .catch((error) => {
                            console.error("Error writing document: ", error);
                        });
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                } else {
                    return false
                }
            },
            outAllMember: function() {
                let result = window.confirm('全てのメンバーを退出にします。よろしいですか？');
                if( result ) {
                    // 出欠データ取得
                    var d = this.today;
                    var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                    var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                    this.today = d;
                    const startDate = firebase.firestore.Timestamp.fromDate(sd);
                    const endDate = firebase.firestore.Timestamp.fromDate(ed);
                    db.collection("attendance").where("config", "==", this.$store.state.config).orderBy("inTime").startAt(startDate).endAt(endDate)
                        .get(this.soruce)
                        .then((querySnapshot) => {
                            const array = [];
                            querySnapshot.forEach((doc) => {
                                const d = doc.data();
                                d.id = doc.id;
                                if (!d.outTime) {
                                    array.push(d);
                                }
                            });
                            array.forEach(atd => {
                                db.collection("attendance").doc(atd.id)
                                    .update({
                                        outTime: firebase.firestore.Timestamp.fromDate(new Date())
                                    })
                                    .then(() => {
                                        console.log("Document successfully written!", "attendance", atd.id);
                                        // メンバーのエントリーフラグを変更
                                        db.collection("members").doc(atd.memberUid)
                                            .update({
                                                entry: false,
                                                game: false,
                                                reserved: false
                                            })
                                            .then(() => {
                                                console.log("Document successfully written!", "members", atd.memberUid);
                                            })
                                            .catch((error) => {
                                                console.error("Error writing document: ", error);
                                        });
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                });
                            });
                            // 参加人数を0に
                            db.collection("entryNum").doc().set({
                                    config: this.$store.state.config,
                                    date: firebase.firestore.Timestamp.fromDate(new Date()),
                                    num: 0
                                })
                                .then(() => {
                                    // データの再取得
                                    this.getAttendance()
                                    this.getAttendanceNum();
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                }); 
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                    });
                }
                else {
                    return
                }              
            },
            changeDate: function() {
                this.today = this.picked
                this.getAttendance()
                //this.getAttendanceNum()
            },
            updateAttendance: function(id, value) {
                db.collection("attendance").doc(id).update({
                        payment: value
                    })
                    .then(() => {
                        console.log("Document successfully written!");                        
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            },
            deleteAttendance: function(docid, uid) {
                this.outMember(docid, uid)
                db.collection("attendance").doc(docid).delete().then(() => {
                    console.log("Document successfully deleted!");
                    // Reload
                    var d = this.picked;
                    //this.$router.go({path: this.$router.currentRoute.path, force: true})
                    console.log("reload:", d);
                    this.innerSearchText = d;
                    
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            },
            entryMe: function(uid, name) {
                // エントリー（ログインユーザのエントリー）
                // 未エントリーをチェック
                //var d = this.today;
                var d = new Date();
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("attendance").where("config", "==", this.$store.state.config).where("memberUid", "==", uid).orderBy("inTime").startAt(startDate).endAt(endDate)
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        let i = 0  
                        querySnapshot.forEach((doc) => {
                            // 入室時間があって退室時間がないものをカウント
                            if (doc.data().inTime && !doc.data().outTime) i++
                        });
                        if (i > 0) {
                            // エントリー済みなら警告
                            window.alert(this.$t("Already registered"));
                        } else {
                            // エントリー処理
                            let result = window.confirm(this.$t("Are you sure you want to enter?"))
                            if (!result) return
                            db.collection("attendance").doc().set({
                                // attendanceに追加
                                config: this.$store.state.config,
                                inTime: firebase.firestore.Timestamp.fromDate(new Date()),
                                memberUid: uid,
                                name: name
                            })
                            .then(() => {
                                console.log("Document successfully written!");
                                // メンバーのエントリーフラグを立てる
                                db.collection("members").doc(uid).update({
                                    entry: true,
                                    game: false,
                                    reserved: false
                                })
                                .then(() => {
                                    console.log("Document successfully written!");
                                    // 参加人数をカウント
                                    db.collection("members").where("entry", "==", true)
                                        .get()
                                        .then((querySnapshot) => {
                                            var cnt = 0;
                                            querySnapshot.forEach((doc) => {
                                                // doc.data() is never undefined for query doc snapshots
                                                console.log(doc.id, " => ", doc.data()); 
                                                cnt++;
                                            });
                                            //this.$store.commit('setEntryNum', cnt)
                                            //console.log(cnt + "人")
                                            //console.log(this.$store.state.entryNum + "人")
                                            db.collection("entryNum").doc().set({
                                                config: this.$store.state.config,
                                                date: firebase.firestore.Timestamp.fromDate(new Date()),
                                                num: cnt
                                            })
                                            .then(() => {
                                                // エントリーに戻る
                                                //this.$router.push({ name: 'entry', params: { id: new Date() } })
                                                // Reload
                                                this.getAttendance()
                                                this.getEntryNum()
                                            })
                                            .catch((error) => {
                                                console.error("Error writing document: ", error);
                                            });
                                        })
                                        .catch((error) => {
                                            console.log("Error getting documents: ", error);
                                    });
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
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
            /*getAndSetMember: function (docid) {
                db.collection("members").doc(docid).update({
                    entry: false
                })
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },*/
            outMe: function(uid) {
                // docidを調べる
                var d = new Date();
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("attendance").where("config", "==", this.$store.state.config).where("memberUid", "==", uid).orderBy("inTime").startAt(startDate).endAt(endDate)
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        let i = 0;
                        let docid; 
                        querySnapshot.forEach((doc) => {   
                            docid = doc.id
                            i++
                        });
                        if (i == 0) {
                            // エントリーがなければ警告
                            window.alert(this.$t("Not registered"));
                        } else {
                            // 退出時間をチェック
                            let docRef = db.collection("attendance").doc(docid);
                            docRef.get(this.source).then((doc) => {
                                if (doc.exists) {
                                    if (doc.data().outTime) {
                                        // 退出済みなら警告
                                        window.alert(this.$t("Already exited"));
                                    } else {
                                        let result = window.confirm(this.$t("I'm leaving. May I?"));
                                        if( result ) {
                                            // 退出処理
                                            db.collection("attendance").doc(docid).update({
                                                outTime: firebase.firestore.Timestamp.fromDate(new Date())
                                            })
                                            .then(() => {
                                                console.log("Document successfully written!");
                                                // メンバーのエントリーフラグを変更
                                                db.collection("members").doc(uid).update({
                                                    entry: false,
                                                    game: false,
                                                    reserved: false
                                                })
                                                .then(() => {
                                                    console.log("Document successfully written!");
                                                    // 参加人数をカウント
                                                    db.collection("members").where("config", "==", this.$store.state.config).where("entry", "==", true)
                                                        .get(this.source)
                                                        .then((querySnapshot) => {
                                                            var cnt = 0;
                                                            querySnapshot.forEach((doc) => {
                                                                console.log(doc.id, " => ", doc.data()); 
                                                                cnt++;
                                                            });
                                                            db.collection("entryNum").doc().set({
                                                                config: this.$store.state.config,
                                                                date: firebase.firestore.Timestamp.fromDate(new Date()),
                                                                num: cnt
                                                            })
                                                            .then(() => {
                                                                // Reload
                                                                //this.$router.go({path: this.$router.currentRoute.path, force: true})
                                                                this.getAttendance()
                                                                this.getEntryNum()
                                                            })
                                                            .catch((error) => {
                                                                console.error("Error writing document: ", error);
                                                            });
                                                            
                                                        })
                                                        .catch((error) => {
                                                            console.log("Error getting documents: ", error);
                                                    });
                                                })
                                                .catch((error) => {
                                                    console.error("Error writing document: ", error);
                                                });
                                            })
                                            .catch((error) => {
                                                console.error("Error writing document: ", error);
                                            });                                         
                                        }
                                    }
                                } else {
                                    console.log("No such document!");
                                }
                                }).catch((error) => {
                                    console.log("Error getting document:", error);
                            });                                                                    
                        }                          
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });                   
            },
            getEntryNum: function() {
                // 参加人数(人数記録用Collectionから取得)
                //var d = new Date(this.today);
                console.log("getEntryNum")
                var d = new Date();
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                this.entryNum = 0
                db.collection("entryNum").where("config", "==", this.$store.state.config).where("date", ">=", startDate).orderBy("date", "desc").limit(1)
                    .get(this.soruce)
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
            getAttendanceNum: function() {
                // 参加人数(attendaneから取得)
                var d = this.today;
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("attendance").where("config", "==", this.$store.state.config).where("inTime", ">=", startDate).where("inTime", "<=", endDate)
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            if (!d.outTime) {
                                array.push(d);
                            }
                            this.entryNum = array.length;
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
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
                        this.locale = ja;
                        this.$i18n.locale = "ja"
                }               
            }
        }
    }
</script>

<style scoped>
    .attendance {
        min-width: 376px;
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
    .btn__ {
        margin: 0 0 0 -10px;
    }
    .margin {
        margin: 20px;
    }  
    .width70 {
        min-width: 70px;
        max-width: 71px;
    }
    .width80 {
        min-width: 80px;
    }
    .width100 {
        min-width: 100px;
    }
    .width120 {
        min-width: 120px;
    }
    .nowrap {
        white-space: nowrap;
    }
</style>