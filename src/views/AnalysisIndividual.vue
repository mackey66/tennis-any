<template>
    
    <div class='analysis'><Menu class="sticky-top"></Menu>    
        <div class="container-fluid">                   
            <div class="row">
                <div class="col-12">
                    <h4>{{ $t("Ranking") }}</h4>
                </div>
            </div>

            <!--<button v-if='$store.state.isAdmin' class='btn btn-danger btn_' @click="deleteAllIndividualPeriod()">表示データの削除</button>
            <button v-if='$store.state.isAdmin' class='btn btn-primary btn_' @click="getRanks()">結果表示</button>-->
            <!--<button v-if='$store.state.isAdmin' class='btn btn-primary ' @click="getAllMembersAnalysis()">全データ再作成</button>
            <div class="margin"></div>-->
            <div class="row">          
<<<<<<< HEAD
                <div class="col-sm-4"></div>
                <div class="col-sm-4">
=======
                <div class="col-4"></div>
                <div class="col-4">
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                    <div class="input-group" >
                    <select class="custom-select" id="inputGroupSelect04" aria-label="Example select with button addon" v-model="period" @change="changedPeriod()">
                        <option selected>...</option>
                        <option value="1" selected>{{ $t("this month") }}</option>
                        <option value="2">{{ $t("previous month") }}</option>
                        <option value="3">{{ $t("this year") }}</option>
                    </select>
                    <div class="input-group-append">
                        <button class="btn btn-outline-primary" type="button" @click="getAnalysis(startDate, endDate)">{{ $t("Update") }}</button>
                    </div>
                </div>
                <div class="col-sm-4"></div>
            </div>

            </div>
<<<<<<< HEAD
            <div class="margin"></div>             
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-10 sortable-table">
                    <div v-if='ramens[0]' class='tips'>{{ $t("Update") }}: {{ formatDate(ramens[0].createdAt.toDate(), 'yyyy-MM-dd H:mm') }}</div>
                    <div class="table-responsive">
                        <table class="table" id="my-table1">
                            <thead>
                                <tr>
                                    <th scope="col" class='width60' data-id="no">#</th>
                                    <th scope="col" class="width120" data-id="memberName">{{ $t("Name") }}</th>
                                    <th scope="col" data-id="win" sortable>{{ $t("wins") }}</th>
                                    <th scope="col" data-id="loss" sortable>{{ $t("losses") }}</th>
                                    <th scope="col" data-id="numberOfGames" sortable>{{ $t("Number of games") }}</th>
                                    <th scope="col" data-id="winningPer" sortable>{{ $t("Winning percentage") }}</th>
                                    <th scope="col" data-id="score" sortable>{{ $t("Score") }}</th>  
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(ramen, key) in ramens" :key="key">
                                    <th scope="row">{{ ramen.no }}</th>
                                    <td class="nowrap">{{ ramen.memberName }}</td>
                                    <td>{{ ramen.win }}</td>
                                    <td>{{ ramen.loss }}</td>
                                    <td>{{ ramen.numberOfGames }}</td>
                                    <td>{{ ramen.winningPer }}</td>
                                    <td>{{ ramen.score }}</td>   
                                </tr>
                            </tbody>
                        </table>
                    </div>
