<template>
    
    <div class='mypage'><Menu class="sticky-top"></Menu>    
        <div class="container-fluid">        
            
            <div class="row">
                <div class="col-12">
                    <h4>{{ $t("MyPage") }}</h4>
                </div>

                <div class="col-12">
                    <div v-if='isLogin'>
                        <div>
                            {{loginUser.displayName}}
                        </div>
                        <h5 v-if='member'>
                            {{ member.nameSei }} {{ member.nameNa }}
                        </h5>
                        <div>
                            <img :src='loginUser.photoURL'>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <button @click='editMember(memberUid)' class='btn btn-primary mt-3'>{{ $t("Edit") }}</button>
                    <button @click='unlinkMember(memberUid)' class='btn btn-danger mt-3'>{{ $t("Unlink") }}</button>
                    <button v-if='$store.state.opas && opasId' class='btn btn-success mt-3' @click='loginOpas(opasId, opasPass)'><fa icon="sign-in-alt" />&ensp;{{ $t("Login") }}</button>
                </div>
            </div>
            <div class="margin"></div>
        <div class="row">
            <div class="col-lg-1"></div>
            <div class="col-lg-10">
                <div class="table-responsive">
                    <table class="table" id="my-table1">
                        <thead>
                            <tr>
                                <!--<th scope="col" class='width60'>#</th>-->
                                <th scope="col" class='width120 nowrap' data-id="date">{{ $t("Date") }}</th>
                                <th scope="col" class='court nowrap' data-id="courtName">{{ $t("Court") }}</th>
                                <th scope="col" class='width80' data-id="start">{{ $t("Start") }}</th>
                                <th scope="col" class='width80' data-id="end">{{ $t("End") }}</th>
                                <th class='width250' data-id="members">{{ $t("Member") }}</th>
                                <th scope="col" class='width120' data-id="result">{{ $t("Result") }}</th>         
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(ramen, key) in ramens" :key="key">
                                <!--<th scope="row">{{ key + 1 }}</th>-->
                                <td>{{ ramen.date }}</td>
                                <td>{{ ramen.courtName }}</td>
                                <td><div v-if='ramen.start'>{{ ramen.start }}</div></td>
                                <td><div v-if='ramen.end'>{{ ramen.end }}</div></td>
                                <td class="nowrap">
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
                                <td class="nowrap">{{ ramen.score }} - {{ ramen.opponentScore }} {{ ramen.remarks }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div> 
            <div class="col-lg-1"></div>        
        </div>
        </div>
    </div>
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase'
    import { db } from "../main";
    import Menu from '@/components/Menu.vue'
    import { format } from 'date-fns'
    //import ja from 'date-fns/locale/ja'
    import crypto from 'crypto-js';
    import SortableTable from '@riversun/sortable-table'
    import { ja, enUS, zhCN, zhTW, ru, de, fr, nl, es, pt, it, arSA, ko, sr, cs, ro, hr, sv, sk } from 'date-fns/locale'

    export default {
        name: 'Main',
        components: {
            Menu
        },
        data() {
            return {
                isLogin: false,
                loginUser: null,
                member: null,
                memberUid: null,
                ramens: [],
                source: this.$store.state.getOption,
                format: format,
                locale: ja,
                sortableTable: null,
                opasId: null,
                opasPass: null
            };
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
                            if (this.member.opasPass) {
                                const decrypted = crypto.AES.decrypt(this.member.opasPass, 'pass');
                                this.opasId = this.member.opasId
                                this.opasPass = decrypted.toString(crypto.enc.Utf8);
                                //console.log("opasId: " + this.opasId);
                                //console.log("opasPass: " + this.opasPass);
                            }   
                        });                      
                        this.getGameEntries()
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            });
            // table要素を指定する #SortableTable
            this.sortableTable = new SortableTable()
            this.sortableTable.setTable(document.querySelector('#my-table1'));
            this.sortableTable.events()
                .on('sort', (event) => {
                    
                    console.log(`[SortableTable#onSort]
                    event.colId=${event.colId}
                    event.sortDir=${event.sortDir}
                    event.data=\n${JSON.stringify(event.data)}`);
                    
                });
            this.setLanguage();
        },
        methods: {
            getGameEntries: function() {
                // ゲームデータ取得
                /*
                var d = date;
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                */
                console.log("source", this.source)
                // Member1
                db.collection("gameEntries").where("member1Uid", "==", this.memberUid)//.orderBy("date", "desc")
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            d.date = this.formatDate(doc.data().date.toDate(), 'yyyy-MM-dd')
                            d.start = this.formatDate(doc.data().start.toDate(), 'H:mm')
                            d.end = doc.data().end?this.formatDate(doc.data().end.toDate(), 'H:mm'):""
                            d.result = (doc.data().score?doc.data().score:"") + " - " + (doc.data().opponentScore?doc.data().opponentScore:"") + " " + (doc.data().remarks?doc.data().remarks:"")
                            if (doc.data().member3Name) {
                                d.members = doc.data().member1Name + "・" + doc.data().member2Name + " − " + doc.data().member3Name + "・" + doc.data().member4Name
                            } else {
                                d.members = doc.data().member1Name + " − " + doc.data().member2Name
                            }                           
                            if (d.end) array.push(d);
                        });
                        // Member2
                        db.collection("gameEntries").where("member2Uid", "==", this.memberUid)//.orderBy("date", "desc")
                            .get(this.source)
                            .then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    const d = doc.data();
                                    d.id = doc.id;
                                    d.date = this.formatDate(doc.data().date.toDate(), 'yyyy-MM-dd')
                                    d.start = this.formatDate(doc.data().start.toDate(), 'H:mm')
                                    d.end = doc.data().end?this.formatDate(doc.data().end.toDate(), 'H:mm'):""
                                    d.result = (doc.data().score?doc.data().score:"") + " - " + (doc.data().opponentScore?doc.data().opponentScore:"") + " " + (doc.data().remarks?doc.data().remarks:"")
                                    if (doc.data().member3Name) {
                                        d.members = doc.data().member1Name + "・" + doc.data().member2Name + " − " + doc.data().member3Name + "・" + doc.data().member4Name
                                    } else {
                                        d.members = doc.data().member1Name + " − " + doc.data().member2Name
                                    }
                                    if (d.end) array.push(d);
                                });
                                // Member3
                                db.collection("gameEntries").where("member3Uid", "==", this.memberUid)//.orderBy("date", "desc")
                                    .get(this.source)
                                    .then((querySnapshot) => {
                                        querySnapshot.forEach((doc) => {
                                            const d = doc.data();
                                            d.id = doc.id;
                                            d.date = this.formatDate(doc.data().date.toDate(), 'yyyy-MM-dd')
                                            d.start = this.formatDate(doc.data().start.toDate(), 'H:mm')
                                            d.end = doc.data().end?this.formatDate(doc.data().end.toDate(), 'H:mm'):""
                                            d.result = (doc.data().score?doc.data().score:"") + " - " + (doc.data().opponentScore?doc.data().opponentScore:"") + " " + (doc.data().remarks?doc.data().remarks:"")
                                            if (doc.data().member3Name) {
                                                d.members = doc.data().member1Name + "・" + doc.data().member2Name + " − " + doc.data().member3Name + "・" + doc.data().member4Name
                                            } else {
                                                d.members = doc.data().member1Name + " − " + doc.data().member2Name
                                            }
                                            if (d.end) array.push(d);
                                        });
                                        // Member4
                                        db.collection("gameEntries").where("member4Uid", "==", this.memberUid)//.orderBy("date", "desc")
                                            .get(this.source)
                                            .then((querySnapshot) => {
                                                querySnapshot.forEach((doc) => {
                                                    const d = doc.data();
                                                    d.id = doc.id;
                                                    d.date = this.formatDate(doc.data().date.toDate(), 'yyyy-MM-dd')
                                                    d.start = this.formatDate(doc.data().start.toDate(), 'H:mm')
                                                    d.end = doc.data().end?this.formatDate(doc.data().end.toDate(), 'H:mm'):""
                                                    d.result = (doc.data().score?doc.data().score:"") + " - " + (doc.data().opponentScore?doc.data().opponentScore:"") + " " + (doc.data().remarks?doc.data().remarks:"")
                                                    if (doc.data().member3Name) {
                                                        d.members = doc.data().member1Name + "・" + doc.data().member2Name + " − " + doc.data().member3Name + "・" + doc.data().member4Name
                                                    } else {
                                                        d.members = doc.data().member1Name + " − " + doc.data().member2Name
                                                    }
                                                    if (d.end) array.push(d);
                                                });
                                                this.ramens = array
                                                this.sortableTable.setData(array);
                                                this.sortableTable.sort('date', 'desc');
                                            })
                                            .catch((error) => {
                                                console.log("Error getting documents: ", error);
                                        });
                                    })
                                    .catch((error) => {
                                        console.log("Error getting documents: ", error);
                                });
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            deleteUser: function () {
                // ユーザー削除処理
                firebase.auth().currentUser.delete()
                    .then(function(res) {
                        console.log("currentUser.delete", res);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            editMember: function(docid) {
                //console.log(docid)
                this.$router.push({ name: 'memberedit', params: { id: docid } })
            },
            unlinkMember: function(docid) {
                console.log(docid)
                let result = window.confirm(this.$t("Unlink the current member. You will have to re-login and re-link when you run it. Is it OK?"));
                if (result) {
                    // Unlink
                    db.collection("members").doc(docid).update({
                        userUid: ""
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                        // Logout
                        //firebase.auth().signOut(); // Error
                        //this.$router.push({ name: 'login' }) // Error
                        this.$router.push(`/login`);
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });   
                }
            },
            loginOpas: function (id, pass) {
                var url = 'http://133.130.70.244/~ymaki/limited/opas?id=' + id + '&pass=' + pass;
                window.open(url, '_blank');
            },
            formatDate: function (date, format) {
                format = format.replace(/yyyy/g, date.getFullYear());
                format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
                format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
                //format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
                //format = format.replace(/M/g, (date.getMonth() + 1));
                //format = format.replace(/d/g, (date.getDate()));
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
    .mypage {
        min-width: 376px;
    }   
    .container-fluid {
        margin-top: 20px;
    }
    .margin {
        margin: 20px;
    }
    .court {
        min-width: 80px;
    }
    .width60 {
        width: 60px;
    }
    .width80 {
        min-width: 70px;
    }
    .width100 {
        width: 100px;
    }
    .width120 {
        min-width: 120px;
    }
    .width150 {
        min-width: 150px;
    }
    .width250 {
        min-width: 250px;
    }
    .table {
        text-align: left;
    }
    p {display: inline-block; _display: inline;}
    .btn {
        margin: 10px;
        white-space:nowrap;
    }
    .nowrap {
        white-space:nowrap;
    }
</style>