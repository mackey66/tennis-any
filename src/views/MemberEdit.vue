<template>
    <div class="about">
        <div v-if='memberUid=="new"'><h4>{{ $t("Add") }}</h4></div>
        <div v-else><h4>{{ $t("Edit") }}</h4></div>
        <div class="row">
            <div class="col-sm-1 col-md-2 col-lg-3"></div>
            <div class="col-sm-10 col-md-8 col-lg-6">
                <div class="input-group mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-default">No</span>
                    <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" v-model="userNo">
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
                <div class="input-group mb-3">
                    <span class="input-group-text" id="inputGroup-sizing-default">{{ $t("Gender") }}</span>
                    <div class="margin"></div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="0" v-model="gender">
                        <label class="form-check-label" for="inlineRadio1">{{ $t("Male") }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="1" v-model="gender">
                        <label class="form-check-label" for="inlineRadio2">{{ $t("Female") }}</label>
                    </div>
                </div>
                <div v-if='$store.state.opas' class="input-group mb-3">
                    <span class="input-group-text">
                        OPAS ID/Pass
                        <div class="checkbox-inline tips margin-left" >
                            <input type="checkbox" v-model="t" true-value="text" false-value="password"/>{{ $t("Unmasking") }}
                        </div>
                    </span>
                    <input type="text" aria-label="ID" class="form-control" v-model="opasId">
                    <input type="password" aria-label="Pass" class="form-control" v-model="opasPass" v-if="t == 'password'">
                    <input type="text" aria-label="Pass" class="form-control" v-model="opasPass" v-if="t == 'text'">
                    
                </div>
                <div v-if='$store.state.opas' class="input-group mb-3">
                    <span class="input-group-text">{{ $t("Deadline") }}</span>
                    <!--<input type="text" aria-label="Deadline" class="form-control" v-model="deadline">-->
                    <datepicker class="form-control" 
                        v-model="picked" 
                        :locale="locale"
                        :weekStartsOn=0
                    />
                </div>
                <div class="row">
                    <div class="col-sm">
                        <div v-if='$store.state.isAdmin' class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="adminMember">
                            <label class="form-check-label" for="flexCheckChecked">
                                {{ $t("Manager") }}
                            </label>
                        </div>
                        <div v-if='$store.state.isAdmin' class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="cooperativeMember">
                            <label class="form-check-label" for="flexCheckChecked">
                                {{ $t("Cooperative member") }}
                            </label>
                        </div>                    
                        <div v-if='$store.state.isAdmin' class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="entry">
                            <label class="form-check-label" for="flexCheckChecked">
                                {{ $t("Entry") }}
                            </label>
                        </div>
                        <div v-if='$store.state.isAdmin' class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="game">
                            <label class="form-check-label" for="flexCheckChecked">
                                {{ $t("Game") }}
                            </label>
                        </div>
                        <div v-if='$store.state.isAdmin' class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="reserved">
                            <label class="form-check-label" for="flexCheckChecked">
                                {{ $t("Reserved") }}
                            </label>
                        </div>
                        <div v-if='$store.state.isAdmin' class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="check1">
                            <label class="form-check-label" for="flexCheckChecked">
                                {{ $store.state.memberCheckName }}
                            </label>
                        </div>
                        <div v-if='$store.state.isAdmin' class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="suspension">
                            <label class="form-check-label" for="flexCheckChecked">
                                {{ $t("Suspension") }}
                            </label>
                        </div>
                        <div v-if='$store.state.isAdmin' class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="resigned">
                            <label class="form-check-label" for="flexCheckChecked">
                                {{ $t("Resigned") }}
                            </label>
                        </div>
                        
                    </div>
                </div>                           
            </div>
        </div>
        <button class='btn btn-secondary btn_' @click="cancel()">
            {{ $t("Cancel") }}
        </button>     
        <button v-if='memberUid=="new"' class='btn btn-primary btn_' @click="updateMember(null)">
            {{ $t("Add") }}
        </button>
        <button v-else class='btn btn-primary btn_' @click="updateMember(member.id)">
            OK
        </button>
    </div>
    
   
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase'
    import { db } from "../main";
    import Datepicker from 'vue3-datepicker'
    import { format } from 'date-fns'
    import crypto from 'crypto-js';
    import { ja, enUS, zhCN, zhTW, ru, de, fr, nl, es, pt, it, arSA, ko, sr, cs, ro, hr, sv, sk } from 'date-fns/locale'

    

    export default {
        name: 'memberedit',
        components: {
            Datepicker
        },
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
                opasPass: null,
                suspension: false,
                resigned: false,
                deadline: null,
                format: format,
                locale: ja,
                source: this.$store.state.getOption,
                gender: 0,
                p: "secret-password", 
                t: "password",
                check1: false,
            }
        },
        computed: {
            picked: {
                get () {
                    return this.deadline
                },
                set (value) {                    
                    this.deadline = value         
                }
            },
            vm: {
                el: "#app",
                data: {p: "secret-password", t: "password"},
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
            if (this.memberUid == "new") {
                this.getMaxUserNo().then(maxNo => {
                    //console.log(maxNo)
                    //console.log(Number(maxNo) + Number(1))
                    this.userNo = Number(maxNo) + Number(1)                                  
                });
            } else {
                this.getUser()
            }
            
        },
        methods: {
            getUser: async function () {
                // ユーザー取得               
                db.collection("members").doc(this.memberUid).get(this.source)
                    .then((doc) => {
                        if (doc.exists) {
                            console.log("Document data:", doc.data());                         
                            this.member = doc.data();
                            // パスワードを復号する
                            // 注意!:復号化した値を使用する時は、エンコードを忘れずに
                            const decrypted = crypto.AES.decrypt(this.member.opasPass, 'pass');
                            console.log("pass: " + decrypted.toString(crypto.enc.Utf8));
                            this.member.id = doc.id;
                            this.userNo = this.member.userNo?this.member.userNo:0;
                            this.nameSei = this.member.nameSei?this.member.nameSei:"";
                            this.nameNa = this.member.nameNa?this.member.nameNa:"";
                            this.kanaSei = this.member.kanaSei?this.member.kanaSei:"";
                            this.kanaNa = this.member.kanaNa?this.member.kanaNa:"";
                            this.opasId = this.member.opasId?this.member.opasId:"";
                            this.adminMember = this.member.admin;
                            this.entry = this.member.entry;
                            this.game = this.member.game;
                            this.reserved = this.member.reserved;
                            this.cooperativeMember = this.member.cooperativeMember;
                            this.opasPass = this.member.opasPass?decrypted.toString(crypto.enc.Utf8):"";
                            //this.opasPass = this.member.opasPass?this.member.opasPass:"";
                            this.suspension = this.member.suspension;
                            this.resigned = this.member.resigned;
                            //this.deadline = this.member.deadline?this.member.deadline.toDate():new Date();
                            this.deadline = this.member.deadline?this.member.deadline.toDate():null;
                            this.displayName = this.member.displayName?this.member.displayName:"";
                            this.gender = this.member.gender?this.member.gender:0;
                            this.check1 = this.member.check1?this.member.check1:0;
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
            },
            updateMember: function(docid) {
                // パスワードは暗号化する
                const ecrypted = crypto.AES.encrypt(this.opasPass, 'pass');
                console.log("pass: " + ecrypted.toString());
                if (docid == null) {
                    db.collection("members").doc().set({
                        config: this.$store.state.config,
                        userNo: Number(this.userNo),
                        nameSei: this.nameSei,
                        nameNa: this.nameNa,
                        kanaSei: this.kanaSei,
                        kanaNa: this.kanaNa?this.kanaNa:"",
                        opasId: Number(this.toHankaku(this.opasId?this.opasId:0)),
                        admin: this.adminMember?this.adminMember:false,
                        entry: this.entry?this.entry:false,
                        game: this.game?this.game:false,
                        reserved: this.reserved?this.reserved:false,
                        cooperativeMember: this.cooperativeMember?this.cooperativeMember:false,
                        opasPass: this.opasPass?ecrypted.toString():"",
                        //opasPass: this.opasPass?this.opasPass:"",
                        suspension: this.suspension?this.suspension:false,
                        resigned: this.resigned?this.resigned:false,
                        deadline: this.deadline?firebase.firestore.Timestamp.fromDate(new Date(this.deadline)):null,//firebase.firestore.Timestamp.fromDate(new Date()),
                        displayName: this.displayName,
                        gender: this.gender,
                        check1: this.check1,
                    })
                    .then(() => {
                        this.$router.go(-1);
                    })
                    .catch((error) => {
                        console.log("Error writing documents: ", error);
                    });
                } else {
                    db.collection("members").doc(docid).update({
                        userNo: Number(this.userNo),
                        nameSei: this.nameSei,
                        nameNa: this.nameNa,
                        kanaSei: this.kanaSei,
                        kanaNa: this.kanaNa?this.kanaNa:"",
                        opasId: this.opasId,
                        admin: this.adminMember?this.adminMember:false,
                        entry: this.entry?this.entry:false,
                        game: this.game?this.game:false,
                        reserved: this.reserved?this.reserved:false,
                        cooperativeMember: this.cooperativeMember?this.cooperativeMember:false,
                        opasPass: this.opasPass?ecrypted.toString():"",
                        //opasPass: this.opasPass?this.opasPass:"",
                        suspension: this.suspension?this.suspension:false,
                        resigned: this.resigned?this.resigned:false,
                        deadline: this.deadline?firebase.firestore.Timestamp.fromDate(new Date(this.deadline)):null,
                        displayName: this.displayName,
                        gender: this.gender,
                        check1: this.check1,
                    })
                    .then(() => {
                        this.$router.go(-1);
                    })
                    .catch((error) => {
                        console.log("Error writing documents: ", error);
                    });
                }
                
            },
            cancel: function() {
                this.$router.go(-1);
            },
            getMaxUserNo: async function() {
                let d;
                await db.collection("members").where("config", "==", this.$store.state.config).orderBy("userNo", "desc").limit(1)
                    .get()
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
            toHankaku: function(str) {              
                if (!str) return "";
                console.log("str", str);
                return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                });
            },
            setLanguage: function() {
                const lg = navigator.language
                console.log(lg)
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
    h4 {
        margin-top: 20px;
    }
    .table {
        text-align: left;
    }
    .btn_ {
        margin: 30px 10px 10px 10px;
    }
    .date {
        text-align: right;
        background-color: white;
        margin: 30px 10px 10px 10px;
    }
    .margin {
        margin: 10px;
    }
    .margin-left {
        margin-left: 10px;
    }
    .tips {
        font-size: 80%;
        text-align: right;
        font-weight: normal;
    }
</style>