<template>
    <div class="about">
        <div v-if='memberUid=="new"'><h4>{{ $t("Add") }}</h4></div>
        <div v-else><h4>{{ $t("Edit") }}</h4></div>
        <div class="row">
            <div class="col-sm-1 col-md-2 col-lg-3"></div>
            <div class="col-sm-10 col-md-8 col-lg-6">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-default">No</span>
                    <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" v-model="userNo" disabled>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">{{ $t("Name") }}</span>
                    <input type="text" aria-label="First name" class="form-control" v-model="nameSei">
                    <input type="text" aria-label="Last name" class="form-control" v-model="nameNa">
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">{{ $t("Sort") }}</span>
                    <input type="text" aria-label="First name kana" class="form-control" v-model="kanaSei">
                    <input type="text" aria-label="Last name kana" class="form-control" v-model="kanaNa">
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-default">{{ $t("Display name") }}</span>
                    <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" v-model="displayName">
                </div>                          
            </div>
        </div>
        <!--<button class='btn btn-secondary btn_' @click="cancel()">
            キャンセル
        </button>-->
        <button class='btn btn-primary btn_' @click="updateMember(member.id)">
            OK
        </button>
    </div>
    
   
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase'
    import { db } from "../main";

    export default {
        name: 'membernew',
        data() {
            return {
                member: null,
                isLogin: false,
                loginUser: null,
                memberUid: this.$route.params.id,
                userNo: 0,
                nameSei: null,
                nameNa: null,
                kanaSei: null,
                kanaNa: null,
                opasId: 0,
                adminMember: false,
                entry: false,
                game: false,
                reserved: false,
                cooperativeMember: false,
                displayName: null,
                source: this.$store.state.getOption
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
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                */
            });
            this.getUser()
        },
        methods: {
            getUser: async function () {
                // ユーザー取得               
                db.collection("members").doc(this.memberUid).get(this.source)
                    .then((doc) => {
                        if (doc.exists) {
                            console.log("Document data:", doc.data());
                            this.member = doc.data();
                            this.member.id = doc.id;
                            this.userNo = this.member.userNo?this.member.userNo:0;
                            this.nameSei = this.member.nameSei?this.member.nameSei:"";
                            this.nameNa = this.member.nameNa?this.member.nameNa:"";
                            this.kanaSei = this.member.kanaSei?this.member.kanaSei:"";
                            this.kanaNa = this.member.kanaNa?this.member.kanaNa:"";
                            this.displayName = this.member.displayName?this.member.displayName:"";
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
            },
            updateMember: function(docid) {
                db.collection("members").doc(docid).update({
                    nameSei: this.nameSei,
                    nameNa: this.nameNa,
                    kanaSei: this.kanaSei,
                    kanaNa: this.kanaNa?this.kanaNa:"",
                    opasId: this.opasId,
                    displayName: this.displayName
                })
                .then(() => {
                    this.$store.commit('setInvite', false)
                    // メンバーリストへ
                    this.$router.push(`/member?active=1`);
                })
                .catch((error) => {
                    console.log("Error writing documents: ", error);
                });   
            },
            cancel: function() {
                this.$router.go(-1);
            },
            toHankaku: function(str) {              
                if (!str) return "";
                console.log("str", str);
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
    .btn_ {
        margin: 30px 10px 10px 10px;
    }
</style>