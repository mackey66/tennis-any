<template>
    <div class="about"><Menu class="sticky-top"></Menu>          
        <h4>{{ $t("Member") }}</h4>
        <button v-if='$store.state.isAdmin' class='btn btn-primary btn_' @click="addMember()">{{ $t("Add") }}</button>
        <div class="row">
            <div class="col-md-1 col-lg-2"></div>
            <div class="col-md-10 col-lg-8 sortable-table">
                <table class="table" id="my-table1">
                    <thead>
                        <tr>
                            <th scope="col" class="width80" data-id="userNo" sortable>No</th>
                            <th scope="col" class="width120" data-id="kanaSei" sortable>{{ $t("Sort") }}</th>
                            <th scope="col" class="width100" data-id="displayName">{{ $t("Display name") }}</th>
                            <th scope="col" class="min-width140" data-id="name">{{ $t("Name") }}</th>
                            <th scope="col" class="min-width120" data-id="option"></th>
                            <th scope="col" class="min-width140" data-id="id"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ramen, key) in ramens" :key="key">
                            <th>{{ ramen.userNo }}</th>
                            <td>{{ ramen.kanaSei }}</td>
                            <td>{{ ramen.displayName }}</td>
                            <td>{{ ramen.name }}</td>
                            <td>
                                <div v-if='ramen.admin' class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.admin" disabled>
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {{ $t("Manager") }}
                                    </label>
                                </div>
                                <div v-if='ramen.cooperativeMember' class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.cooperativeMember" disabled>
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {{ $t("Cooperative member") }}
                                    </label>
                                </div>
                                <div v-if='ramen.entry' class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.entry" disabled>
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {{ $t("entry") }}
                                    </label>
                                </div>
                                <div v-if='ramen.game' class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.game" disabled>
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {{ $t("Game") }}
                                    </label>
                                </div>
                                <div v-if='ramen.reserved' class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.reserved" disabled>
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {{ $t("Reserved") }}
                                    </label>
                                </div>
                            </td>
                            <td>
                                <button v-if='$store.state.isAdmin || ramen.userUid == loginUser.uid' class='btn btn-primary btn-sm' @click='editMember(ramen.id)'>
                                    {{ $t("Edit") }}
                                </button>
                                <button v-if='$store.state.isAdmin' class='btn btn-danger btn-sm btn__' @click='deleteMember(ramen.id)'>
                                    {{ $t("Delete") }}
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
    import Menu from '@/components/Menu.vue'
    //import SortableTable from '@riversun/sortable-table'

    //var memberRef = db.collection("users");
    /*import Vue from 'vue'
    Vue.component('main-table', {
        template: "<ul>" +
            "<li v-for='(set, index) in settings'>" +
            "{{index}}) " +
            "{{set.title}}" +
            "<button @click='changeSetting(index)'> Info </button>" +
            "</li>" +
            "</ul>",
        props: ['settings'],
        methods: {
            changeSetting(value) {
            this.$emit('change', value);
            },
        },
    });*/

    

    export default {
        name: 'member',
        components: {
            Menu
        },
        data() {
            return {
                ramens: [],
                query: this.$route.query,
                source: this.$store.state.getOption,
                //sortableTable: null
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
                        this.admin = true
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                */
            });
            this.setLanguage()
            /*
            // table要素を指定する #SortableTable
            this.sortableTable = new SortableTable()
            this.sortableTable.setTable(document.querySelector('#my-table1'));
            /// テーブルに表示したいデータを指定する #SortableTable
            //this.sortableTable.setData(this.ramens);
            this.sortableTable.events()
                .on('sort', (event) => {
                console.log(`[SortableTable#onSort]
                event.colId=${event.colId}
                event.sortDir=${event.sortDir}
                event.data=\n${JSON.stringify(event.data)}`);
                });
            // set callback function for table cell custom rendering
            this.sortableTable.setCellRenderer((col, row) => {
                const colValue = row[col.id];
                // cell-is-a-header
                if (col.isHeader) {
                    if (typeof colValue !== 'undefined') {
                        return `<th>${colValue}</th>`;
                    }
                    return '<th></th>';
                }
                // cell-is-not-a-header
                if (typeof colValue !== 'undefined') {
                    if (col.id === 'url') {
                        return `<td><a href="${colValue}" target="_blank">${colValue}</a></td>`;
                    } else if (col.id === 'id') {
                        return  '<td>' +
                                `<button class="btn btn-primary btn-sm" @click="editMember(${colValue})">編集</button>` +  
                                `<button class="btn btn-danger btn-sm btn__" onclick="deleteMember(${colValue})">削除</button>` +
                                '</td>';
                    }
                    return `<td>${colValue}</td>`;
                    }
                return '<td></td>';   
            });
            */
            // ユーザー取得
            this.getMember()
        },
        methods: {
            getMember: async function() {   
                console.log(this.query)                          
                // ユーザー取得
                if (!(this.query.name || this.query.active)) {
                    // クエリにnameかactiveがない場合は全員Get               
                    db.collection("members").where("config", "==", this.$store.state.config).orderBy("userNo")
                    .get(this.source)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            d.name = doc.data().nameSei + " " + doc.data().nameNa
                            if (!d.guest) {
                                array.push(d);
                            }                                          
                        });
                        // カナでソート
                        array.sort(function(a,b){
                            if (a.kanaSei < b.kanaSei) return -1;
                            if (a.kanaSei > b.kanaSei) return 1;
                            return 0;
                        });
                        this.ramens = array
                        //this.sortableTable.setData(array);
                        //this.sortableTable.sort('kanaSei', 'asc');
                        console.log("source", this.source)
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
                } else {
                    console.log("query = ", this.query)
                    if (this.query.name) {
                        // 名前で絞り込む
                        db.collection("members").where("config", "==", this.$store.state.config).where("kanaSei", "==", this.query.name)
                            .get(this.source)
                            .then((querySnapshot) => {
                                const array = [];
                                querySnapshot.forEach((doc) => {
                                    const d = doc.data();
                                    d.id = doc.id;
                                    d.name = doc.data().nameSei + " " + doc.data().nameNa
                                    if (!d.guest) {
                                        array.push(d);
                                    }                                          
                                });
                                this.ramens = array
                                console.log("source", this.source)
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                            });
                    } else if (this.query.active) {
                        // 協力会員を除く
                        //console.log("協力会員を除く", this.$store.state.config)
                        db.collection("members").where("config", "==", this.$store.state.config).orderBy("kanaSei")
                            .get(this.source)
                            .then((querySnapshot) => {
                                const array = [];
                                querySnapshot.forEach((doc) => {
                                    const d = doc.data();
                                    d.id = doc.id;
                                    d.name = doc.data().nameSei + " " + doc.data().nameNa
                                    if (!(d.guest || d.cooperativeMember)) {
                                        array.push(d);
                                    }                                          
                                });
                                this.ramens = array
                                console.log("source", this.source)
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                        });
                    }
                }
                              
            },
            editMember: function(docid) {
                console.log(docid)
                this.$router.push({ name: 'memberedit', params: { id: docid } })
            },
            addMember: async function() {
                this.$router.push({ name: 'memberedit', params: { id: "new" } })
            },
            deleteMember: function(docid) {
                let result = window.confirm('削除します。よろしいですか？');
                if( result ) {
                    db.collection("members").doc(docid).delete().then(() => {
                        console.log("Document successfully deleted!");
                        // Reload
                        //this.$router.go({path: this.$router.currentRoute.path, force: true})
                        this.getMember();
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                }
                else {
                    return
                }              
            },
            setLanguage: function() {
                const lg = navigator.language
                //this.$i18n.locale = navigator.language
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
    .table {
        text-align: left;
    }
    .about {
        min-width: 690px;
    }
    .btn_ {
        margin: 10px;
    }
    .btn__ {
        margin: 0 0 0 10px;
    }
    .width80 {
        width: 80px;
    }
    .width100 {
        width: 100px;
    }
    .width120 {
        width: 120px;
    }
    .min-width120 {
        min-width: 120px;
    }
    .width140 {
        width: 140px;
    }
    .min-width140 {
        min-width: 140px;
    }
</style>