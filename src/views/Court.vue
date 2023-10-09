<template>
    <div class="about">
        <Menu></Menu>
        <h4>{{ $t("Court") }}</h4>
        <!--<button class='btn btn-secondary btn_' @click="cancel()">キャンセル</button>-->
        <button class='btn btn-primary' data-toggle="modal" data-target="#demoNormalModal" @click="setRowId(null, null, null)">{{ $t("Add") }}</button>
        <div class="margin"></div>
        <div class="row">
            <div class="col-sm-2 col-md-3"></div>
            <div class="col-sm-8 col-md-6">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">{{ $t("Court") }}</th>
                            <th scope="col" class="width150"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ramen, key) in ramens" :key="key">
                            <th>{{ ramen.no }}</th>
                            <td>{{ ramen.name }}</td>
                            <td>
                                <button class='btn btn-primary btn-sm btn__' data-toggle="modal" data-target="#demoNormalModal" @click="setRowId(ramen.id, ramen.no, ramen.name)">
                                    {{ $t("Edit") }}
                                </button>
                                <button v-if='!ramen.start && !ramen.end' class='btn btn-danger btn-sm btn__' @click="deleteRow(ramen.id)">
                                    {{ $t("Delete") }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>         
        </div>
        <!-- 編集ダイアログ -->
        <div class="modal fade" id="demoNormalModal" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="demoModalTitle">{{ $t("Edit") }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-1 col-md-2 col-lg-3"></div>
                            <div class="col-sm-10 col-md-8 col-lg-6">
                                <div class="input-group mb-3">
                                    <input v-model="no" placeholder="No">
                                </div>
                                <div class="input-group mb-3">
                                    <input v-model="name" class="width350" :placeholder='$t("Name")'>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button v-if='docId' type="button" class="btn btn-primary" data-dismiss="modal" @click='updateCourt(docId)'>OK</button>
                        <button v-else type="button" class="btn btn-primary" data-dismiss="modal" @click='updateCourt(null)'>{{ $t("Add") }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase'
    import { db } from "../main";
    import Menu from '@/components/Menu.vue'
<<<<<<< HEAD
    import { ja, enUS, zhCN, zhTW, ru, de, fr, nl, es, pt, it, arSA, ko, sr, cs, ro, hr, sv, sk } from 'date-fns/locale'
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
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
            });
<<<<<<< HEAD
            this.setLanguage()
            this.getCourt()        
        },
        methods: {
            getCourt: function() {
=======
            this.getUser()
        },
        methods: {
            getUser: function() {
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
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
                            array.push(d);
                        });
                        this.ramens = array
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            setRowId: function(id, no, name) {
                this.docId = id;
                this.no = no;
                this.name = name;
            },
            updateCourt: function(docid) {
                if (docid == null) {
                    db.collection("courts").doc().set({
                        config: this.$store.state.config,
<<<<<<< HEAD
                        no: Number(this.no),
=======
                        no: this.no,
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                        name: this.toHankaku(this.name?this.name:0)
                    })
                    .then(() => {
                        // Reload
                        this.$router.go({path: this.$router.currentRoute.path, force: true});
                    })
                    .catch((error) => {
                        console.log("Error writing documents: ", error);
                    });
                } else {
                    console.log(this.no);
                    db.collection("courts").doc(docid).update({
<<<<<<< HEAD
                        no: Number(this.no),
=======
                        no: this.no,
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                        name: this.toHankaku(this.name?this.name:0)
                    })
                    .then(() => {
                        // Reload
                        this.$router.go({path: this.$router.currentRoute.path, force: true});
                    })
                    .catch((error) => {
                        console.log("Error writing documents: ", error);
                    });
                }
                
            },
            deleteRow: function(docid) {
                db.collection("courts").doc(docid).delete().then(() => {
                    console.log("Document successfully deleted!");
                    // Reload
                    this.$router.go({path: this.$router.currentRoute.path, force: true});
                }).catch((error) => {
                    console.error("Error removing document: ", error);
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
<<<<<<< HEAD
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
                        this.locale = enUS;
                        this.$i18n.locale = "en"
                }               
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
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
        margin: 10px;
    }
    .width350 {
        width: 350px;
    }
    .width150 {
        min-width: 150px;
    }
    .btn_ {
        margin: 10px;
    }
    .btn__ {
        margin: 0 10px 0 0;
    }
</style>