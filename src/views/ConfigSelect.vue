<template>
    <div class="about">
        <Menu></Menu>
        <h4>{{ $t("Please make a selection.") }}</h4>
        <div class="margin"></div>
        <div class="row">
            <div class="col-sm-2 col-md-3"></div>
            <div class="col-sm-8 col-md-6">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{{ $t("Name") }}</th>
                            <th scope="col" class="width150"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ramen, key) in ramens" :key="key">
                            <th>{{ key + 1 }}</th>
                            <td>{{ ramen.name }}</td>
                            <td>
                                <button class='btn btn-primary btn-sm btn_' @click="selectConfig(ramen.id, ramen.name, ramen.topTitle, ramen.officialUrl, ramen.officialTitle)">
                                    {{ $t("Choice") }}
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
    import Menu from '@/components/Menu.vue'
    //require('firebase/firestore')

    //var memberRef = db.collection("users");
    export default {
        name: 'ramens',
        components: {
            Menu
        },
        data() {
            return {
                ramens: [],
                isLogin: false,
                loginUser: null,
                docId: null,
                no: 0,
                name: null,
                source: this.$store.state.getOption
            }
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
                db.collection("members").where("userUid", "==", this.loginUser.uid)
                    .get()
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {                        
                            array.push(doc.data().config)
                        });
                        // 10個まで（Firestoreのin検索の制限）
                        const arr = array.slice(0, 9)
                        this.getConfig(arr)                  
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            });
            
        },
        methods: {
            getConfig: function(arr) {
                // Config取得
                db.collection("configs").where(firebase.firestore.FieldPath.documentId(), 'in', arr)
                    .get()
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
            selectConfig: function(docid, name, title, url, otitle) {
                this.$store.commit('setConfig', docid);
                this.$store.commit('setName', name)
                this.$store.commit('setTopTitle', title)
                this.$store.commit('setOfficialUrl', url)
                this.$store.commit('setOfficialTitle', otitle)
                console.log(docid)
                db.collection("members").where("userUid", "==", this.loginUser.uid).where("config", "==", docid)
                    .get()
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => { 
                            const d = doc.data()
                            d.id = doc.id
                            if (!d.guest) {
                                array.push(d.admin);
                            }                        
                        });
                        this.$store.commit('setAdmin', array[0])
                        this.$router.go(-1)                       
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                }); 
            },
            cancel: function() {
                this.$router.go(-1)
            },
            toHankaku: function(str) {
                if (!str) return "";
                return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                });
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
    .margin {
        margin: 20px;
    }
    .width350 {
        width: 350px;
    }
    .width150 {
        width: 150px;
    }
    .btn_ {
        margin: 0px 10px 0 0;
    }
</style>