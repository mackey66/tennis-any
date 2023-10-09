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
<<<<<<< HEAD
                <div class="table-responsive">
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
                                <td>{{ ramen.nameSei }} {{ ramen.nameNa }}</td>
                                <td class="nowrap">
                                    <button class='btn btn-primary btn-sm' @click='selectMember(ramen.id, ramen.displayName)'>
                                        {{ $t("Register") }}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
=======
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
                            <td>{{ ramen.nameSei }} {{ ramen.nameNa }}</td>
                            <td>
                                <button class='btn btn-primary btn-sm' @click='selectMember(ramen.id, ramen.displayName)'>
                                    {{ $t("Register") }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
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
            getUser: async function () {
                // ユーザー取得（エントリー済、またはゲスト）               
                db.collection("members").where("entry", "==", true).orderBy("kanaSei")
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            //console.log(doc.id, " => ", doc.data());
                            const d = doc.data();
                            d.id = doc.id;
                            if (!(d.game || d.reserved)) {
                                array.push(d);
                            }                           
                        });
                        db.collection("members").where("guest", "==", true).orderBy("kanaSei")
                            .get()
                            .then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    const d = doc.data();
                                    d.id = doc.id;
                                    array.push(d);
                                    this.ramens = array
                                });
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                        });                    
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                /*
                // orWhereが使えないので結果を結合
                const snap1 = await db.collection('members').where('entry', '==', true).orderBy('kanaSei').get();
                const snap2 = await db.collection('members').where('guest', '==', true).orderBy('kanaSei').get();
                const snap_ = [snap1, snap2].map(snap => ({ id: snap.id, ...snap.data() })); // 結果をentity に格納
                this.ramens = snap_;
                */
            },
            selectMember: function(docid, name) {
                var docRef = db.collection("gameEntries").doc(this.$route.params.id);
                docRef.get(this.source).then((doc) => {
                    if (doc.exists) {
                        console.log("Document data:", doc.data());
                        if (!doc.data().member1Uid) {
                            docRef.update({
                                member1Uid: docid,
                                member1Name: name
                            })
                            .then(() => {
                                console.log("Document successfully written!");
                                //this.setGameMember(docid);
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        } else if (!doc.data().member2Uid) {
                            docRef.update({
                                member2Uid: docid,
                                member2Name: name
                            })
                            .then(() => {
                                console.log("Document successfully written!");
                                //this.setGameMember(docid);
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        } else if (!doc.data().member3Uid) {
                            docRef.update({
                                member3Uid: docid,
                                member3Name: name
                            })
                            .then(() => {
                                console.log("Document successfully written!");
                                //this.setGameMember(docid);
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        } else if (!doc.data().member4Uid) {
                            docRef.update({
                                member4Uid: docid,
                                member4Name: name
                            })
                            .then(() => {
                                console.log("Document successfully written!");
                                //this.setGameMember(docid);
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        } else {
                            // 全てメンバーが埋まっている場合は何もしない
                        }
                        this.$router.push(`/game`);
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");                       
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
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
    .btn_ {
        margin: 10px;
    }
<<<<<<< HEAD
    .nowrap {
        white-space: nowrap;
    }
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
</style>