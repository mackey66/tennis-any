<template>
    <div class="select">
        
        <h4>{{ $t("Please make a selection.") }}</h4>
        <button class='btn btn-secondary btn_' @click="cancel()">{{ $t("Cancel") }}</button>
        <div class="row">
            <div class="col-sm-1 col-md-2"></div>
            <div class="col-sm-10 col-md-8">
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
                                <button class='btn btn-primary btn-sm' @click='entryMember(ramen.id, ramen.displayName)'>
                                    {{ $t("entry") }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                // ユーザー取得（未エントリー）
                db.collection("members").where("config", "==", this.$store.state.config).orderBy("kanaSei")
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            if (!(d.entry || d.guest || d.cooperativeMember)) {
                                array.push(d);
                            }                          
                        });
                        this.ramens = array
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            entryMember: function(docid, name) {
                // エントリー
                db.collection("attendance").doc().set({
                    config: this.$store.state.config,
                    inTime: firebase.firestore.Timestamp.fromDate(new Date()),
                    memberUid: docid,
                    name: name
                })
                .then(() => {
                    console.log("Document successfully written!");                   
                    // メンバーのエントリーフラグを立てる
                    db.collection("members").doc(docid).update({
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
                                    this.$router.push({ name: 'entry', params: { id: new Date() } })
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
    .select {
        min-width: 376px;
    }
    .btn_ {
        margin: 10px;
    }
</style>