=======
            <div class="margin"></div>  
            <div v-if='ramens[0]' class='tips'>{{ $t("Update") }}: {{ formatDate(ramens[0].createdAt.toDate(), 'yyyy-MM-dd H:mm') }}</div>
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-10 sortable-table">
                    <table class="table" id="my-table1">
                        <thead>
                            <tr>
                                <th scope="col" class='width60' data-id="no">#</th>
                                <th scope="col" class="width120" data-id="memberName">{{ $t("Name") }}</th>
                                <th scope="col" data-id="win" sortable>{{ $t("wins") }}</th>
                                <th scope="col" data-id="loss" sortable>{{ $t("losses") }}</th>
                                <th scope="col" data-id="numberOfGames" sortable>{{ $t("Number of games") }}</th>
                                <th scope="col" data-id="winningPer" sortable>{{ $t("Winning percentage") }}</th>
                                <th scope="col" data-id="score" sortable>{{ $t("Score") }}</th>  
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(ramen, key) in ramens" :key="key">
                                <th scope="row">{{ ramen.no }}</th>
                                <td>{{ ramen.memberName }}</td>
                                <td>{{ ramen.win }}</td>
                                <td>{{ ramen.loss }}</td>
                                <td>{{ ramen.numberOfGames }}</td>
                                <td>{{ ramen.winningPer }}</td>
                                <td>{{ ramen.score }}</td>   
                            </tr>
                        </tbody>
                    </table>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
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
                sortableTable: null,
                startDate: null, 
                endDate: null,
                period: 1
            };
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
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
            //
            var d = new Date()
            var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
            var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
            sd.setDate(1); // 今月1日
            // table要素を指定する #SortableTable
            this.startDate = firebase.firestore.Timestamp.fromDate(sd);
            this.endDate = firebase.firestore.Timestamp.fromDate(ed);
            // set callback function for table cell custom rendering
            this.sortableTable.setCellRenderer((col, row) => {
                const colValue = row[col.id];
                // cell-is-a-header
                if (col.isHeader) {
                    if (typeof colValue !== 'undefined') {
                        return `<th>${colValue}</th>`;
                    }
                    return '<th></th>';
                }
                // cell-is-not-a-header
                if (typeof colValue !== 'undefined') {
                    if (col.id === 'url') {
                        return `<td><a href="${colValue}" target="_blank">${colValue}</a></td>`;
                    } else if (col.id === 'no') {
                        return  `<th>${colValue}</th>`;
                    }
                        return `<td>${colValue}</td>`;
                    }
                return '<td></td>';   
            });
            //
            this.getRanks()
        },
        methods: {
            getAllMembersAnalysis: function() {
                let result = window.confirm('この処理には時間がかかります。よろしいですか？');
                if (!result) return
                // 先に既存データを削除
                this.deleteAllIndividual().then(res => {
                    console.log(res)
                    // Guestと協力会員を除いたMemberを取得して
                    db.collection("members").where("config", "==", this.$store.state.config)
                        .get(this.source)
                        .then((querySnapshot) => {
                            const array = [];
                            querySnapshot.forEach((doc) => {
                                const d = doc.data();
                                d.id = doc.id;
                                d.name = doc.data().nameSei + " " + doc.data().nameNa
                                if (!(d.guest || d.cooperativeMember)) {
                                    array.push(d);
                                }                                          
                            });
                            array.forEach((arr) => {
                                // Analysis用データを作成
                                this.getIndividualGameEntries(arr.id)    
                            });
                            console.log("source", this.source)
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                    });    
                });    
            },
            getAnalysis: function(start, end) {
                // 指定した期間の集計
                // Guestと協力会員を除いたMemberを取得して
                db.collection("members").where("config", "==", this.$store.state.config)
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            d.name = doc.data().nameSei + " " + doc.data().nameNa
                            if (!(d.guest || d.cooperativeMember)) {
                                array.push(d);
                            }                                          
                        });
                        // 先に既存データを削除
                        this.deleteAllIndividualPeriod().then(res => {
                            console.log(res)
                            /*
                            array.forEach((arr) => {
                                // 指定期間のAnalysisデータを作成
                                this.getIndividualAnalysis(arr.id, arr.name, start, end)
                            });
                            */
                            //const result = await Promise.all(array.map(async item => await this.getIndividualAnalysis(item.id, item.name, start, end)))
                            this.getAsyncIndividualAnalysis(array, start, end).then(res => {
                                console.log(res)                               
                            });                              
                        });                    
                        console.log("source", this.source)
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                
            },
            getAsyncIndividualAnalysis: async function(array, start, end) {
                /*const result = await Promise.all(array.map(async (item)=>{
                    const dummy = await this.getIndividualAnalysis(item.id, item.name, start, end);
                    return dummy;
                }));*/
                await Promise.all(array.map(async item => await this.getIndividualAnalysis(item.id, item.name, start, end)))
                // データ表示
                console.log('done!')
                this.getRanks()             
            },
            getRanks: function() {
                db.collection("analysis").where("config", "==", this.$store.state.config).where("class", "==", "individualPeriod").orderBy("win", "desc").orderBy("loss").orderBy("score", "desc")
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = [];
                        let i = 0
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            if (d.numberOfGames > 0) {
                                i++
                                d.no = i
                                array.push(d)
                            }   
                        });
                        this.ramens = array
                        this.sortableTable.setData(array);
                        this.sortableTable.sort('win', 'desc');
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            getIndividualGameEntries: function(docid) {
                // 個人のAnalysis用データ作成
                console.log("source", this.source)
                // Member1
                db.collection("gameEntries").where("member1Uid", "==", docid)//.orderBy("date", "desc")
                    .get(this.source)
                    .then((querySnapshot) => {
                        //const array = [];
                        querySnapshot.forEach((doc) => {                      
                            if (doc.data().end) {
                                //
                                
                                db.collection("analysis").where("config", "==", this.$store.state.config).where("date", "==", doc.data().date).where("memberUid", "==", docid).where("class", "==", "individual")
                                    .get(this.soruce)
                                    .then((querySnapshot) => {
                                        let a = null;
                                        querySnapshot.forEach((doc) => {
                                            const d = doc.data();
                                            d.id = doc.id;
                                            a = d;
                                        });
                                        let win = false
                                        let loss = false
                                        let score = 0
                                        if (doc.data().score) score = doc.data().score
                                        if (doc.data().score > doc.data().opponentScore) win = true
                                        if (doc.data().score < doc.data().opponentScore) loss = true
                                        if (querySnapshot.empty) {
                                            db.collection("analysis").doc()
                                                .set({
                                                    config: this.$store.state.config,
                                                    date: doc.data().date,
                                                    class: "individual",
                                                    memberUid: docid, 
                                                    win: win,
                                                    loss: loss,
                                                    score: score
                                                })
                                                .then(() => {
                                                    console.log("Document successfully written!", "individual");
                                                })
                                                .catch((error) => {
                                                    console.error("Error writing document: ", error);
                                            });
                                        } else {
                                            db.collection("analysis").doc(a.id)
                                                .update({
                                                    win: win,
                                                    loss: loss,
                                                    score: score
                                                })
                                                .then(() => {
                                                    console.log("Document successfully written!", "individual");
                                                })
                                                .catch((error) => {
                                                    console.error("Error writing document: ", error);
                                            });
                                        }
                                    })
                                    .catch((error) => {
                                        console.log("Error getting documents: ", error);
                                });
                            }
                            
                        });
                        // Member2
                        db.collection("gameEntries").where("member2Uid", "==", docid)//.orderBy("date", "desc")
                            .get(this.source)
                            .then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    // そのゲームの参加人数
                                    let num = 0
                                    if (doc.data().member4Uid) {num = 4} else {num = 2}                     
                                    if (doc.data().end) {
                                        //
                                        db.collection("analysis").where("config", "==", this.$store.state.config).where("date", "==", doc.data().date).where("memberUid", "==", docid).where("class", "==", "individual")
                                            .get(this.soruce)
                                            .then((querySnapshot) => {
                                                let a = null;
                                                querySnapshot.forEach((doc) => {
                                                    const d = doc.data();
                                                    d.id = doc.id;
                                                    a = d;
                                                });
                                                let win = false
                                                let loss = false
                                                let score = 0
                                                if (num == 4) {
                                                    score = doc.data().score
                                                    if (doc.data().score > doc.data().opponentScore) win = true
                                                    if (doc.data().score < doc.data().opponentScore) loss = true
                                                } else {
                                                    score = doc.data().opponentScore
                                                    if (doc.data().score < doc.data().opponentScore) win = true
                                                    if (doc.data().score > doc.data().opponentScore) loss = true
                                                }
                                                if (querySnapshot.empty) {
                                                    db.collection("analysis").doc()
                                                        .set({
                                                            config: this.$store.state.config,
                                                            date: doc.data().date,
                                                            class: "individual",
                                                            memberUid: docid, 
                                                            win: win,
                                                            loss: loss,
                                                            score: score
                                                        })
                                                        .then(() => {
                                                            console.log("Document successfully written!", "individual");
                                                        })
                                                        .catch((error) => {
                                                            console.error("Error writing document: ", error);
                                                    });
                                                } else {
                                                    db.collection("analysis").doc(a.id)
                                                        .update({
                                                            win: win,
                                                            loss: loss,
                                                            score: score
                                                        })
                                                        .then(() => {
                                                            console.log("Document successfully written!", "individual");
                                                        })
                                                        .catch((error) => {
                                                            console.error("Error writing document: ", error);
                                                    });
                                                }
                                            })
                                            .catch((error) => {
                                                console.log("Error getting documents: ", error);
                                        });
                                    }
                                });
                                // Member3
                                db.collection("gameEntries").where("member3Uid", "==", docid)//.orderBy("date", "desc")
                                    .get(this.source)
                                    .then((querySnapshot) => {
                                        querySnapshot.forEach((doc) => {                   
                                            if (doc.data().end) {
                                                //
                                                db.collection("analysis").where("config", "==", this.$store.state.config).where("date", "==", doc.data().date).where("memberUid", "==", docid).where("class", "==", "individual")
                                                    .get(this.soruce)
                                                    .then((querySnapshot) => {
                                                        let a = null;
                                                        querySnapshot.forEach((doc) => {
                                                            const d = doc.data();
                                                            d.id = doc.id;
                                                            a = d;
                                                        });
                                                        let win = false
                                                        let loss = false
                                                        let score = 0
                                                        if (doc.data().opponentScore) score = doc.data().opponentScore
                                                        if (doc.data().score < doc.data().opponentScore) win = true
                                                        if (doc.data().score > doc.data().opponentScore) loss = true
                                                        if (querySnapshot.empty) {
                                                            db.collection("analysis").doc()
                                                                .set({
                                                                    config: this.$store.state.config,
                                                                    date: doc.data().date,
                                                                    class: "individual",
                                                                    memberUid: docid, 
                                                                    win: win,
                                                                    loss: loss,
                                                                    score: score
                                                                })
                                                                .then(() => {
                                                                    console.log("Document successfully written!", "individual");
                                                                })
                                                                .catch((error) => {
                                                                    console.error("Error writing document: ", error);
                                                            });
                                                        } else {
                                                            db.collection("analysis").doc(a.id)
                                                                .update({
                                                                    win: win,
                                                                    loss: loss,
                                                                    score: score
                                                                })
                                                                .then(() => {
                                                                    console.log("Document successfully written!", "individual");
                                                                })
                                                                .catch((error) => {
                                                                    console.error("Error writing document: ", error);
                                                            });
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        console.log("Error getting documents: ", error);
                                                });
                                            }
                                        });
                                        // Member4
                                        db.collection("gameEntries").where("member4Uid", "==", docid)//.orderBy("date", "desc")
                                            .get(this.source)
                                            .then((querySnapshot) => {
                                                querySnapshot.forEach((doc) => {
                                                    if (doc.data().end) {
                                                        //
                                                        db.collection("analysis").where("config", "==", this.$store.state.config).where("date", "==", doc.data().date).where("memberUid", "==", docid).where("class", "==", "individual")
                                                            .get(this.soruce)
                                                            .then((querySnapshot) => {
                                                                let a = null;
                                                                querySnapshot.forEach((doc) => {
                                                                    const d = doc.data();
                                                                    d.id = doc.id;
                                                                    a = d;
                                                                });
                                                                let win = false
                                                                let loss = false
                                                                let score = 0
                                                                if (doc.data().opponentScore) score = doc.data().opponentScore
                                                                if (doc.data().score < doc.data().opponentScore) win = true
                                                                if (doc.data().score > doc.data().opponentScore) loss = true
                                                                if (querySnapshot.empty) {
                                                                    db.collection("analysis").doc()
                                                                        .set({
                                                                            config: this.$store.state.config,
                                                                            date: doc.data().date,
                                                                            class: "individual",
                                                                            memberUid: docid, 
                                                                            win: win,
                                                                            loss: loss,
                                                                            score: score
                                                                        })
                                                                        .then(() => {
                                                                            console.log("Document successfully written!", "individual");
                                                                        })
                                                                        .catch((error) => {
                                                                            console.error("Error writing document: ", error);
                                                                    });
                                                                } else {
                                                                    db.collection("analysis").doc(a.id)
                                                                        .update({
                                                                            win: win,
                                                                            loss: loss,
                                                                            score: score
                                                                        })
                                                                        .then(() => {
                                                                            console.log("Document successfully written!", "individual");
                                                                        })
                                                                        .catch((error) => {
                                                                            console.error("Error writing document: ", error);
                                                                    });
                                                                }
                                                            })
                                                            .catch((error) => {
                                                                console.log("Error getting documents: ", error);
                                                        });
                                                    }
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
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            getIndividualAnalysis: async function(docid, name, start, end) {   
                // ランキングデータ作成
                await db.collection("analysis").where("class", "==", "individual").where("memberUid", "==", docid).orderBy("date").startAt(start).endAt(end)
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        let win = 0
                        let loss = 0
                        let score = 0
                        querySnapshot.forEach((doc) => {
                            win = win + doc.data().win;
                            loss = loss + doc.data().loss;
                            score = score + doc.data().score;
                        });
                        // 集計データ作成
                        let numberOfGames = Number(win) + Number(loss)
                        let winningPer = 0
                        if (numberOfGames != 0) winningPer = Math.round((Number(win) / numberOfGames) * 1000) / 1000
                        db.collection("analysis").doc()
                            .set({
                                createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
                                config: this.$store.state.config,
                                class: "individualPeriod",
                                memberUid: docid,
                                memberName: name,
                                win: Number(win),
                                loss: Number(loss),
                                winningPer: winningPer,
                                numberOfGames: numberOfGames,
                                score: Number(score),
                                start: start,
                                end: end
                            })
                            .then(() => {
                                console.log("Document successfully written!", "individualPeriod");
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                        });

                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });  
            },
            deleteAllIndividualPeriod: async function() {
                // ランク用データの削除
                await db.collection("analysis").where("class", "==", "individualPeriod")
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection("analysis").doc(doc.id).delete().then(() => {
                                console.log("Document successfully deleted!", "individualPeriod");
                            }).catch((error) => {
                                console.error("Error removing document: ", error);
                            });
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            deleteAllIndividual: async function() {
                // ランク用データの削除
                await db.collection("analysis").where("class", "==", "individual")
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection("analysis").doc(doc.id).delete().then(() => {
                                console.log("Document successfully deleted!", "individual");
                            }).catch((error) => {
                                console.error("Error removing document: ", error);
                            });
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            changedPeriod: function() {
                //
                var d = new Date()
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                if (this.period == 2) {
                    // 前月
                    sd.setMonth(sd.getMonth() - 1);
                    sd.setDate(1);
                    ed.setDate(0)
                } else if (this.period == 3) {
                    // 今年
                    sd.setMonth(0);
                    sd.setDate(1);
                } else {
                    // 今月
                    sd.setDate(1); // 今月1日
                }               
                // table要素を指定する #SortableTable
                this.startDate = firebase.firestore.Timestamp.fromDate(sd);
                this.endDate = firebase.firestore.Timestamp.fromDate(ed);
                console.log("start", sd)
                console.log("end", ed)
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
    .analysis {
<<<<<<< HEAD
        min-width: 376px;
=======
        min-width: 600px;
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
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
    p {
        display: inline-block;
         _display: inline;
    }
    .btn_ {
        margin: 0 0 0 20px;
    }
    .tips {
        font-size: 90%;
        text-align: right;
        font-weight: normal;
    }
<<<<<<< HEAD
    .nowrap {
        white-space: nowrap;
    }
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
</style>