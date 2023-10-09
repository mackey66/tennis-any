<template>
    <div class="court"><Menu class="sticky-top"></Menu>
        <div class="container-fluid">   
            <h4>{{ $t("Individual Amount") }} {{ date.year }}年{{ date.month }}</h4>
            <div class="row margin">
                <div class="col-sm-2"></div>
                <div class="col-sm-8" >
                    <month-picker 
                        @change="changeDate"
                        :no-default="true" 
                        lang="ja"
                        class="center"
                    />
                </div>
                <div class="col-sm-2"></div>
            </div>
            <div class="row">
                <div class="col-sm-2"></div>
                <div class="col-sm-4">
                    <div class="form-check-inline">
                        <input class="form-check-input" type="checkbox" value="" v-model="displayThursdayMeeting" @change="changedDisplayThursdayMeeting()">
                        <label class="form-check-label" for="flexCheckChecked">
                             {{ $t("Thursday meeting Only") }}
                        </label>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="form-check-inline">
                        <input class="form-check-input" type="checkbox" value="" v-model="edit" >
                        <label class="form-check-label" for="flexCheckChecked">
                            {{ $t("Edit") }}
                        </label>
                    </div>
                </div>
                <div class="col-sm-2"></div>
            </div>
            <div>
                <button v-if='ramens.length > 0 && !edit' class='btn btn-secondary btn_' data-toggle="modal" data-target="#selectDialog" @click="setRowId()">{{ $t("Download") }}</button>
            </div>
            <div class="margin"></div> 
            <div class="row">
                <div class="col-sm-0 col-md-0 col-lg-0 col-xl-0"></div>
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class='tips nowrap'>{{ $t("x:cancel, s:stop using") }}&ensp;&ensp;※{{ $t("Please enter the total OPAS usage in OPAS and the due date of the deadline warning in the remarks.") }}</div>
                    <div class="table-responsive">
                        <table class="table table-sm" ref="xlsxsheet" >
                            <thead >
                                <tr>
                                    <th class='col court10'>{{ resetLineNo() }}</th>
                                    <th class='col court130'>{{ $t("Name") }}</th>
                                    <th v-if='$store.state.isAdmin' class='col court40'></th>
                                    <th class='col court180'>{{ $t("Kana") }}</th>
                                    <th class='col court30'>x</th>
                                    <th class='col court30'>s</th>
                                    <th class='col court100'>{{ $t("Date") }}</th>
                                    <th class='col court60'>{{ $t("Time") }}</th>
                                    <th class='col court10'></th>
                                    <th class='col court60'></th>
                                    <th class='col court90'>{{ $t("Court") }}</th>        
                                    <th class='col court90'><div class="text-right">{{ $t("Amount") }}</div></th>
                                    <th class='col court100'><div class="text-right">{{ $t("Subtotal") }}</div></th>
                                    <th class='col court10'></th>
                                    <th class='col court100'><div class="small">{{ $t("OPAS") }}</div></th>
                                    <th class='col-auto nowrap'><div class="small">{{ $t("Remarks") }}</div></th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th></th> 
                                    <th v-if='$store.state.isAdmin'></th>
                                    <th></th> 
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th><div class="text-right">{{ sum }}</div></th>
                                    <th></th>
                                    <th><div class="text-right"></div></th>
                                    <th></th>
                                </tr>     
                            </tfoot>
                            <tbody class=" table-borderless">
                                <tr v-for="(ramen, key) in ramens" :key="key" 
                                    v-bind:style="key > 0 ? [ramen.memberUid != ramens[key-1].memberUid ? tr1 : tr2] : tr2" 
                                    :class="{ active: isActive(key) }"
                                    @click="activeNumber = key">
                                    <td >
                                        <div v-bind:class="key < ramens.length - 1 ? [ramen.memberUid != ramens[key+1].memberUid ? '' : 'none'] : ''" class="text-muted">{{ key + 1 }}</div>
                                        <!--<div v-if="key < (ramens.length - 1) && ramen.memberUid == ramens[key+1].memberUid" v-bind:class="key < ramens.length - 1 ? [ramen.memberUid != ramens[key+1].memberUid ? '' : 'none'] : ''" class="text-muted"></div>
                                        <div v-else v-bind:class="key < ramens.length - 1 ? [ramen.memberUid != ramens[key+1].memberUid ? '' : 'none'] : ''" class="text-muted">{{ getLineNo() }}</div>-->
                                    </td>
                                    <td class="nowrap">
                                        <div v-if='ramen.cancel' v-bind:class="key < ramens.length - 1 ? [ramen.memberUid != ramens[key+1].memberUid ? 'font-weight-bold' : ''] : 'font-weight-bold'">
                                            {{ ramens[key].memberName }}
                                        </div>
                                        <div v-else v-bind:class="key < ramens.length - 1 ? [ramen.memberUid != ramens[key+1].memberUid ? 'font-weight-bold' : ''] : 'font-weight-bold'"> 
                                            {{ ramens[key].memberName }}
                                        </div>
                                    </td>                   
                                    <td v-if='$store.state.isAdmin'>
                                        <button type='button' v-if='ramens[key].memberUid && $store.state.isAdmin' class='btn btn-success btn-sm' @click="loginOpas(ramens[key].memberUid)" v-bind:style="key < ramens.length - 1 ? [ramen.memberUid != ramens[key+1].memberUid ? '' : 'display: none'] : ''">
                                            <fa icon="sign-in-alt" />
                                        </button>
                                    </td>
                                    <td class="nowrap">
                                        <div v-if='ramen.cancel' style="text-decoration:line-through">
                                            {{ ramens[key].memberKana }}
                                        </div>
                                        <div v-else-if='ramen.stop' style="color:lightgray">
                                            {{ ramens[key].memberKana }}
                                        </div>
                                        <div v-else> 
                                            {{ ramens[key].memberKana }}
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if='ramen.cancel'>x</div>
                                    </td>
                                    <td>
                                        <div v-if='ramen.stop'>s</div>
                                    </td>                        
                                    <td class="nowrap">
                                        <div v-if='ramen.date.toDate().getDay() == 0' class='font-weight-bold text-danger' >
                                            {{ formatDate(ramen.date.toDate(), 'd (D)') }}
                                        </div>
                                        <div v-else-if='ramen.date.toDate().getDay() == 6' class='font-weight-bold text-primary' >
                                            {{ formatDate(ramen.date.toDate(), 'd (D)') }}
                                        </div>
                                        <div v-else-if='isHoliday(ramen.date.toDate())' class='font-weight-bold text-info' >
                                            {{ formatDate(ramen.date.toDate(), 'd (D)') }}
                                        </div>
                                        <div v-else class='font-weight-bold' >
                                            {{ formatDate(ramen.date.toDate(), 'd (D)') }}
                                        </div>   
                                    </td>
                                    <td>
                                        <div v-if='ramen.stop' style="text-decoration:line-through">
                                            {{ formatDate(ramen.date.toDate(), 'H:mm') }}
                                        </div>
                                        <div v-else>
                                            {{ formatDate(ramen.date.toDate(), 'H:mm') }}
                                        </div>
                                    </td>
                                    <td>-</td>
                                    <td>
                                        <div v-if='ramen.stop' style="text-decoration:line-through">
                                            {{ formatDate(ramen.end.toDate(), 'H:mm') }}
                                        </div>
                                        <div v-else>
                                            {{ formatDate(ramen.end.toDate(), 'H:mm') }}
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if='ramen.stop' style="text-decoration:line-through">
                                            {{ ramen.courtName }}
                                        </div>
                                        <div v-else>
                                            {{ ramen.courtName }}
                                        </div>
                                    </td>
                                    <td><div class="text-right">{{ ramens[key].amount }}</div></td>
                                    <td><div class="text-right font-weight-bold">{{ ramens[key].subtotal }}</div></td>
                                    <td>
                                        <div class="text-right" v-bind:class="key < ramens.length - 1 ? [ramen.memberUid != ramens[key+1].memberUid ? '' : 'none'] : ''">
                                            <div v-if="ramen.check && ramen.check.replace(/,/g, '') != ramens[key].subtotal" class="text-danger">
                                                !
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if='edit' class="text-right" v-bind:class="key < ramens.length - 1 ? [ramen.memberUid != ramens[key+1].memberUid ? '' : 'none'] : ''">
                                            <input type="text" class="form-control" aria-label="Check" 
                                                v-model="ramen.check"
                                                @change="updateCheck(ramen.id, ramen.check)">  
                                        </div>
                                        <div v-else>
                                            {{ ramen.check }}
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if='edit' v-bind:class="key < ramens.length - 1 ? [ramen.memberUid != ramens[key+1].memberUid ? '' : 'none'] : ''">
                                            <input type="text" class="form-control" aria-label="Remarks"
                                                v-model="ramen.individualRemarks"
                                                @change="updateIndividualRemarks(ramen.id, ramen.individualRemarks)">
                                        </div>
                                        <div v-else>
                                            {{ ramen.individualRemarks }}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>    
                        </table>
                    </div>
                </div>
                <div class="col-sm-0 col-md-0 col-lg-0 col-xl-0"></div>
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
                            <button type="button" class="btn btn-primary" data-dismiss="modal" @click='downloadTransferAmount()'>{{ $t("Transfer Amount") }}</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" @click='downloadIndivisualAmount()'>{{ $t("Individual Amount") }}</button>    
                        </div>
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
    import { ja, enUS, zhCN, zhTW, ru, de, fr, nl, es, pt, it, arSA, ko, sr, cs, ro, hr, sv, sk } from 'date-fns/locale'
    import { MonthPicker } from 'vue-month-picker'
    import crypto from 'crypto-js'
    import JapaneseHolidays from 'japanese-holidays'
    import * as XLSX from 'xlsx'
    //import NoComponent from '@/components/NoComponent.vue'

    const setDragCursor = value => {
    const html = document.getElementsByTagName('html').item(0)
        html.classList.toggle('grabbing', value)
    }

    //var memberRef = db.collection("users");
    export default {
        name: 'individual',
        display: "Simple",
        order: 2,
        components: {
            Menu,
            MonthPicker,
            //NoComponent
        },
        data() {
            return {
                ramens: [],
                members: [],
                today: new Date(this.$route.params.id),
                fromDate: new Date(),
                key: null,
                innerSearchText: new Date(),
                locale: ja,
                format: format,
                drag: false,
                enabled: [],
                dndOption: [],
                no: 0,
                controlOnStart: false,
                source: this.$store.state.getOption,
                date: {
                    from: null,
                    to: null,
                    month: (new Date(this.$route.params.id)).getMonth() + 1 + "月",
                    year: (new Date(this.$route.params.id)).getFullYear()
                },
                oldIndex: 0,
                edit: null,
                day: null,
                inTime: null,
                outTime: null,
                court: null,
                tr1: {
                    'border-top-style': 'solid',
                    'border-top-color': '#dddddd'
                },
                tr2: {
                    'border-top-style': 'none',
                },
                sum: 0,
                activeNumber: null,
                //no_: 1,
                lineNo: 0,
            }
        },
        computed: {
            /*
            lineNo: {
                get() {
                    return this.no_
                },
                set() {
                    this.no_++
                }
            }
            */
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
            });
            this.now = new Date();
            this.getCourtEntries();
            this.getMember();
            // 日付をセット
            this.innerSearchText = this.today;
            this.setLanguage();
            
        },
        methods: {
            getCourtEntries: function() {
                // コートエントリー取得
                var d = this.today;          
                var sd = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);             
                db.collection("courtEntries").where("config", "==", this.$store.state.config).orderBy("date").orderBy("courtNo").startAt(startDate).endAt(endDate)
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            const d = doc.data();
                            if (d.memberUid) {
                                d.id = doc.id
                                // カナの姓名間を全角に（銀行照合用）
                                d.memberKana = d.memberKana.replace(/ /g,"　")
                                d.memberKana = d.memberKana.replace(/ョ/g,"ヨ")
                                d.memberKana = d.memberKana.replace(/ュ/g,"ユ")
                                if (this.displayThursdayMeeting) {
                                    if (d.thursdayMeeting) {
                                        array.push(d)
                                    }
                                } else {
                                    //if (!d.thursdayMeeting) {
                                        array.push(d)
                                    //}
                                }
                            }                                          
                        });
                        // カナで並べ替え
                        let result = array.sort(function(a, b) {
                            return (a.memberKana < b.memberKana) ? -1 : 1;
                        });
                        this.ramens = result
                        this.sum = this.calculate()
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            // OPAS Loginに必要
            getMember: async function () {
                // メンバー取得              
                await db.collection("members").where("config", "==", this.$store.state.config).orderBy("userNo")
                .get(this.source)
                .then((querySnapshot) => {
                    const array = [];
                    querySnapshot.forEach((doc) => {
                        const d = doc.data();
                        d.id = doc.id;
                        d.name = doc.data().nameSei + " " + doc.data().nameNa;
                        d.order = doc.data().kanaSei;
                        d.kana = doc.data().kanaSei + " " + doc.data().kanaNa;
                        d.no = doc.data().userNo;
                        // ゲストと退会者はカット
                        if (!d.guest && !d.resigned) {
                            array.push(d);
                        }                                          
                    });
                    this.members = array
                    this.myArray = array
                    console.log("source", this.source)
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            },
            goMenu: function () {
                this.$router.push(`/main`);
            },
            goFinished: function () {
                this.$router.push({ name: 'gamefinished' });
            },
            selectDateCourt: function () {
                this.$router.push({ name: 'courtentriesselect', params: { id: this.date.from?this.date.from:this.today } });
            },
            goSelectMember: function (docid) {
                this.$router.push({ name: 'memberselect', params: { id: docid } })              
            },
            /*
            clearMember: function (docid, key) {
                this.list[key].splice(0, 1);
                this.ramens[key].memberName = "";
                this.ramens[key].memberKana = "";
                this.ramens[key].memberUid = "";
                // DB
                this.getAndClearMember(docid);    
            },
            */
            getAndClearMember: function (docid) {
                db.collection("courtEntries").doc(docid)
                    .get(this.soruce).then((doc) => {
                        if (doc.exists) {
                            db.collection("courtEntries").doc(docid).update({
                                memberUid: "",
                                memberName: "",
                                memberKana: ""
                            })
                            .then(() => {
                                console.log("Document successfully written!");                  
                                // Reload
                                //this.$router.go({path: this.$router.currentRoute.path, force: true})
                                //this.getCourtEntries();
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                            });
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
            },
            changeCourt: function(docid) {
                this.$router.push({ name: 'courtchange', params: { id: docid } })
            },
            changeDate: function(date) {
                
                this.date = date;
                this.today = date.from;
                //console.log(this.date);
                //this.$router.push({ name: 'courtentries', params: { id: this.today } });
                
                this.getCourtEntries();    
                //   
            },
            changedDisplayThursdayMeeting: function() {    
                this.getCourtEntries()
            },
            isHoliday: function(date) {
                const holiday = JapaneseHolidays.isHoliday(date)
                return holiday
            },
            toHankaku: function(str) {
                if (!str) return "";
                return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                });
            },          
            remove: function(evt) {
                console.log("removed!", evt);
            },
            /*         
            clearList: function() {
                let n = this.list.length;
                console.log("n =", n);
                for (let i = 0; i < n; i++) {
                    this.list.splice(i, 1);
                }               
            },
            */
            loginOpas: function (memberUid) {
                // メンバーのOPAS IDとパスワードを検索
                console.log(this.members[0].id)
                const result = this.members.filter(e => e.id === memberUid);
                if (result.length == 0) {
                    // データがなければReturn
                    return    
                }
                const id = result[0].opasId;
                const pass = result[0].opasPass;
                if (pass) {
                    // パスワードを復号
                    const decrypted = crypto.AES.decrypt(pass, 'pass');
                    const pass_ = decrypted.toString(crypto.enc.Utf8);
                    // OPASにログイン
                    let url = 'http://133.130.70.244/~ymaki/limited/opas?id=' + id + '&pass=' + pass_;
                    window.open(url, '_blank');
                }    
            },
            calculate: function() {
                // 金額の計算
                let sum = 0
                let subtotal = 0
                this.ramens.forEach((item, key) => {
                    let hours = Math.round((this.ramens[key].end.toDate() - this.ramens[key].date.toDate()) / 1000 / 60 / 60)
                    let rates = this.$store.state.weekdayRatesPerHour
                    if (this.isHoliday(this.ramens[key].date.toDate()) || this.ramens[key].date.toDate().getDay() == 0 || this.ramens[key].date.toDate().getDay() == 6) {
                        rates = this.$store.state.holidayRatesPerHour
                    }
                    if (this.ramens[key].cancel || this.ramens[key].stop || !this.ramens[key].memberUid) hours = 0
                    let amount = rates * hours
                    this.ramens[key].amount = amount
                    
                    if (key == 0) {
                        subtotal = amount
                    } else {
                        if (this.ramens[key].memberUid == this.ramens[key - 1].memberUid) {
                            subtotal = subtotal + amount
                            this.ramens[key - 1].subtotal = "" 
                        } else {
                            subtotal = amount                      
                        }                 
                    }
                    this.ramens[key].subtotal = subtotal
                    sum = sum + amount                     
                });
                return sum
            },
            setRowId: function() {
                //
            },
            downloadIndivisualAmount: function() {
                const data = this.$refs.xlsxsheet
                const wb = XLSX.utils.table_to_book(data);
                XLSX.writeFile(wb,this.$t("Individual Amount") + this.date.year + ('0' + this.date.month.replace(/[^0-9]/g, '')).slice(-2) + '_' + this.formatDate(new Date(), 'yyMMdd') + '.xlsx');
            },
            downloadTransferAmount: function() {
                const data = this.$refs.xlsxsheet;
                const sheet = XLSX.utils.table_to_sheet(data);
                const json = XLSX.utils.sheet_to_json(sheet);
                //console.log(json);
                
                /* filter for the Presidents */
                const amount = json.filter(row => row.小計 >= 0);

                /* sort by first presidential term */
                //amount.forEach(prez => prez.start = prez.terms.find(term => term.type === "prez").start);
                //amount.sort((l,r) => l.start.localeCompare(r.start));

                /* flatten objects */
                
                const rows = amount.map(row => ({
                    名前: row.名前,
                    カナ: row.カナ,
                    使用料: row.小計,
                    更新料: "",
                    dummy: "",
                    OPAS: row.OPAS,
                }));
                // 最後2行に計算式が入らないので空行を追加しておく
                let empty = {};
                rows.push(empty);
                rows.push(empty);

                /* generate worksheet and workbook */
                const worksheet = XLSX.utils.json_to_sheet(rows);
                //XLSX.utils.sheet_set_array_formula(worksheet, "E3", 'IF(D3<>"", C3+D3, C3)');
                rows.forEach((value, idx) => {
                    console.log(value);
                    XLSX.utils.sheet_set_array_formula(worksheet, "E" + idx, 'IF(D' + idx + '<>"", C' + idx + '+D' + idx + ', C' + idx + ')');
                });
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "振込リスト");

                /* fix headers */
                XLSX.utils.sheet_add_aoa(worksheet, [["振込金額"]], { origin: "E1" });

                /* calculate column width */
                //const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
                worksheet["!cols"] = [ { wch: 15 }, { wch: 20 } ];

                /* create an XLSX file and try to save to *.xlsx */
                XLSX.writeFile(workbook,this.$t("Transfer Amount") + this.date.year + ('0' + this.date.month.replace(/[^0-9]/g, '')).slice(-2) + '_' + this.formatDate(new Date(), 'yyMMdd') + '.xlsx');
            },
            onDragStart: function() {
                setDragCursor(true)
            },
            onDragEnd: function() {
                setDragCursor(false)
            },
            countUp: function() {
                this.no++
            },
            log: function(evt) {
                window.console.log(evt);
            },
            pullFunction: function() {
                return this.controlOnStart ? "clone" : true
            },
            updateCheck: function(id, value) {
                    db.collection("courtEntries").doc(id).update({
                        check: value
                    })
                    .then(() => {
                        console.log("Document successfully written!(Score)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            },
            updateIndividualRemarks: function(id, value) {
                    db.collection("courtEntries").doc(id).update({
                        individualRemarks: value
                    })
                    .then(() => {
                        console.log("Document successfully written!(Score)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            },
            isActive: function(number) {
                if (number == this.activeNumber) return true;
            },
            resetLineNo: function() {
                this.lineNo = 0
            },
            getLineNo: function() {
                this.lineNo++
                return this.lineNo
            },
            formatDate: function (date, format) {
                const week = ["日", "月", "火", "水", "木", "金", "土"];
                format = format.replace(/yyyy/g, date.getFullYear());
                format = format.replace(/yy/g, ('' + date.getFullYear()).slice(-2));
                format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
                format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
                format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
                format = format.replace(/M/g, (date.getMonth() + 1));
                format = format.replace(/d/g, (date.getDate()));
                format = format.replace(/H/g, (date.getHours()));
                format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
                format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
                format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
                format = format.replace(/D/g, (week[date.getDay()]));
                return format;
            },
            setLanguage: function() {
                const lg = navigator.language
                //console.log(lg)
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
    .court {
        min-width: 376px;
    }
    .court400 {
        width: 400px;
        white-space: nowrap;
    }
    .court350 {
        width: 360px;
        white-space: nowrap;
    }
    .court300 {
        width: 300px;
        white-space: nowrap;
    }
    .court250 {
        width: 250px;
        white-space: nowrap;
    }
    .court200 {
        width: 200px;
        white-space: nowrap;
    }
    .court180 {
        width: 180px;
        white-space: nowrap;
    }
    .court170 {
        width: 170px;
        white-space: nowrap;
    }
    .court150 {
        width: 150px;
        white-space: nowrap;
    }
    .court130 {
        width: 130px;
        white-space: nowrap;
    }
    .court120 {
        width: 120px;
        white-space: nowrap;
    }
    .court110 {
        width: 110px;
        white-space: nowrap;
    }
    .court100 {
        width: 100px;
        white-space: nowrap;
    }
    .court90 {
        width: 90px;
        white-space: nowrap;
    }
    .court80 {
        width: 66px;
        white-space: nowrap;
    }
    .court70 {
        width: 56px;
        white-space: nowrap;
    }
    .court60 {
        width: 60px;
        white-space: nowrap;
    }
    .court40 {
        width: 40px;
        white-space: nowrap;
    }
    .court30 {
        width: 30px;
        white-space: nowrap;
    }
    .court20 {
        width: 20px;
        white-space: nowrap;
    }
    .court10 {
        width: 10px;
    }
    .input {
        min-width: 260px;
    }
    h4 {
        margin-top: 20px;
    }
    .table {
        text-align: left;
    }
    .btn_ {
        margin: 10px;
    }
    .btn__ {
        margin: 0 10px 0 0;
    }
    .margin {
        margin: 20px;
    }
    .margin5 {
        margin: 5px;
    }
    p {display: inline-block; _display: inline;}
    .buttons {
        margin-top: 35px;
    }
    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }
    .not-draggable {
        cursor: no-drop;
    }
    .max-height-100{
        max-height : 200px;
        overflow: scroll;
    }
    .grabbing * {
        cursor: grabbing;
    }
    .draggable {
        cursor: grabbing;
    }
    .box {       
        white-space: nowrap;
    }
    .maxwidth150 {
        max-width: 150px;
    }
    .maxwidth400 {
        max-width: 490px;
    }
    .list-group {
        display: flex;
        flex-direction: row;
        /*flex-wrap: wrap;*/
    }
    .drag-item {
        display: inline-block;
        margin: 0 10px 10px 0;
        padding: 10px;
        border: 1px solid #c5c4c4;
        border-radius: 10px;
        background-color: #fafafa;
        /*font-size: 110%*/
    }
    .drag-item-guest {
        display: inline-block;
        margin: 0 10px 10px 0;
        padding: 10px;
        border: 1px solid #c5c4c4;
        border-radius: 10px;
        background-color: #cefad0;
        /*font-size: 110%*/
    }
    .drag-item-waiting {
        display: inline-block;
        margin: 0 10px 0 0;
        padding: 10px;
        border: 1px solid #c5c4c4;
        border-radius: 10px;
        background-color: #fafafa;
        /*font-size: 110%*/
    }
    .drag-item-waiting-guest {
        display: inline-block;
        margin: 0 10px 0 0;
        padding: 10px;
        border: 1px solid #c5c4c4;
        border-radius: 10px;
        background-color: #cefad0;
        /*font-size: 110%*/
    }
    .entry {
        flex-wrap: nowrap;
        max-width: 160px;
    }
    _table {
        counter-reset: rowCount;
    }
    _table > tbody > tr {
        counter-increment: rowCount;
    }
    _table > tbody > tr > td:first-child::before {
        content: counter(rowCount);
    }
    .tips {
        font-size: 80%;
        text-align: center;
        font-weight: normal;
    }
    .small {
        font-size: 80%;
        font-weight: normal;
    }
    .droparea {
        min-height: 30px;
        border-radius: 10px;
        background-color: #f2f2f3;
    }
    a {
        margin: 0 10px 0 10px;
    }
    .table-condensed > thead > tr > th,
    .table-condensed > tbody > tr > th,
    .table-condensed > tfoot > tr > th,
    .table-condensed > thead > tr > td,
    .table-condensed > tbody > tr > td,
    .table-condensed > tfoot > tr > td {
        padding: 12px 5px 12px 5px;
    }
    .center {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    .member {
        position: fixed;
        overflow-y: scroll;
        z-index: 99;
        top: 0;
        right: 0;
        width: 100;
        height:100%;
        padding: 5px;
        background: #f5f6f6;
    }
    .dashed-bottom{
        border-bottom: 1px dashed #333 !important;
    }
    /* ボーダーの太さ */
    .border-2{
        border-width:2px !important;
    }
    .border-3{
        border-width:3px !important;
    }
    .border-4{
        border-width:4px !important;
    }
    .border-5{
        border-width:5px !important;
    }
    /* アンダーライン */
    .u{
        text-decoration: underline;
    }
    /* アンダーライン */
    .b{
        font-weight: bold;
    }
    .center {
        display: block;
        margin-left: auto;
        margin-right: auto 
    }
    .hr1 {
        border-top: 2px solid #dddddd;
    }
    .active {
        background-color: #f3f6f9;
    }
    .none {
        display: none;
    }
    .nowrap {
        white-space: nowrap;
        min-width: 120px;
    }
    .red {
        color: red;
    }
    .left {
        text-align: left;
    }
</style>