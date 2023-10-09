<template>
    <div class="about">
        
<<<<<<< HEAD
        <h4>{{ $t("Please make a selection.") }}</h4>
=======
        <h4>選択してください</h4>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
        <button class='btn btn-secondary btn_' @click="cancel()">{{ $t("Cancel") }}</button>
        <div class="row">
            <div class="col-sm-2 col-md-3"></div>
            <div class="col-sm-8 col-md-6">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col"></th>
                            <th scope="col">{{ $t("Name") }}</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ramen, key) in ramens" :key="key">
                            <th scope="row">{{ key + 1 }}</th>
                            <td>{{ ramen.kanaSei }}</td>
                            <td>{{ ramen.displayName }}</td>
                            <td>
                                <button class='btn btn-primary btn-sm' data-toggle="modal" data-target="#demoNormalModal" @click='setRowId(ramen.id, ramen.displayName)'>
                                    {{ $t("Register") }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>         
        </div>

        <!-- 時間入力ダイアログ -->
        <div class="modal fade" id="demoNormalModal" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
<<<<<<< HEAD
                        <h5 class="modal-title" id="demoModalTitle">{{ $t("Register") }}</h5>
=======
                        <h5 class="modal-title" id="demoModalTitle">登録</h5>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <input v-model="inTime" class='input' placeholder="入る時間">
                    </div>
                    <div class="modal-body">
                        <input v-model="outTime" class='input' placeholder="帰る時間">
                    </div>
                    <div class="modal-body">
                        <input v-model="message" class='width300' placeholder="メッセージ">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click='entrySchedule(rowId, name, inTime, outTime, message)'>OK</button>
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
    //import Menu from '@/components/Menu.vue'
    //require('firebase/firestore')

    //var memberRef = db.collection("users");
    export default {
        name: 'ramens',
        data() {
            return {
                ramens: [],
                isLogin: false,
                loginUser: null,
                date: this.$route.params.id,
                name: null,
                inTime: null,
                outTime: null,
                message: null,
                source: this.$store.state.getOption
            }
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
            });
            this.getUser()
        },
        methods: {
            getUser: function () {
                // ユーザー取得（ゲスト以外）
                db.collection("members").orderBy("kanaSei")
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        //const noentry = querySnapshot.doc.filter((doc) => !doc.data().hasOwnProperty("entry"));
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            const d = doc.data();
                            d.id = doc.id;
                            if (!(d.guest || d.cooperativeMember)) {
                                array.push(d);
                            }                          
                        });
                        this.ramens = array
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                console.log(this.date);
            },
            setRowId: function(docid, name) {
                //console.log("setRowId!", docid, name);
                this.rowId = docid;
                this.name = name;
            },
            entrySchedule: function(docid, name, in_, out_, message_) {
                // 登録
                var st = new Date(this.date);
                var ed = new Date(this.date);
                st.setHours(in_);
                st.setMinutes(0);
                //s.setSeconds(0);
                ed.setHours(out_);
                ed.setMinutes(0);
                db.collection("schedule").doc().set({
                    config: this.$store.state.config,
                    date: firebase.firestore.Timestamp.fromDate(new Date(st)),
                    memberUid: docid,
                    name: name,
                    outTime: firebase.firestore.Timestamp.fromDate(new Date(ed)),
                    message: message_
                })
                .then(() => {
                    console.log("Document successfully written!", this.date); 
                    this.$router.push(`/schedule` + '/' + this.date);               
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            },
            cancel: function() {
                this.$router.go(-1)
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
    .about {
        min-width: 400px;
    }
    .input {
        min-width: 100px;
    }
    .width300 {
        min-width: 300px;
    }
    .btn_ {
        margin: 10px;
    }
</style>