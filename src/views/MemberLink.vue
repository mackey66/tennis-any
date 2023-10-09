<template>
    <div class="container">
        
        <h4>{{ $t("Please link to a member") }}</h4>
        <p class="h6 tips">※{{ $t("If you do not see your name below, please contact the administrator.") }}</p>
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
                                <div v-if='$store.state.isAdmin && ramen.admin' class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.admin" disabled>
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {{ $t("Manager") }}
                                    </label>
                                </div>
                            </td>
                            <td>
                                <button v-if='!ramen.userUid' class='btn btn-primary btn-sm coart' @click="linkMember(ramen.id, ramen.nameSei + ' ' + ramen.nameNa)">
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
    import { ja, enUS, zhCN, zhTW, ru, de, fr, nl, es, pt, it, arSA, ko, sr, cs, ro, hr, sv, sk } from 'date-fns/locale'
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
                source: this.$store.state.getOption,
                locale: ja
            }
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
            });
            this.getUser()
            this.setLanguage()
        },
        methods: {
            getUser: function () {
                const members = db.collection("members");
                members.where("config", "==", this.$store.state.config).orderBy("kanaSei")
                    .get() // サーバーから取得
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            if (!(d.guest || d.cooperativeMember || d.resigned)) {
                                array.push(d);
                            }
                        });
                        this.ramens = array
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            linkMember: function(docid, name) {
                let result = window.confirm('あなたは' + name + 'さんで間違いないですか？')
                if( result ) {
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
            },
            setLanguage: function() {
                
                const lg = (window.navigator.languages && window.navigator.languages[0]) ||
                    window.navigator.language ||
                    window.navigator.userLanguage ||
                    window.navigator.browserLanguage;
                console.log(lg)
                //this.$i18n.locale = navigator.language
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
    .coart {
        min-width: 60px
    }
    .tips {
        margin: 5px;
        font-size: 80%;
        font-weight: normal;
    }
</style>