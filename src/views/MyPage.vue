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
                            {{ member.displayName }}
                        </h5>
                        <div>
                            <img :src='loginUser.photoURL'>
                        </div>
                    </div>
                </div>

                <div class="col-12">
                    <!--削除ボタン-->
                    <!--<button
                        @click='deleteUser'
                        class='btn btn-primary mt-3'
                    >ユーザー削除</button>-->
                </div>
            </div>
            <div class="margin"></div>
        <div class="row">
            <div class="col-lg-1"></div>
            <div class="col-lg-10">
                <table class="table" id="my-table1">
                    <thead>
                        <tr>
                            <!--<th scope="col" class='width60'>#</th>-->
                            <th scope="col" class='width120' data-id="date">日付</th>
                            <th scope="col" class='court' data-id="courtName">コート</th>
                            <th scope="col" class='width80' data-id="start">開始</th>
                            <th scope="col" class='width80' data-id="end">終了</th>
                            <th class='width250' data-id="members">メンバー</th>
                            <th scope="col" class='width120' data-id="result">結果</th>         
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ramen, key) in ramens" :key="key">
                            <!--<th scope="row">{{ key + 1 }}</th>-->
                            <td>{{ ramen.date }}</td>
                            <td>{{ ramen.courtName }}</td>
                            <td><div v-if='ramen.start'>{{ ramen.start }}</div></td>
                            <td><div v-if='ramen.end'>{{ ramen.end }}</div></td>
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
                            <td>{{ ramen.score }} - {{ ramen.opponentScore }} {{ ramen.remarks }}</td>
                        </tr>
                    </tbody>
                </table>
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
    import ja from 'date-fns/locale/ja'
    import SortableTable from '@riversun/sortable-table'

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
                sortableTable: null
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
            }
        }
    }
</script>

<style scoped>
    .mypage {
        min-width: 700px;
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
</style>