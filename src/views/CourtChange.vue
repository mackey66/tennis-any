<template>
    <div class="about">
        
        <h4>{{ $t("Please make a selection.") }}</h4>
        <div class="row">
            <div class="col-sm-2 col-md-3"></div>
            <div class="col-sm-8 col-md-6">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{{ $t("Court") }}</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ramen, key) in ramens" :key="key">
                            <th scope="row">{{ key + 1 }}</th>
                            <td>{{ ramen.name }}</td>
                            <td>
                                <button class='btn btn-primary btn-sm' @click='selectCourt(ramen.id, ramen.name)'>
                                    {{ $t("Change") }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>         
        </div>
        <button class='btn btn-secondary btn_' @click="cancel()">{{ $t("Cancel") }}</button>
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
            this.getCourt()
        },
        methods: {
            getCourt: function() {
                // コート取得
                db.collection("courts").where("config", "==", this.$store.state.config).orderBy("no")
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            //console.log(doc.id, " => ", doc.data());
                            const d = doc.data();
                            d.id = doc.id;
                            //if (d.name != "未定") {
                                array.push(d);
                            //}                           
                        });
                        this.ramens = array
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            selectCourt: function(docid, name) {
                console.log(docid);
                var docRef = db.collection("gameEntries").doc(this.$route.params.id);
                docRef.update({
                    courtName: name
                })
                .then(() => {
                    console.log("Document successfully written!");
                    this.$router.push({ name: 'game', params: { id: new Date() } });
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
</style>