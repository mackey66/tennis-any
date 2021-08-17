<template>
    <div class="about">
        <div><h4>{{ $t("Config") }}</h4></div>
        <div class="margin"></div>
        <div class="row">
            <div class="col-sm-1 col-md-2 col-lg-3"></div>
            <div class="col-sm-10 col-md-8 col-lg-6">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-default">{{ $t("Group Name") }}</span>
                    <input type="text" class="form-control" v-bind:class="{ 'is-invalid': nameHasError }" :placeholder='$t("Name of the group (displayed in the navigation bar)")' aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" v-model="name">
                    <div class="invalid-feedback">
                        {{ nameError }}
                    </div>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-default">{{ $t("Top Page Title") }}</span>
                    <input type="text" class="form-control" :placeholder='$t("Title to be displayed on the top page")' aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" v-model="topTitle">
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">{{ $t("Official Site") }}</span>
                    <input type="text" aria-label="ID" class="form-control" :placeholder='$t("URL of the official site")' v-model="officialUrl">
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">{{ $t("Official Site Title") }}</span>
                    <input type="text" aria-label="ID" class="form-control" :placeholder='$t("Title of the official site")' v-model="officialTitle">
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">{{ $t("Invitation Code") }}</span>
                    <input type="text" aria-label="ID" class="form-control" v-bind:class="{ 'is-invalid': inviteCodeHasError }" :placeholder='$t("Please make it simple, such as numbers or alphabets")' v-model="inviteCode">
                    <div class="invalid-feedback">
                        {{ inviteCodeError }}
                    </div>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">{{ $t("User Data") }}</span>       
                    <div class="form-check form-check-inline margin-left">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="create" v-model="userData">
                        <label class="form-check-label" for="inlineRadio1">{{ $t("Created by user") }}</label>
                    </div>
                    <div class="form-check form-check-inline margin-left">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="select" v-model="userData">
                        <label class="form-check-label" for="inlineRadio2">{{ $t("Select User") }}</label>
                    </div>    
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">OPAS</span>       
                    <div class="form-check form-check-inline margin-left">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio3" value=true v-model="opas">
                        <label class="form-check-label" for="inlineRadio3">{{ $t("Use") }}</label>
                    </div>
                    <div class="form-check form-check-inline margin-left">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio4" value=false v-model="opas">
                        <label class="form-check-label" for="inlineRadio4">{{ $t("Do not use") }}</label>
                    </div>    
                </div>
                <div><p v-if='$store.state.invite'>{{ $t("The first thing you need to do is to set up a group name and invitation code and give the members the URL") }}( {{ origin }} ) {{ $t("and the invitation code. Next, you need to create at least one coat in maintenance.") }}</p></div>                
            </div>    
        </div>
        
        <button class='btn btn-secondary btn_' @click="cancel()">
            {{ $t("Cancel") }}
        </button>     
        <button class='btn btn-primary btn_' @click="updateConfig()">
            OK
        </button>
    </div>
    
   
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase';
    import { db } from "../main";

    export default {
        name: 'memberedit',
        data() {
            return {
                member: null,
                isLogin: false,
                loginUser: null,
                source: this.$store.state.getOption,
                name: null,
                topTitle: null,
                officialUrl: null,
                officialTitle: null,
                inviteCode: null,
                userData: "create",
                opas: false,
                origin: null,
                nameHasError: false,
                nameError: null,
                inviteCodeHasError: false,
                inviteCodeError: null
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
            this.setLanguage();
            this.getOrigin()
            this.getConfig()
        },
        methods: {
            getConfig: function() {
                // 設定取得
                console.log("config", this.$store.state.config)       
                db.collection("configs").doc(this.$store.state.config).get()
                    .then((doc) => {
                        if (doc.exists) {
                            console.log("Document data:", doc.data());
                            this.name = doc.data().name?doc.data().name:"";
                            this.topTitle = doc.data().topTitle?doc.data().topTitle:"";
                            this.officialUrl = doc.data().officialUrl?doc.data().officialUrl:"";
                            this.officialTitle = doc.data().officialTitle?doc.data().officialTitle:"";
                            this.inviteCode = doc.data().inviteCode?doc.data().inviteCode:"";
                            this.userData = doc.data().userData?doc.data().userData:"create";
                            this.opas = doc.data().opas?doc.data().opas:false;
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                });
                console.log("name", this.$store.state.name)
            },
            updateConfig: function() {
                if (this.inviteCode == "" || this.inviteCode == null) {
                    this.inviteCodeHasError = true
                    this.inviteCodeError = this.$t("Cannot be left blank.")
                    return
                } else {
                    this.inviteCodeHasError = false
                    this.inviteCodeError = null
                }
                if (this.name == "" || this.name == null) {
                    this.nameHasError = true
                    this.nameError = this.$t("Cannot be left blank.")
                    return
                } else {
                    this.nameHasError = false
                    this.nameError = null
                }
                this.checkInviteCodeUnique().then(ret => {
                    if (ret) {
                        this.inviteCodeHasError = true
                        this.inviteCodeError = this.$t("We have the same code. Please use a different code.")
                        return
                    } else {
                        this.inviteCodeHasError = false
                        this.inviteCodeError = null
                        db.collection("configs").doc(this.$store.state.config)
                            .update({
                                name: this.name,
                                topTitle: this.topTitle,
                                officialUrl: this.officialUrl,
                                officialTitle: this.officialTitle,
                                inviteCode: this.toHankaku(this.inviteCode),
                                userData: this.userData,
                                opas: this.toBoolean(this.opas)
                            })
                            .then(() => {
                                // Storeも設定
                                this.$store.commit('setName', this.name)
                                this.$store.commit('setOfficialTitle', this.topTitle)
                                this.$store.commit('setOfficialUrl', this.officialUrl)
                                this.$store.commit('setOfficialTitle', this.officialTitle)
                                this.$store.commit('setOpas', this.toBoolean(this.opas))
                                if (this.$store.state.invite && !this.$store.state.inviteSelect) {
                                    // Inviteモードなら管理ユーザ作成
                                    this.createMember()
                                } else {
                                    this.$router.go(-1);
                                }                   
                            })
                            .catch((error) => {
                                console.log("Error writing documents: ", error);
                        });
                    }
                });                 
            },
            checkInviteCodeUnique: async function() {
                const array = [];
                await db.collection("configs").where("inviteCode", "==", this.inviteCode)
                    .get()
                    .then((querySnapshot) => {   
                        querySnapshot.forEach((doc) => {
                            array.push(doc.data());                                         
                        });
                        console.log("array.length", array.length) 
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                if ((array.length > 0 && this.$store.state.invite) || (array.length > 1 && !this.$store.state.invite)) {
                    return true
                } else {
                    return false
                }
            },
            cancel: function() {
                this.$router.go(-1);
            },
            createMember: async function() {
                // 最初のメンバー作成
                let docRef = await db.collection("members").add({
                    config: this.$store.state.config,
                    userUid: this.loginUser.uid,
                    userNo: Number(1),
                    nameSei: this.loginUser.displayName,
                    displayName: this.loginUser.displayName,
                    admin: true   
                })
                // メンバー編集画面に遷移    
                this.$router.push({ name: 'membernew', params: { id: docRef.id } })                           
            },
            toHankaku: function(str) {              
                if (!str) return "";
                console.log("str", str);
                return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                });
            },
            toBoolean: function(value) {
                switch (value) {
                case true:
                case 'true':
                case 1:
                case '1':
                    return true;
                case false:
                case 'false':
                case 0:
                case '0':
                    return false;
                default:
                    return null;
                }
            },
            getOrigin() {
                this.origin = window.location.origin;
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
    .about {
        min-width: 440px
    }
    .btn_ {
        margin: 30px 10px 10px 10px;
    }
    .margin {
        margin: 20px;
    }
    .margin-left {
        margin: 0 0 0 10px;
    }
    p {
        text-align:left;
    }
</style>