<template>
    <div class="container">
        
        <h4>{{ $t("Please link to a member") }}</h4>
        <p class="h6">※{{ $t("If you do not see your name below, please contact the administrator.") }}</p>
        <!--<button @click='getUser' class='btn btn-primary mt-3'>Get User</button>-->
        <div class="row">
            <div class="col-md-1 col-lg-2"></div>
            <div class="col-md-9 col-lg-8">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{{ $t("Sort") }}</th>
                            <th scope="col">{{ $t("Name") }}</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ramen, key) in ramens" :key="key">
                            <th scope="row">{{ key + 1 }}</th>
                            <td>{{ ramen.kanaSei }}</td>
                            <td>{{ ramen.nameSei }} {{ ramen.nameNa }}</td>
                            <td>
                                <div v-if='$store.state.isAdmin' class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.admin" disabled>
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {{ $t("Manager") }}
                                    </label>
                                </div>
                            </td>
                            <td>
                                <button v-if='!ramen.userUid' class='btn btn-primary btn-sm coart' @click="linkMember(ramen.id)">
                                    {{ $t("Link") }}
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
                const members = db.collection("members");
                members.orderBy("kanaSei")
                    .get({ source: 'cache' })
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            if (!(d.guest || d.cooperativeMember)) {
                                array.push(d);
                            }
                        });
                        this.ramens = array
                        if (this.ramens.length < 2) {
                            // キャッシュが空ならサーバーから取得
                            members.orderBy("kanaSei")
                                .get()
                                .then((querySnapshot) => {
                                    const array = [];
                                    querySnapshot.forEach((doc) => {
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
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            linkMember: function(docid) {
                db.collection("members").doc(docid).update({
                    userUid: this.loginUser.uid
                })
                .then(() => {
                    console.log("Document successfully written!");
                    // Inviteモード解除
                    this.$store.commit('setInvite', false)
                    alert(this.$t("I linked to it"));
                    this.$router.push(`/main`);
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
                console.log("doc.id = " + docid)
                console.log("user.uid = " + this.loginUser.uid)
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
    .coart {
        min-width: 60px
    }
</style>