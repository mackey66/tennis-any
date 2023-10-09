<template>
    <div class="container">
        <div class="row">
            <div class="col-lg-2 col-xl-3"></div>
            <div class="col-lg-8 col-xl-6">
                <div class="card mt-5">
                    <div class="card-body">
                        <div><h4>{{ $t("Please enter your invitation code") }}</h4></div>
                        <div class="margin"></div>
                        <div class="row">
                            <div class="col-sm-1"></div>
                            <div class="col-sm-10">
                                <div class="input-group mb-3">
                                    <span class="input-group-text">{{ $t("Invitation Code") }}</span>
                                    <input type="text" aria-label="ID" class="form-control" v-bind:class="{ 'is-invalid': hasError }" :placeholder='$t("The code you have heard from the organizer")' v-model="inviteCode">
                                    <div class="invalid-feedback">
                                        {{ error }}
                                    </div>
                                </div>                           
                            </div>
                            <div class="col-sm-1"></div>
                        </div>
                        <div class="row">
                            <div class="col-sm-5"></div>
                            <div class="col-sm-7">
                                <button class='btn btn-secondary btn_' @click="cancel()">
                                    {{ $t("Cancel") }}
                                </button>     
                                <button class='btn btn-primary btn_' @click="ok()">
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-2 col-xl-3"></div>
        </div>
    </div>
    
   
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase';
    import { db } from "../main";

    export default {
        name: 'invite',
        data() {
            return {
                member: null,
                isLogin: false,
                loginUser: null,
                source: this.$store.state.getOption,
                inviteCode: null,
                hasError: false,
                error: null

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
            // Inviteモード
            this.$store.commit('setInvite', true);
            this.setLanguage();
        },
        methods: {
            ok: function() {
                if (this.inviteCode == "" || this.inviteCode == null) {
                    this.hasError = true
                    this.error = this.$t("Cannot be left blank.")
                    return
                } else {
                    this.hasError = false
                    this.error = null
                }
                if (this.inviteCode == "admin") {
                    // adminの場合はconfigを新規作成
                    this.createConfig()
                    return
                }
                db.collection("configs").where("inviteCode", "==", this.inviteCode)
                    .get({source: 'server'})
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data()
                            d.id = doc.id;
                            array.push(d)
                        });
                        if (array.length == 0) {
                            alert(this.$t("Data not found. Please check if the invitation code is correct."));
                            return
                        } else if (array.length > 1) {
                            alert(this.$t("Multiple data are available. Please contact the organizer."));
                            return
                        } else {
                            if (array[0].userData == "select") {
                                // 設定がユーザ選択の場合 
                                // 設定をStoreにセット
                                this.$store.commit('setConfig', array[0].id)
                                this.$store.commit('setName', array[0].name)
                                this.$store.commit('setTopTitle', array[0].topTitle)
                                // ユーザリンクに移動
                                this.$router.push(`/memberLink`);
                            } else {
                                // 設定がユーザ作成の場合
                                // ユーザデータを作成してconfigをセット
                                this.getMaxUserNo(array[0]).then(maxNo => {
                                    //console.log("maxNo", maxNo);
                                    this.createMember(array[0], maxNo).then(newUid => {
                                        // 設定をStoreにセット
                                        this.$store.commit('setConfig', array[0].id)
                                        this.$store.commit('setName', array[0].name)
                                        this.$store.commit('setTopTitle', array[0].topTitle)
                                        // メンバー編集画面に遷移    
                                        this.$router.push({ name: 'membernew', params: { id: newUid } })
                                    });                                  
                                });
                            }
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });              
            },
            cancel: function() {
                firebase.auth().signOut();
                this.$router.go({path: this.$router.currentRoute.path, force: true})
                //this.$router.push({ name: 'mypage' })
            },
            getMaxUserNo: async function(arr) {
                let d;
                await db.collection("members").where("config", "==", arr.id).orderBy("userNo", "desc").limit(1)
                    .get({source: 'server'})
                    .then((querySnapshot) => {                   
                        querySnapshot.forEach((doc) => {
                            d = doc.data();                                                   
                        });                   
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                if (!d) d.userNo = 0
                return d.userNo              
            },
            createMember: async function(arr, no) {
                console.log("New UserNo", no, this.loginUser.displayName)
                let docRef = await db.collection("members").add({
                    config: arr.id,
                    userUid: this.loginUser.uid,
                    userNo: Number(Number(no) + 1),
                    nameSei: this.loginUser.displayName,
                    displayName: this.loginUser.displayName    
                })
                return docRef.id            
            },
            createConfig: async function() {
                let docRef = await db.collection("configs").add({
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
                    createdUser: this.loginUser.uid,
                    createdUserName: this.loginUser.displayName
                })
                this.$store.commit('setConfig', docRef.id)
                // 不要なゴミを削除しておく
                this.organizeConfigs(docRef.id)
                this.$router.push({ name: 'config' });
            },
            organizeConfigs: function(except) {
                // configを整理（exceptを除いてユーザが1件もないconfigは削除）
                db.collection("configs")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {                       
                            const d = doc.data();
                            d.id = doc.id
                            if (d.id != except) {
                                db.collection("members").where("config", "==", d.id).limit(1)
                                    .get()
                                    .then((querySnapshot) => {
                                        let i = 0                 
                                        querySnapshot.forEach(() => {
                                            i++                                                 
                                        });
                                        // 1件もなければconfigを削除
                                        if (i == 0) {
                                            db.collection("configs").doc(d.id).delete().then(() => {
                                                console.log("Document successfully deleted!");
                                            }).catch((error) => {
                                                console.error("Error removing document: ", error);
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
            },
            toHankaku: function(str) {              
                if (!str) return "";
                console.log("str", str);
                return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                });
            },
            setLanguage: function() {
                const lg = navigator.language
                switch (lg) {
                    case "en-US":
                        this.$i18n.locale = "en"
                        break;
                    case "ja":
                        this.$i18n.locale = "ja"
                        break;
                    case "zh-CN":
                        this.$i18n.locale = "zhCN"
                        break;
                    case "zh-TW":
                        this.$i18n.locale = "zhTW"
                        break;
                    case "ru-RU":
                        this.$i18n.locale = "ru"
                        break;
                    case "de":
                        this.$i18n.locale = "de"
                        break;
                    case "fr":
                        this.$i18n.locale = "fr"
                        break;
                    case "nl":
                        this.$i18n.locale = "nl"
                        break;
                    case "es-ES":
                        this.$i18n.locale = "es"
                        break;
                    case "pt-PT":
                        this.$i18n.locale = "pt"
                        break;
                    case "it-IT":
                        this.$i18n.locale = "it"
                        break;
                    case "ar":
                        this.$i18n.locale = "ar"
                        break;
                    case "ko-KR":
                        this.$i18n.locale = "ko"
                        break;
                    case "sr-RS":
                        this.$i18n.locale = "sr"
                        break;
                    case "cs":
                        this.$i18n.locale = "cs"
                        break;
                    case "ro-RO":
                        this.$i18n.locale = "ro"
                        break;
                    case "hr":
                        this.$i18n.locale = "hr"
                        break;
                    case "sv-SE":
                        this.$i18n.locale = "sv"
                        break;
                    case "sk":
                        this.$i18n.locale = "sk"
                        break;
                    default:
                        this.$i18n.locale = "en"
                } 
            }
        }
    }
</script>

<style scoped>
    h4 {
        margin-top: 20px;
    }
    .btn_ {
        margin: 30px 10px 10px 10px;
    }
    .margin {
        margin: 20px;
    }
    .width250 {
        max-width: 250px;
    }
</style>