<template>
    <div class="about">
        <Menu class="sticky-top"></Menu>
        <div class="row">
            <div class="col-sm-0 col-md-0 col-lg-0 col-xl-0"></div>
            <div class="col-sm-12 col-md-9 col-lg-7 col-xl-6">
                <h4>OPAS</h4>
            </div>
            <div class="col-sm-0 col-md-3 col-lg-5 col-xl-6"></div>
        </div>
        <div class="margin"></div> 
        <div class="row">
            <div class="col-sm-0 col-md-0 col-lg-0 col-xl-0"></div>
            <div class="col-sm-12 col-md-9 col-lg-7 col-xl-6">
                <div>
                    <button v-if='!edit && ramens.length > 0' class='btn btn-secondary btn_' data-toggle="modal" data-target="#selectDialog" @click="setRowIdDownload()">{{ $t("Download") }}</button>
                </div>
            </div>
            <div class="col-sm-0 col-md-3 col-lg-5 col-xl-6"></div>
        </div>
        <div class="margin"></div> 
        <div class="row">          
            <div class="col-sm-0 col-md-0 col-lg-0 col-xl-0"></div>
            <div class="col-sm-12 col-md-9 col-lg-7 col-xl-6">
                <div class="table-responsive">
                    <table class="table" ref="xlsxsheet">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">{{ $t("Name") }}</th>
                                <th scope="col">{{ $t("Sort") }}</th>
                                <th scope="col">ID</th>
                                <th scope="col" >{{ $t("deadline") }}</th>
                                <th scope="col" ></th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th><div>{{ sum }}</div></th>
                                <th></th>
                                <th></th>                          
                            </tr>     
                        </tfoot>
                        <tbody>
                            <tr v-for="(ramen, key) in ramens" :key="key"
                                :class="{ active: isActive(key) }"
                                @click="activeNumber = key">
                                <th scope="row">
                                    <div v-if='ramen.suspension' class="danger">{{ ramen.userNo }}</div>
                                    <div v-else>{{ ramen.userNo }}</div>
                                </th>
                                <td class="nowrap">
                                    <div v-if='ramen.suspension' class="danger">{{ ramen.nameSei }} {{ ramen.nameNa }}</div>
                                    <div v-else>{{ ramen.nameSei }} {{ ramen.nameNa }}</div>
                                </td>
                                <td class="nowrap">
                                    <div v-if='ramen.suspension' class="danger">{{ ramen.kanaSei }} {{ ramen.kanaNa }}</div>
                                    <div v-else>{{ ramen.kanaSei }} {{ ramen.kanaNa }}</div>
                                </td>
                                <td>
                                    <div v-if='ramen.suspension' class="danger">{{ ramen.opasId }}</div>
                                    <div v-else>{{ ramen.opasId }}</div>
                                </td>
                                <td>
                                    <div v-if='(ramen.deadline?ramen.deadline.toDate():"") < today' class="danger">{{ ramen.deadline?format(ramen.deadline.toDate(), 'yy/MM', {locale: locale}):"" }}</div>
                                    <div v-else-if='(ramen.deadline?ramen.deadline.toDate():"") < new Date(today.getFullYear(), today.getMonth() + 3, 0)' class="warning">{{ ramen.deadline?format(ramen.deadline.toDate(), 'yy/MM', {locale: locale}):"" }}</div>
                                    <div v-else>{{ ramen.deadline?format(ramen.deadline.toDate(), 'yy/MM', {locale: locale}):"" }}</div>
                                </td>
                                <td>
                                    <button v-if='ramen.opasId && !ramen.suspension' class='btn btn-success btn-sm btn__' @click='loginOpas(ramen.opasId, ramen.opasPass_)'>
                                        <fa icon="sign-in-alt" />&ensp;{{ $t("Login") }}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-sm-0 col-md-3 col-lg-5 col-xl-6"></div>        
        </div>
        <!-- ダウンロード選択ダイアログ -->
        <div class="modal fade" id="selectDialog" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="demoModalTitle"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body left">
                        {{ $t("Please select") }}
                    </div>
                    <div class="modal-footer">                           
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" >{{ $t("Cancel") }}</button>
                        <button type="button" class="btn btn-primary" style="min-width:80px" data-dismiss="modal" @click='download'>{{ $t("Download") }}</button>    
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
    import { format } from 'date-fns'
    import crypto from 'crypto-js';
    import { ja, enUS, zhCN, zhTW, ru, de, fr, nl, es, pt, it, arSA, ko, sr, cs, ro, hr, sv, sk } from 'date-fns/locale'
    //require('firebase/firestore')
    import XLSX from "xlsx-js-style"
    

    //var memberRef = db.collection("users");
    export default {
        name: 'member',
        components: {
            Menu
        },
        data() {
            return {
                ramens: [],
                today: new Date(),
                format: format,
                locale: ja,
                source: this.$store.state.getOption,
                activeNumber: null,
                sum: 0
            }
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
            });
            this.setLanguage()
            this.getMember()
        },
        methods: {
            getMember: async function () {               
                db.collection("members").where("config", "==", this.$store.state.config).orderBy("userNo")
                .get(this.source)
                .then((querySnapshot) => {
                    const array = [];
                    querySnapshot.forEach((doc) => {
                        const d = doc.data();
                        d.id = doc.id;
                        d.kana = doc.data().kanaSei + "　" + doc.data().kanaNa;
                        // パスワードを復号する
                        // 注意!:復号化した値を使用する時は、エンコードを忘れずに
                        if (d.opasPass) {
                            const decrypted = crypto.AES.decrypt(d.opasPass, 'pass');
                            d.opasPass_ = decrypted.toString(crypto.enc.Utf8);
                        }
                        if (!d.guest && !d.resigned) {
                            array.push(d);
                        }
                        // カナでソート
                        array.sort(function(a, b) {
                            if (a.kana < b.kana) return -1;
                            if (a.kana > b.kana) return 1;
                            return 0;
                        });                                        
                    });
                    this.ramens = array
                    this.sum = this.calculate()
                    console.log("source", this.source)
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });              
            },
            loginOpas: function (id, pass) {
                var url = 'http://133.130.70.244/~ymaki/limited/opas?id=' + id + '&pass=' + pass;
                // こっちはstaticフォルダにBasic認証をかけられたら採用予定 #2021-07-14
                //var url = './opas/index.html?id=' + id + '&pass=' + 'hamad' + pass;
                window.open(url, '_blank');
            },
            deleteMember: function(docid) {
                if (!docid) {
                    console.log(docid)
                    return
                }
                let result = window.confirm(this.$t('Delete >') + this.$t('Is it OK?'));
                if( result ) {
                    db.collection("members").doc(docid).delete().then(() => {
                        console.log("Document successfully deleted!");
                        // Reload
                        //this.$router.go({path: this.$router.currentRoute.path, force: true})
                        this.getMember()
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                }
                else {
                    return
                }              
            },
            isActive: function(number) {
                if (number == this.activeNumber) return true;
            },
            calculate: function() {
                // カード数の計算
                let sum = 0;
                this.ramens.forEach((item, key) => {
                    if (this.ramens[key].opasId && !this.ramens[key].suspension) {
                        sum++
                    }                      
                });
                return sum
            },
            setRowIdDownload: function() {
                //
            },
            download: async function() {
                const data = this.$refs.xlsxsheet

                const sheet = XLSX.utils.table_to_sheet(data);
                const json = XLSX.utils.sheet_to_json(sheet);
                const rows = json.map(row => ({
                    No: row.No,
                    名前: row.名前,
                    カナ: row.カナ,
                    ID: row.ID
                }));
                /* generate worksheet and workbook */
                const worksheet = XLSX.utils.json_to_sheet(rows);
             
                //
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "コート");
                worksheet["!cols"] = [ { wch: 4 }, { wch: 12 }, { wch: 20 }, { wch: 10 } ];
                
                XLSX.writeFile(workbook, this.$t("OPAS") + this.formatDate(new Date(), 'yyyyMMdd') + '.xlsx');
            },
            formatDate: function (date, format) {
                format = format.replace(/yyyy/g, date.getFullYear());
                format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
                format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
                format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
                format = format.replace(/M/g, (date.getMonth() + 1));
                format = format.replace(/d/g, (date.getDate()));
                format = format.replace(/H/g, (date.getHours()));
                format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
                format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
                format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
                return format;
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
            }
            /*
            linkToOtherWindow() {
                let resolvedRoute = this.$router.resolve({
                    name: profilePage,
                    params: {id: "someData"}
                });
                window.open(resolvedRoute.href, '_blank');
            }*/
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
    .about {
        min-width: 376px;
    }
    .nowrap {
        white-space: nowrap;
    }
    .btn____ {
        margin: 10px;
    }
    .btn__ {
        margin: 0 0 0 0px;
        white-space:nowrap;
    }
    .width120 {
        min-width: 140px;
    }
    .danger {
        color: red;
    }
    .warning {
        color: orange;
    }
    .active {
        background-color: #f3f6f9;
    }
    .margin {
        margin: 20px;
    }
    .left {
        text-align: left;
    }
</style>