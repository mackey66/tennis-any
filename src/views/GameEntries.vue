<template>
    <div class="game"><Menu class="sticky-top"></Menu>
        <div class="container-fluid">   
            <h4>{{ $t("Game") }} {{ format(today, 'MMM do (E)', {locale: locale}) }}</h4>    
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
            <div class="margin"></div>
            <!--<div class="panel-heading">-->
                <h6 class="">
                    <a data-toggle="collapse" href="#collapse1" role="button" aria-expanded="true" aria-controls="collapse1">{{ $t("in game") }}</a>
                    <router-link :to="{ name: 'gamefinished', params: { id: $route.params.id } }">{{ $t("Finished games") }}</router-link>
                    <!--<router-link :to="{ name: 'courtdaily', params: { id: $route.params.id } }">{{ $t("Court") }}</router-link>-->
                </h6>
            <!--</div>-->
            <button class='btn btn-primary btn_' @click="selectCourt()">{{ $t("Add") }}</button>
            <div class='tips'>{{ $t("Members and scores can be changed by interruption.") }}</div>
            <div id="collapse1" class="collapse show">
                <div class="table-responsive">
                    <table class="table table-condensed inGame">
                        <thead>
                            <tr>
                                <!--<th class='col court40'>#</th>-->
                                <th class='col court80'>{{ $t("Court") }}</th>
                                <th class='col court70'>{{ $t("Start") }}</th>
                                <th class='col court70'>{{ $t("End") }}</th>
                                <th class='col-auto nowrap'>{{ $t("Member") }}</th>        
                                <th class='col court250'>{{ $t("Score") }}</th>
                                <th class='col court70'></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(ramen, key) in ramens" :key="key">
                                <!--<th v-if='ramen.start' scope="row">{{ key + 1 }}</th>-->
                                <td v-if='ramen.start'>
                                    <button v-if='(ramen.courtName != "待ち" && !ramen.start) || ramen.interruption' class='btn btn-info btn-sm' @click="changeCourt(ramen.id)">
                                        {{ ramen.courtName }}
                                    </button>
                                    <button v-if='ramen.courtName == "待ち"' class='btn btn-primary btn-sm' @click="changeCourt(ramen.id)">
                                        {{ ramen.courtName }}
                                    </button>
                                    <button v-if='!(ramen.courtName == "待ち" || !ramen.start) && !ramen.interruption' class='btn btn-info btn-sm' disabled>
                                        {{ ramen.courtName }}
                                    </button>
                                </td>
                                <td v-if='ramen.start'>
                                    <div v-if='ramen.start'>{{ formatDate(ramen.start.toDate(), 'H:mm') }}</div>
                                    <button v-if='ramen.courtName != "待ち" && !ramen.start && ((ramen.member1Name && ramen.member2Name) || list[key]?list[key][1]:false )' class='btn btn-primary btn-sm' @click="startGame(ramen.id, key)">
                                        {{ $t("Start") }}
                                    </button>
                                </td>
                                <td v-if='ramen.start'>
                                    <div v-if='ramen.end'>{{ formatDate(ramen.end.toDate(), 'H:mm') }}</div>
                                    <button v-if='ramen.start && !ramen.end && !ramen.interruption' type="button" class="btn btn-warning btn-sm" @click="interruptGame(ramen.id)">
                                        {{ $t("Suspend") }}
                                    </button>
                                    <button v-if='ramen.start && !ramen.end && ramen.interruption' type="button" class="btn btn-primary btn-sm" @click="restartGame(ramen.id)">
                                        {{ $t("Resume") }}
                                    </button>
                                </td>
                                <td v-if='ramen.start'>
                                    <!--<button v-if='!ramen.member1Name || !ramen.member2Name || !ramen.member3Name || !ramen.member4Name' class='btn btn-info btn-sm btn__' @click="goSelectMember(ramen.id)">
                                        メンバー
                                    </button>
                                    <div v-else-if='ramen.start'>
                                    </div>
                                    <button v-else class='btn btn-danger btn-sm btn__' @click="clearMember(ramen.id)">
                                        クリア
                                    </button>-->
                                    <div v-if='today<today0'>
                                        <p v-if='ramen.member1Name'>{{ ramen.member1Name }}&ensp;</p>
                                        <p v-if='ramen.member2Name'>{{ ramen.member2Name }}&ensp;</p>
                                        <p v-if='ramen.member3Name'>{{ ramen.member3Name }}&ensp;</p>
                                        <p v-if='ramen.member4Name'>{{ ramen.member4Name }}</p>
                                    </div>
                                    <div v-else>
                                        <draggable
                                            class="list-group droparea"
                                            :list="list[key]"
                                            :disabled="enabled[key]"
                                            group="people"
                                            @change="changedDistList"
                                            @start="startDistList"
                                            @end="endDistList"
                                            item-key="name"
                                            :data-column-id="key"
                                        >   
                                            <template #item="{ element }">
                                                <div v-if='element.guest' class="drag-item-guest">
                                                    {{ element.name }}
                                                </div>
                                                <div v-else-if='element.gender == 1' class="drag-item-female" >
                                                    {{ element.name }}
                                                </div>
                                                <div v-else class="drag-item">
                                                    {{ element.name }}
                                                </div>
                                            </template>
                                        </draggable>
                                    </div>
                                </td>
                                <td v-if='ramen.start'>
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
                                <td v-if='ramen.start'>
                                    <button v-if='!ramen.start && !ramen.end' class='btn btn-danger btn-sm' @click="deleteEntry(ramen.id)">
                                        {{ $t("Delete") }}
                                    </button>
                                    <!--<button v-if='ramen.start && !ramen.end' type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#demoNormalModal" @click="setRowId(ramen.id)">-->
                                    <button v-if='ramen.start && !ramen.end' type="button" class="btn btn-success btn-sm" @click="finishedGame(ramen.id)">
                                        {{ $t("End") }}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-condensed waiting">            
                    <thead>
                        <tr>
                            <!--<th class='col court40'>#</th>-->
                            <th class='col court80'>{{ $t("Court") }}</th>
                            <th class='col court70'></th>
                            <th class='col court70'></th>
                            <th class='col-auto'>{{ $t("Member") }}</th>        
                            <th class='col court70'></th>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr v-for="(ramen, key) in ramens" :key="key">
                            <!--<th v-if='!ramen.start' scope="row">{{ key + 1 }}</th>-->
                            <td v-if='!ramen.start'>
                                <button v-if='(ramen.courtName != "待ち" && !ramen.start) || ramen.interruption' class='btn btn-info btn-sm' @click="changeCourt(ramen.id)">
                                    {{ ramen.courtName }}
                                </button>
                                <button v-if='ramen.courtName == "待ち"' class='btn btn-primary btn-sm' @click="changeCourt(ramen.id)">
                                    {{ ramen.courtName }}
                                </button>
                                <!--<button v-if='!(ramen.courtName == "待ち" || !ramen.start) && !ramen.interruption' class='btn btn-info btn-sm' disabled>
                                    {{ ramen.courtName }}
                                </button>-->
                            </td>
                            <td v-if='!ramen.start'>
                                <!--<div v-if='ramen.start'>{{ formatDate(ramen.start.toDate(), 'H:mm') }}</div>-->
                                <button v-if='ramen.courtName != "待ち" && !ramen.start && ((ramen.member1Name && ramen.member2Name) || list[key]?list[key][1]:false )' class='btn btn-primary btn-sm' @click="startGame(ramen.id, key)">
                                    {{ $t("Start") }}
                                </button>
                            </td>
                            <td v-if='!ramen.start'>
                                <div v-if='ramen.end'>{{ formatDate(ramen.end.toDate(), 'H:mm') }}</div>
                                <button v-if='ramen.start && !ramen.end && !ramen.interruption' type="button" class="btn btn-warning btn-sm" @click="interruptGame(ramen.id)">
                                    {{ $t("Suspend") }}
                                </button>
                                <button v-if='ramen.start && !ramen.end && ramen.interruption' type="button" class="btn btn-primary btn-sm" @click="restartGame(ramen.id)">
                                    {{ $t("Resume") }}
                                </button>
                            </td>
                            <td v-if='!ramen.start'>
                                <!--<button v-if='!ramen.member1Name || !ramen.member2Name || !ramen.member3Name || !ramen.member4Name' class='btn btn-info btn-sm btn__' @click="goSelectMember(ramen.id)">
                                    メンバー
                                </button>
                                <div v-else-if='ramen.start'>
                                </div>
                                <button v-else class='btn btn-danger btn-sm btn__' @click="clearMember(ramen.id)">
                                    クリア
                                </button>-->
                                <div v-if='today<today0'>
                                    <p v-if='ramen.member1Name'>{{ ramen.member1Name }}&ensp;</p>
                                    <p v-if='ramen.member2Name'>{{ ramen.member2Name }}&ensp;</p>
                                    <p v-if='ramen.member3Name'>{{ ramen.member3Name }}&ensp;</p>
                                    <p v-if='ramen.member4Name'>{{ ramen.member4Name }}</p>
                                </div>
                                <div v-else>
                                    <draggable
                                        class="list-group droparea"
                                        :list="list[key]"
                                        :disabled="enabled[key]"
                                        group="people"
                                        @change="changedDistList"
                                        @start="startDistList"
                                        @end="endDistList"
                                        item-key="name"
                                        :data-column-id="key"
                                    >   
                                        <template #item="{ element }">
                                            <div v-if='element.guest' class="drag-item-waiting-guest">
                                                {{ element.name }}
                                            </div>
                                            <div v-else-if='element.gender == 1' class="drag-item-waiting-female" >
                                                {{ element.name }}
                                            </div>
                                            <div v-else class="drag-item-waiting">
                                                {{ element.name }}
                                            </div>                    
                                        </template>
                                    </draggable>
                                </div>
                            </td>
                            <td v-if='!ramen.start'>
                                <button v-if='!ramen.start && !ramen.end' class='btn btn-danger btn-sm' @click="deleteEntry(ramen.id)">
                                    {{ $t("Delete") }}
                                </button>
                                <button v-if='ramen.start && !ramen.end' type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#demoNormalModal" @click="setRowId(ramen.id)">
                                    {{ $t("End") }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if='today>yesterday'>
                <div class="table-responsive">
                    <table class="table table-condensed entry">
                        <thead>
                            <tr>
                                <th>{{ $t("Entry") }}</th>
                                <th class='tips'>{{ $t("If it doesn't come up in your entry, please update it.") }}</th>
                                <th class='col court70 tooltip4'>
                                    <button class='btn btn-secondary btn-sm' @click="refreshEntry()">
                                        {{ $t("Update") }}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <!--<tr v-for="(ramen, key) in ramens" :key="key">-->
                            <tr>
                                <td colspan="3">
                                    <draggable 
                                        class="entry"
                                        :list="myArray"
                                        :group="{ name: 'people', pull: pullFunction, put: true }"
                                        @change="changedSourceList"
                                        @start="startSourceList"
                                        @end="endSourceList"
                                        :move="checkMove"
                                        item-key="name"
                                    >
                                        <template #item="{ element }">
                                            <div v-if='element.guest' class="drag-item-guest" >
                                                {{ element.name }}
                                            </div>
                                            <div v-else-if='element.gender == 1' class="drag-item-female" >
                                                {{ element.name }}
                                            </div>
                                            <div v-else class="drag-item" >
                                                {{ element.name }}
                                            </div>
                                        </template>
                                    </draggable>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 結果入力ダイアログ -->
            <!--<div class="modal fade" id="demoNormalModal" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="demoModalTitle">結果</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <input v-model="message" class='input' placeholder="結果を入力してください">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-dismiss="modal" @click='finishedGame(rowId, message)'>OK</button>
                        </div>
                    </div>
                </div>
            </div>-->
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
    import draggable from 'vuedraggable'
    //require('firebase/firestore')

    const setDragCursor = value => {
    const html = document.getElementsByTagName('html').item(0)
        html.classList.toggle('grabbing', value)
    }

    //var memberRef = db.collection("users");
    export default {
        name: 'attendance',
        display: "Simple",
        order: 2,
        components: {
            Menu,
            Datepicker,
            draggable
        },
        data() {
            return {
                ramens: [],
                today: new Date(this.$route.params.id),
                yesterday: new Date(),
                rowId: null,
                message: null,
                innerSearchText: new Date(this.$route.params.id),
                locale: ja,
                format: format,
                drag: false,
                myArray: [],
                list: [],
                enabled: [],
                dndOption: [],
                now: new Date(),
                today0: new Date(),
                no: 0,
                dragTargetLength: 0,
                controlOnStart: false,
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
            },
            waitingNo: {
                get () {
                    this.countUp()
                    return this.no
                },
                set (value) {                 
                    this.no = value               
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
                        // メンバーとリンクしてなければメンバーリンク画面へ
                        if (querySnapshot.empty) {
                            this.$router.push(`/memberLink`);
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                */
            });
            this.now = new Date();
            this.today0 = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 0, 0, 0);
            this.yesterday = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 1);
            this.getGameEntries();
            this.getMember();
            // 日付をセット
            this.innerSearchText = this.today;
            this.setLanguage();
        },
        methods: {
            getGameEntries: function() {
                // エントリーデータ取得
                var d = this.today;
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("gameEntries").where("config", "==", this.$store.state.config).orderBy("date").startAt(startDate).endAt(endDate)
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = [];
                        var i = 0;
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            //console.log(doc.id, " => ", doc.data());
                            const d = doc.data();
                            d.id = doc.id;
                            if (!d.end) { 
                                array.push(d);
                                let m1 = {};
                                let m2 = {};
                                let m3 = {};
                                let m4 = {};
                                m1.name = d.member1Name;
                                m2.name = d.member2Name;
                                m3.name = d.member3Name;
                                m4.name = d.member4Name;
                                m1.id = d.member1Uid;
                                m2.id = d.member2Uid;
                                m3.id = d.member3Uid;
                                m4.id = d.member4Uid;
                                m1.guest = d.member1Guest;
                                m2.guest = d.member2Guest;
                                m3.guest = d.member3Guest;
                                m4.guest = d.member4Guest;
                                m1.gender = d.member1Gender;
                                m2.gender = d.member2Gender;
                                m3.gender = d.member3Gender;
                                m4.gender = d.member4Gender;
                                let result = [];
                                if (m1.name) result.push(m1);
                                if (m2.name) result.push(m2);
                                if (m3.name) result.push(m3);
                                if (m4.name) result.push(m4);
                                this.list[i] = result;
                                // Drag and Dropの禁止
                                if (d.start && !d.interruption) this.disableDragAndDrop(i)
                                i++;
                            }                         
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
            goFinished: function () {
                this.$router.push({ name: 'gamefinished' });
            },
            selectCourt: function () {
                this.$router.push(`/courtselect`);
            },
            goSelectMember: function (docid) {
                this.$router.push({ name: 'memberselect', params: { id: docid } })              
            },
            clearMember: function (docid) {
                this.getAndClearMember(docid);    
            },
            getAndClearMember: function (docid) {
                db.collection("gameEntries").doc(docid)
                    .get(this.soruce).then((doc) => {
                        if (doc.exists) {
                            db.collection("gameEntries").doc(docid).update({
                                member1Uid: "",
                                member2Uid: "",
                                member3Uid: "",
                                member4Uid: "",
                                member1Name: "",
                                member2Name: "",
                                member3Name: "",
                                member4Name: "",
                                member1Guest: false,
                                member2Guest: false,
                                member3Guest: false,
                                member4Guest: false,
                                member1Gender: 0,
                                member2Gender: 0,
                                member3Gender: 0,
                                member4Gender: 0
                            })
                            .then(() => {
                                console.log("Document successfully written!");                  
                                // Reload
                                //this.$router.go({path: this.$router.currentRoute.path, force: true})
                                this.getGameEntries();
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
            },
            deleteEntry: function(docid) {
                this.getAndEndGameMember(docid);
                db.collection("gameEntries").doc(docid).delete().then(() => {
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            },
            startGame: function(docid, row) {
                db.collection("gameEntries").doc(docid).update({
                    start: firebase.firestore.Timestamp.fromDate(new Date())
                })
                .then(() => {
                    console.log("Document successfully written!");
                    this.getAndSetGameMember(docid, row);
                    // 
                    this.getGameEntries();
                    this.getMember();
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            getAndSetGameMember: function (docid, row) {
                var docRef = db.collection("gameEntries").doc(docid);
                docRef.get(this.source).then((doc) => {
                    if (doc.exists) {
                        // memberSelect画面でSelectした場合
                        /*
                        if (doc.data().member1Uid) this.setGameMember(doc.data().member1Uid)
                        if (doc.data().member2Uid) this.setGameMember(doc.data().member2Uid)
                        if (doc.data().member3Uid) this.setGameMember(doc.data().member3Uid)
                        if (doc.data().member4Uid) this.setGameMember(doc.data().member4Uid)
                        */
                        // Drag-and-dropでSelectした場合
                        var n = this.list[row].length
                        for (let i = 0; i < n; i++) {
                            if (i==0) {
                                docRef.update({
                                    member1Uid: this.list[row][i].id,
                                    member1Name: this.list[row][i].name,
                                    member1Guest: this.list[row][i].guest?this.list[row][i].guest:"",
                                    member1Gender: this.list[row][i].gender?this.list[row][i].gender:0
                                })
                                .then(() => {
                                    console.log("Document successfully written!");                  
                                    this.setGameMember(this.list[row][i].id);
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                            } else if (i==1) {
                                docRef.update({
                                    member2Uid: this.list[row][i].id,
                                    member2Name: this.list[row][i].name,
                                    member2Guest: this.list[row][i].guest?this.list[row][i].guest:"",
                                    member2Gender: this.list[row][i].gender?this.list[row][i].gender:0
                                })
                                .then(() => {
                                    console.log("Document successfully written!");                  
                                    this.setGameMember(this.list[row][i].id);
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                            } else if (i==2) {
                                docRef.update({
                                    member3Uid: this.list[row][i].id,
                                    member3Name: this.list[row][i].name,
                                    member3Guest: this.list[row][i].guest?this.list[row][i].guest:"",
                                    member3Gender: this.list[row][i].gender?this.list[row][i].gender:0
                                })
                                .then(() => {
                                    console.log("Document successfully written!");                  
                                    this.setGameMember(this.list[row][i].id);
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                            } else {
                                docRef.update({
                                    member4Uid: this.list[row][i].id,
                                    member4Name: this.list[row][i].name,
                                    member4Guest: this.list[row][i].guest?this.list[row][i].guest:"",
                                    member4Gender: this.list[row][i].gender?this.list[row][i].gender:0
                                })
                                .then(() => {
                                    console.log("Document successfully written!");                  
                                    this.setGameMember(this.list[row][3].id);
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                            }                        
                        }
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                    // Reload
                    //this.$router.go({path: this.$router.currentRoute.path, force: true})
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            },
            setGameMember: function (docid) {
                console.log('setGameMember', docid)
                db.collection("members").doc(docid).update({
                    game: true,
                    reserved: false
                })
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            setRowId: function(docid) {
                this.rowId = docid;
            },
            interruptGame: function(docid) {
                db.collection("gameEntries").doc(docid).update({
                    interruption: true
                })
                .then(() => {
                    console.log("Document successfully written!");
                    // Reloadしないとドラッグできない
                    this.$router.go({path: this.$router.currentRoute.path, force: true})
                    //this.getGameEntries();
                    //this.getMember();
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            restartGame: function(docid) {
                db.collection("gameEntries").doc(docid).update({
                    interruption: false
                })
                .then(() => {
                    console.log("Document successfully written!");
                    // Reload
                    //this.$router.go({path: this.$router.currentRoute.path, force: true})
                    this.getGameEntries();
                    this.getMember();
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            finishedGame: function(docid) {
                let result = window.confirm(this.$t("End the confirmed game. Are you sure?"));
                if( result ) {
                    //
                    db.collection("gameEntries").doc(docid).update({
                        end: firebase.firestore.Timestamp.fromDate(new Date()),
                        interruption: false
                    })
                    .then(() => {
                        console.log("Document successfully written!")
                        this.getAndEndGameMember(docid)
                        // 個人集計用データ作成
                        this.getIndividualGameEntries(docid)
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }      
            },
            getAndEndGameMember: function (docid) {
                db.collection("gameEntries").doc(docid)
                    .get(this.source).then((doc) => {
                        if (doc.exists) {
                            if (doc.data().member1Uid) this.finishGameMember(doc.data().member1Uid)
                            if (doc.data().member2Uid) this.finishGameMember(doc.data().member2Uid)
                            if (doc.data().member3Uid) this.finishGameMember(doc.data().member3Uid)
                            if (doc.data().member4Uid) this.finishGameMember(doc.data().member4Uid)
                            
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                        // Reload
                        //this.$router.go({path: this.$router.currentRoute.path, force: true})
                        this.getGameEntries();
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
            },
            finishGameMember: function (docid) {
                console.log('deleteGameMember')
                db.collection("members").doc(docid).update({
                    game: false,
                    reserved: false
                })
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            changeCourt: function(docid) {
                this.$router.push({ name: 'courtchange', params: { id: docid } })
            },
            changeDate: function() {
                this.today = this.picked;
                this.$router.push({ name: 'game', params: { id: this.today } });
                this.getGameEntries();
                /*
                var d = new Date(this.today);
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("gameEntries").where("config", "==", this.$store.state.config).orderBy("date").startAt(startDate).endAt(endDate)
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            if (!d.end) array.push(d);
                        });
                        this.ramens = array
                        this.$router.push({ name: 'game', params: { id: this.today } });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                */
            },
            toHankaku: function(str) {
                if (!str) return "";
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
            getMember: function () {
                // ユーザー取得（エントリー済、またはゲスト）               
                db.collection("members").where("config", "==", this.$store.state.config).where("entry", "==", true).orderBy("kanaSei")
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            //console.log(doc.id, " => ", doc.data());
                            const d = doc.data();
                            d.id = doc.id;
                            d.name = doc.data().displayName;
                            d.order = doc.data().kanaSei;
                            d.fixed = false;
                            if (!(d.game || d.reserved)) {
                                array.push(d);
                                //console.log(d.name);
                            }                           
                        });
                        db.collection("members").where("config", "==", this.$store.state.config).where("guest", "==", true).orderBy("kanaSei")
                            .get(this.soruce)
                            .then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    const d = doc.data();
                                    d.id = doc.id;
                                    d.name = doc.data().displayName;
                                    d.order = doc.data().kanaSei;
                                    d.fixed = false;
                                    array.push(d);
                                    //console.log(d.name);
                                    this.myArray = array
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
            updateGameEntryMember: function(docid, index) {
                // getAndSetGameMember() とほぼ同じ?
                // メンバーをクリアしてから処理する
                db.collection("gameEntries").doc(docid).update({
                        member1Uid: "",
                        member2Uid: "",
                        member3Uid: "",
                        member4Uid: "",
                        member1Name: "",
                        member2Name: "",
                        member3Name: "",
                        member4Name: "",
                        member1Guest: false,
                        member2Guest: false,
                        member3Guest: false,
                        member4Guest: false,
                        member1Gender: 0,
                        member2Gender: 0,
                        member3Gender: 0,
                        member4Gender: 0
                    })
                    .then(() => {
                        //console.log("Document successfully written!");
                        //console.log("entry", i, gameEntry.id);                       
                        if (docid.start && !docid.interruption) {
                            // 試合が始まっていたらドラッグ禁止
                            this.enabled[index] = true;
                        } else {
                            //this.enabled[i] = 'list.length<=4';
                            this.enabled[index] = false;
                            //this.dndOption[i] = '{disabled:list.length<=4}';
                        }
                        let ln = this.list[index].length;
                        for (let j = 0; j < ln; j++) {
                            if (this.list[index][j]) {
                                //console.log(this.list[i][j].name, this.list[i][j].id);
                                if (j == 0) {
                                    db.collection("gameEntries").doc(docid).update({
                                        member1Uid: this.list[index][j].id,
                                        member1Name: this.list[index][j].name,
                                        member1Guest: this.list[index][j].guest?this.list[index][j].guest:false,
                                        member1Gender: this.list[index][j].gender?this.list[index][j].gender:0
                                    })
                                    .then(() => {
                                        //console.log("Document successfully written!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                                } else if (j == 1) {
                                    db.collection("gameEntries").doc(docid).update({
                                        member2Uid: this.list[index][j].id,
                                        member2Name: this.list[index][j].name,
                                        member2Guest: this.list[index][j].guest?this.list[index][j].guest:false,
                                        member2Gender: this.list[index][j].gender?this.list[index][j].gender:0
                                    })
                                    .then(() => {
                                        //console.log("Document successfully written!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                                } else if (j == 2) {
                                    db.collection("gameEntries").doc(docid).update({
                                        member3Uid: this.list[index][j].id,
                                        member3Name: this.list[index][j].name,
                                        member3Guest: this.list[index][j].guest?this.list[index][j].guest:false,
                                        member3Gender: this.list[index][j].gender?this.list[index][j].gender:0
                                    })
                                    .then(() => {
                                        //console.log("Document successfully written!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                                } else if (j == 3) {
                                    db.collection("gameEntries").doc(docid).update({
                                        member4Uid: this.list[index][j].id,
                                        member4Name: this.list[index][j].name,
                                        member4Guest: this.list[index][j].guest?this.list[index][j].guest:false,
                                        member4Gender: this.list[index][j].gender?this.list[index][j].gender:0
                                    })
                                    .then(() => {
                                        //console.log("Document successfully written!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                                }                       
                            }                         
                        }
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                
            },
            /*
            updateAllGameEntryMember: function() {
                let i = 0;
                for (let gameEntry of this.ramens) {
                    // メンバーを確実にクリアしてから処理する
                    db.collection("gameEntries").doc(gameEntry.id).update({
                        member1Uid: "",
                        member2Uid: "",
                        member3Uid: "",
                        member4Uid: "",
                        member1Name: "",
                        member2Name: "",
                        member3Name: "",
                        member4Name: "",
                        member1Guest: false,
                        member2Guest: false,
                        member3Guest: false,
                        member4Guest: false
                    })
                    .then(() => {
                        //console.log("Document successfully written!");
                        let ln = this.list[i].length;
                        //console.log("entry", i, gameEntry.id);                       
                        if (gameEntry.start && !gameEntry.interruption) {
                            // 試合が始まっていたらドラッグ禁止
                            this.enabled[i] = true;
                        } else {
                            //this.enabled[i] = 'list.length<=4';
                            this.enabled[i] = false;
                            //this.dndOption[i] = '{disabled:list.length<=4}';
                        }                      
                        for (let j = 0; j < ln; j++) {
                            if (this.list[i][j]) {
                                console.log(this.list[i][j].name, this.list[i][j].id);
                                if (j == 0) {
                                    db.collection("gameEntries").doc(gameEntry.id).update({
                                        member1Uid: this.list[i][j].id,
                                        member1Name: this.list[i][j].name,
                                        member1Guest: this.list[i][j].guest?this.list[i][j].guest:false
                                    })
                                    .then(() => {
                                        //console.log("Document successfully written!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                                } else if (j == 1) {
                                    db.collection("gameEntries").doc(gameEntry.id).update({
                                        member2Uid: this.list[i][j].id,
                                        member2Name: this.list[i][j].name,
                                        member2Guest: this.list[i][j].guest?this.list[i][j].guest:false
                                    })
                                    .then(() => {
                                        //console.log("Document successfully written!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                                } else if (j == 2) {
                                    db.collection("gameEntries").doc(gameEntry.id).update({
                                        member3Uid: this.list[i][j].id,
                                        member3Name: this.list[i][j].name,
                                        member3Guest: this.list[i][j].guest?this.list[i][j].guest:false
                                    })
                                    .then(() => {
                                        //console.log("Document successfully written!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                                } else if (j == 3) {
                                    db.collection("gameEntries").doc(gameEntry.id).update({
                                        member4Uid: this.list[i][j].id,
                                        member4Name: this.list[i][j].name,
                                        member4Guest: this.list[i][j].guest?this.list[i][j].guest:false
                                    })
                                    .then(() => {
                                        //console.log("Document successfully written!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                                }                             
                            }                         
                        }                      
                        i++;
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });                
                }
            },
            */
            updateScore: function(id, value) {
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
            disableDragAndDrop: function(n) {
                this.enabled[n] = true;
            },
            /*
            add: function() {
                this.list.push({ name: "Juan" });
                console.log("add");
            },
            replace: function() {
                this.list = [{ name: "Edgard" }];
            },
            clone: function(el) {
                return {
                    name: el.name + " cloned"
                };
            },*/
            remove: function(evt) {
                console.log("removed!", evt);
            },
            changedSourceList: function(evt) {
                console.log(evt);
                
                if (evt.added) {
                    db.collection("members").doc(evt.added.element.id).update({
                        reserved: false
                    })
                    .then(() => {
                        console.log("Document successfully written!", evt.added.element.name, "reserved", evt.added.element.guest);
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
                // 全ゲームエントリーの人を更新（ドラッグ先のIDを取れるようになったのでendXxxListのupdateGameEntryMemberに変更）
                //this.updateAllGameEntryMember();             
            },
            startDistList: function(evt) {
                console.log("start evt", evt)
                //this.dragstart = "dist"
                //this.controlOnStart = true
            },
            endDistList: function(evt) {
                // dropareaからドラッグした場合           
                console.log("endDistList(): " + evt)
                const from = evt.from.outerHTML;
                const fromId = from.match( /data-column-id="[0-9]+"/ )[0];
                const fromIndex = fromId.match(/"(.*?)"/)[1];
                const src = this.ramens[fromIndex];
                // ドラッグ元のDB更新
                this.updateGameEntryMember(src.id, fromIndex);
                const to = evt.to.outerHTML;
                const cname = to.match( /class="[0-9a-z\s-]+"/ );
                if (!cname) {
                    // ドラッグ先にclass名がなければReturn
                    return
                } else {
                    // ドラッグ先のclass名にdropareaがなければReturn
                    if (!cname[0].match( /droparea/ )) return;
                }
                const toId = to.match( /data-column-id="[0-9]+"/ )[0];
                const toIndex = toId.match(/"(.*?)"/)[1];
                
                const dst = this.ramens[toIndex];
                
                // ドラッグ先のDB更新
                this.updateGameEntryMember(dst.id, toIndex);
            },
            startSourceList: function(evt) {
                console.log("start evt", evt)
                //this.controlOnStart = true
            },
            endSourceList: function(evt) {
                // entryからドラッグした場合          
                const to = evt.to.outerHTML;
                // entry内の移動時のエラーを回避
                if (!to.match( /data-column-id="[0-9]+"/ )) return
                const id = to.match( /data-column-id="[0-9]+"/ )[0];
                const cname = to.match( /class="[0-9a-z\s-]+"/ );
                if (!cname) {
                    // ドラッグ先にclass名がなければReturn
                    return
                } else {
                    // ドラッグ先のclass名にdropareaがなければReturn
                    if (!cname[0].match( /droparea/ )) return;
                }
                const index = id.match(/"(.*?)"/)[1];
                //const src = this.members[this.oldIndex];
                const dst = this.ramens[index]; 
                // DB更新
                this.updateGameEntryMember(dst.id, index);      
            },
            changedDistList: function(evt) {
                console.log("changedDistList:evt")
                console.log(evt);
                if (evt.added) {
                    // 追加の場合
                    //console.log("add", evt.added.element.displayName, evt.added.element.id);
                    //console.log("index", evt.added.newIndex)
                    //console.log("evt.added.element.guest", evt.added.element.guest);
                    //console.log("changedDisList", evt.added.newIndex)
                    console.log("changedDistList(added)")
                    if (evt.added.newIndex > 3) {
                        console.log("over 4!")
                        //this.enabled[0] = true;
                        return false;
                    }
                    db.collection("members").doc(evt.added.element.id).update({
                        reserved: true
                    })
                    .then(() => {
                        console.log("Document successfully written!", evt.added.element.name, evt.added.element.id, evt.added.element.guest);
                        // Guestなら元を残す
                        if (evt.added.element.guest) {
                            //this.myArray.push(evt.added.element)
                            // 戻すのではなくEntryエリアの更新に変更
                            this.refreshEntry();
                        }
                        // 全ゲームエントリーの人を更新（ドラッグ先のIDを取れるようになったのでendXxxListのupdateGameEntryMemberに変更）
                        //this.updateAllGameEntryMember();    
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                } else if (evt.moved) {
                    // 同じエリア内での移動
                    console.log("changedDistList(moved)")
                }
                
            },           
            clearList: function() {
                let n = this.list.length;
                console.log("n =", n);
                for (let i = 0; i < n; i++) {
                    //this.list[i] = [];
                    this.list.splice(i, 1);
                }               
            },
            checkMove: function(evt) {
                //this.onDragStart();
                //console.log("move evt", evt)
                this.dragTargetLength = evt.relatedContext.list.length
                if (evt.relatedContext.list.length >= 4) {
                    // ターゲットが4件以上のときはドラッグをキャンセル
                    return false
                }
                return true;
            },
            onDragStart: function() {
                setDragCursor(true)
            },
            onDragEnd: function() {
                setDragCursor(false)
            },
            countUp: function() {
                this.no++
            },
            log: function(evt) {
                window.console.log(evt);
            },
            pullFunction: function() {
                return this.controlOnStart ? "clone" : true
            },
            refreshEntry: function() {
                // 選択用のエントリーにデータが上がってこないときに使用（Memberのreservedフラグが正常に処理されなかったとき）
                db.collection("members").where("config", "==", this.$store.state.config).where("reserved", "==", true)
                    .get(this.source)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection("members").doc(doc.id).update({
                                reserved: false
                            })
                            .then(() => {
                                console.log("Document successfully written! members reserved false");                  
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        });
                        // Reload
                        //this.$router.go({path: this.$router.currentRoute.path, force: true})
                        this.getGameEntries();
                        this.getMember();
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            getIndividualGameEntries: function(docid) {
                // 個人のAnalysis用データ作成
                console.log("source", this.source)
                db.collection("gameEntries").doc(docid).get().then((doc) => {
                    if (doc.exists) {
                        // Make Individual Analysis Data
                        // そのゲームの参加人数
                        let num = 0
                        if (doc.data().member4Uid) {num = 4} else {num = 2} 
                        if (doc.data().member1Uid) this.makeIndividualAnalysis(1, num, doc.data().member1Uid, doc.data().date, doc.data().score, doc.data().opponentScore)
                        if (doc.data().member2Uid) this.makeIndividualAnalysis(2, num, doc.data().member2Uid, doc.data().date, doc.data().score, doc.data().opponentScore)
                        if (doc.data().member3Uid) this.makeIndividualAnalysis(3, num, doc.data().member3Uid, doc.data().date, doc.data().score, doc.data().opponentScore)
                        if (doc.data().member4Uid) this.makeIndividualAnalysis(4, num, doc.data().member4Uid, doc.data().date, doc.data().score, doc.data().opponentScore)
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });              
            },
            makeIndividualAnalysis: function(member, num, docid, date, score_, opponentScore_) {
                db.collection("analysis").where("config", "==", this.$store.state.config).where("date", "==", date).where("memberUid", "==", docid).where("class", "==", "individual")
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
                        if (member == 1) {
                            if (score_) score = score_
                            if (score_ > opponentScore_) win = true
                            if (score_ < opponentScore_) loss = true
                        } else if (member == 2) {
                            if (num == 4) {
                                score = score_
                                if (score_ > opponentScore_) win = true
                                if (score_ < opponentScore_) loss = true
                            } else {
                                score = opponentScore_
                                if (score_ < opponentScore_) win = true
                                if (score_ > opponentScore_) loss = true
                            }
                        } else if (member == 3 || member == 4) {
                            if (opponentScore_) score = opponentScore_
                            if (score_ < opponentScore_) win = true
                            if (score_ > opponentScore_) loss = true
                        } else {
                            return
                        }
                        if (querySnapshot.empty) {
                            db.collection("analysis").doc()
                                .set({
                                    config: this.$store.state.config,
                                    date: date,
                                    class: "individual",
                                    memberUid: docid, 
                                    win: win,
                                    loss: loss,
                                    score: score
                                })
                                .then(() => {
                                    console.log("Document successfully written!");
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
                                    console.log("Document successfully written!");
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
            setLanguage: function() {
                const lg = navigator.language
                //console.log(lg)
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
    .game {
        min-width: 376px;
    }
    .nowrap {
        white-space: nowrap;
    }
    .court400 {
        width: 400px;
        white-space: nowrap;
    }
    .court350 {
        width: 360px;
        white-space: nowrap;
    }
    .court300 {
        width: 300px;
        white-space: nowrap;
    }
    .court250 {
        width: 250px;
        white-space: nowrap;
    }
    .court200 {
        width: 200px;
        white-space: nowrap;
    }
    .court130 {
        width: 130px;
        white-space: nowrap;
    }
    .court120 {
        width: 300px;
        white-space: nowrap;
    }
    .court100 {
        width: 100px;
        white-space: nowrap;
    }
    .court90 {
        width: 90px;
        white-space: nowrap;
    }
    .court80 {
        width: 66px;
        white-space: nowrap;
    }
    .court70 {
        width: 56px;
        white-space: nowrap;
    }
    .court60 {
        width: 60px;
        white-space: nowrap;
    }
    .court40 {
        width: 40px;
        white-space: nowrap;
    }
    .input {
        min-width: 260px;
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
        margin: 0 10px 0 0;
    }
    .margin {
        margin: 20px;
    }
    p {display: inline-block; _display: inline;}
    .buttons {
        margin-top: 35px;
    }
    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }
    .not-draggable {
        cursor: no-drop;
    }
    .max-height-100{
        max-height : 200px;
        overflow: scroll;
    }
    .grabbing * {
        cursor: grabbing;
    }
    .draggable {
        cursor: grabbing;
    }
    .box {       
        white-space: nowrap;
    }
    .maxwidth150 {
        max-width: 150px;
    }
    .maxwidth400 {
        max-width: 490px;
    }
    .list-group {
        display: flex;
        flex-direction: row;
        /*flex-wrap: wrap;*/
    }
    .drag-item {
        display: inline-block;
        margin: 0 10px 10px 0;
        padding: 10px;
        border: 1px solid #c5c4c4;
        border-radius: 10px;
        background-color: #fafafa;
        /*font-size: 110%*/
    }
    .drag-item-female {
        display: inline-block;
        margin: 0 10px 10px 0;
        padding: 10px;
        border: 1px solid #c5c4c4;
        border-radius: 10px;
        color : red;
        background-color: #fafafa;
        /*font-size: 110%*/
    }
    .drag-item-guest {
        display: inline-block;
        margin: 0 10px 10px 0;
        padding: 10px;
        border: 1px solid #c5c4c4;
        border-radius: 10px;
        background-color: #cefad0;
        /*font-size: 110%*/
    }
    .drag-item-waiting {
        display: inline-block;
        margin: 0 10px 0 0;
        padding: 10px;
        border: 1px solid #c5c4c4;
        border-radius: 10px;
        background-color: #fafafa;
        /*font-size: 110%*/
    }
    .drag-item-waiting-female {
        display: inline-block;
        margin: 0 10px 0 0;
        padding: 10px;
        border: 1px solid #c5c4c4;
        border-radius: 10px;
        color: red;
        background-color: #fafafa;
        /*font-size: 110%*/
    }
    .drag-item-waiting-guest {
        display: inline-block;
        margin: 0 10px 0 0;
        padding: 10px;
        border: 1px solid #c5c4c4;
        border-radius: 10px;
        background-color: #cefad0;
        /*font-size: 110%*/
    }
    .entry {
        flex-wrap: wrap;
    }
    _table {
        counter-reset: rowCount;
    }
    _table > tbody > tr {
        counter-increment: rowCount;
    }
    _table > tbody > tr > td:first-child::before {
        content: counter(rowCount);
    }
    .tips {
        font-size: 80%;
        text-align: right;
        font-weight: normal;
    }
    .droparea {
        min-height: 48px;
        border-radius: 10px;
        background-color: #f2f2f3;
    }
    a {
        margin: 0 10px 0 10px;
    }
    .table-condensed > thead > tr > th,
    .table-condensed > tbody > tr > th,
    .table-condensed > tfoot > tr > th,
    .table-condensed > thead > tr > td,
    .table-condensed > tbody > tr > td,
    .table-condensed > tfoot > tr > td {
        padding: 12px 5px 12px 5px;
    }
</style>