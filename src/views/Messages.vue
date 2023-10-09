<template>
    <div class="court"><Menu class="sticky-top"></Menu>
        <div class="container-fluid">   
            <h4>{{ $t("Messages") }} {{ date.year }}年{{ date.month }}</h4>
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
                </div>
                <div v-if='$store.state.isAdmin' class="col-sm-4">          
                    <div class="form-check-inline">
                        <input class="form-check-input" type="checkbox" value="" v-model="edit" @change="changedEditCheck()">
                        <label class="form-check-label" for="flexCheckChecked">
                            {{ $t("Edit") }}
                        </label>
                    </div> 
                </div>
                <div class="col-sm-2"></div>
            </div>
            <!-- 作成ボタン等 -->
            <div v-if='$store.state.isAdmin && edit'>  
                <button class='btn btn-primary' data-toggle="modal" data-target="#addDialog">{{ $t("Add") }}</button>   
            </div>
            <div v-if='!edit && ramens.length > 0'>
                <button class='btn btn-secondary ml-3' data-toggle="modal" data-target="#downloadDialog">{{ $t("Download") }}</button>
            </div>          
            <div class="margin"></div>         
            <div class="row">
                <div class="col-sm-0 col-md-0 col-lg-0 col-xl-0"></div>
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="table-responsive">
                        <table class="table table-sm" ref="xlsxsheet" >
                            <thead >
                                <tr>
                                    <!--<th class='col court40'>#</th>-->
                                    <th class='nowrap'>{{ $t("Date") }}</th>
                                    <th v-if='edit' class='nowrap'></th>
                                    <th class='nowrap'>{{ $t("Court") }}</th>
                                    <th class='nowrap'>{{ $t("On duty") }}</th>        
                                    <th class='nowrap'>{{ $t("Message") }}</th>
                                    <th class='nowrap'></th>
                                    <th class='nowrap'>
                                        <div v-if='edit' class="hidden"></div>
                                        <div v-else>
                                            {{ $t("Weather") }}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(ramen, key) in ramens" :key="key" 
                                    :class="{ active: isActive(key) }"
                                    @click="activeNumber = key">
                                    <td class="nowrap width50">
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
                                    <th v-if='edit' class='nowrap width50'>
                                        <button type="button" class="btn btn-danger btn-sm" @click="deleteDay(ramen.id, ramen.date)" :disabled="indexNo==recordNum-1"><fa icon="trash" /></button>
                                    </th>
                                    <td class="nowrap width60">
                                        <div>
                                            {{ ramen.courts }}
                                        </div>
                                    </td>
                                    <td class="nowrap">
                                        <div v-if='edit'>
                                            <input type="text" class="form-control" 
                                                v-model="ramen.onduty"
                                                @change="updateOnduty(ramen.id, ramen.onduty)"
                                            >
                                        </div>
                                        <div v-else>
                                            {{ ramen.onduty }}
                                        </div>
                                    </td>
                                    <td class="nowrap">
                                        <div v-if='edit'>
                                            <input type="text" class="form-control" 
                                                v-model="ramen.message"
                                                @change="updateMessage(ramen.id, ramen.message)"
                                            >
                                        </div>
                                        <div v-else class="max360 text-overflow"
                                            data-bs-toggle="tooltip" data-bs-placement="left" 
                                            :title='ramens[key].message'
                                        >
                                            {{ ramens[key].message }}
                                        </div>
                                    </td>
                                    <td class="nowrap">
                                        <div v-if='edit' class="hidden"></div>
                                        <div v-else>
                                            <div v-if="ramens[key].weatherCode >= 0 && ramens[key].weatherCode < 2"><fa icon="sun" /></div>
                                            <div v-else-if="ramens[key].weatherCode == 2"><fa icon="cloud-sun" /></div>
                                            <div v-else-if="ramens[key].weatherCode == 3"><fa icon="cloud" /></div>
                                            <div v-else-if="ramens[key].weatherCode >= 40 && ramens[key].wearherCode < 50"><fa icon="smog" /></div>
                                            <div v-else-if="ramens[key].weatherCode >= 50 && ramens[key].weatherCode < 60"><fa icon="cloud-sun-rain" /></div>
                                            <div v-else-if="ramens[key].weatherCode >= 60 && ramens[key].weatherCode < 99"><fa icon="umbrella" /></div>
                                        </div>
                                    </td>
                                    <td class="nowrap">
                                        <div v-if='edit' class="hidden"></div>
                                        <div v-else>
                                            {{ ramens[key].weather }}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>    
                        </table>
                    </div>
                </div>
                <div class="col-sm-0 col-md-0 col-lg-0 col-xl-0"></div>
            </div>

        </div>
        <!-- 追加ダイアログ -->
        <div class="modal fade" id="addDialog" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="demoModalTitle">{{ $t("Add") }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-inline ">   
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <label class="input-group-text" for="inputGroupSelect01">{{ $t("Day") }}</label>
                                </div>
                                <select class="custom-select mr-sm-4" id="inlineFormCustomSelect"
                                    v-model="day"
                                >
                                    <option selected>...</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                    <option value="31">31</option>
                                </select>    
                            </div>    
                        </div>
                        <textarea class="form-control mt-3" id="exampleFormControlTextarea1" rows="2" v-model="onDuty" :placeholder='$t("On duty")'></textarea>
                        <textarea class="form-control mt-3" id="exampleFormControlTextarea1" rows="3" v-model="dailyMessageText" :placeholder='$t("Message")'></textarea>
                    </div>
                    <div class="modal-footer">                           
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click='addDay(day)' :disabled="!day">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- ダウンロードダイアログ -->
        <div class="modal fade" id="downloadDialog" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
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
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click='downloadTypeA()'>{{ $t("OK") }}</button>    
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
    import JapaneseHolidays from 'japanese-holidays'
    //import * as XLSX from 'xlsx'
    import XLSX from "xlsx-js-style"

    //var memberRef = db.collection("users");
    export default {
        name: 'courtentries',
        display: "Simple",
        order: 2,
        components: {
            Menu,
            MonthPicker,
        },
        data() {
            return {
                ramens: [],
                members: [],
                courts: [],
                today: new Date(this.$route.params.id),
                nextMonth: null,
                fromDate: new Date(),
                rowId: null,
                key: null,
                innerSearchText: new Date(),
                locale: ja,
                format: format,
                drag: false,
                myArray: [],
                list: [],
                enabled: [],
                dndOption: [],
                no: 0,
                dragTargetLength: 0,
                controlOnStart: false,
                source: this.$store.state.getOption,
                date: {
                    from: null,
                    to: null,
                    month: (new Date(this.$route.params.id)).getMonth() + 1 + "月",
                    year: (new Date(this.$route.params.id)).getFullYear()
                },
                oldIndex: 0,
                dragstart: null,
                display: null,
                edit: null,
                day: null,
                onDuty: "",
                dailyMessageText: "",
                tr1: {
                    'border-top-style': 'solid',
                    'border-top-color': '#dddddd'
                },
                tr2: {
                    'border-top-style': 'none',
                },
                sum: 0,
                sumL: 0,
                activeNumber: null,
                entryNum: 0,
                sortByMemberNo: null,
                sortByMemberKana: true,
                
            }
        },
        computed: {
            picked: {
                get () {
                    return this.innerSearchText
                },
                set (value) {                    
                    this.innerSearchText = value
                    this.changeDate()                
                }
            },
            waitingNo: {
                get () {
                    this.countUp()
                    return this.no
                },
                set (value) {                 
                    this.no = value               
                }
            }
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
            });
            this.now = new Date();
            this.getMessages();
            // 日付をセット
            this.innerSearchText = this.today;
            this.setLanguage();
            let d = new Date();
            this.nextMonth = new Date(d.getFullYear(), d.getMonth() + 2, 0, 0, 0, 0);  
        },
        methods: {
            getMessages: function() {
                // メッセージ取得
                var d = this.today;
                var sd = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                this.list = []
                
                db.collection("messages").where("config", "==", this.$store.state.config).where("class", "==", "daily").orderBy("date").startAt(startDate).endAt(endDate)
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            const d = doc.data();
                            d.id = doc.id;    
                            array.push(d)
                        });
                        this.ramens = array
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
            changeDate: function(date) {
                this.date = date;
                this.today = date.from;
                //console.log(this.date);
                //this.$router.push({ name: 'courtentries', params: { id: this.today } });
                this.getMessages();
                //
                
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
            updateMessage: function(id, value) {
                    db.collection("messages").doc(id).update({
                        message: value
                    })
                    .then(() => {
                        console.log("Document successfully written!(Score)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            },
            updateOnduty: function(id, value) {
                    db.collection("messages").doc(id).update({
                        onduty: value
                    })
                    .then(() => {
                        console.log("Document successfully written!(Score)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            },
            addDay: function(day) {
                const date = new Date(this.date.year + "-" +  ('0' + this.date.month.replace(/[^0-9]/g, '')).slice(-2) + "-" + ('0' + day).slice(-2))  
                let check = this.ramens.find((v) => this.formatDate(v.date.toDate(), 'd(D)') == this.formatDate(date, 'd(D)'))
                if (check) {
                    window.alert(this.$t("Already exists"))
                } else {
                    db.collection("messages").doc().set({
                        date: firebase.firestore.Timestamp.fromDate(date),
                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                        config: this.$store.state.config,
                        message: this.dailyMessageText,
                        onduty: this.onDuty,
                        class: "daily",
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                        this.getMessages()
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }    
            },
            deleteDay: function(id, date) {
                console.log(id, this.formatDate(date.toDate(), 'd(D)'))
                let result = window.confirm(this.$t('Delete >') + this.formatDate(date.toDate(), 'd(D)') + this.$t('.') + this.$t('Is it OK?'));
                if( result ) {
                    db.collection("messages").doc(id).delete().then(() => {
                        console.log("Document successfully deleted!");
                        // Reload
                        this.getMessages()
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                }
            },
            setRowIdDownload: function() {
                //
            },
            setRowIdAdd: function() {
                //
            },
            changedEditCheck: function() {    
                this.getMessages()
            },
            downloadTypeA: async function() {
                const data = this.$refs.xlsxsheet

                const sheet = XLSX.utils.table_to_sheet(data);
                const json = XLSX.utils.sheet_to_json(sheet);
                const rows = json.map(row => ({
                    日付: row.日付,
                    コート: row.コート,
                    当番: row.当番,
                    メッセージ: row.メッセージ,
                    天気: row.天気
                }));
                /* generate worksheet and workbook */
                const worksheet = XLSX.utils.json_to_sheet(rows);
                // タイトル
                worksheet["A1"] = {
                    v: this.date.year + "年" + this.date.month
                };
                // 行削除
                /*
                const ec = (r, c) => {
                    return XLSX.utils.encode_cell({r:r,c:c})
                }
                const delete_row = (ws, row_index) => {
                    let range = XLSX.utils.decode_range(ws["!ref"])
                    for(var R = row_index; R < range.e.r; ++R){
                        for(var C = range.s.c; C <= range.e.c; ++C){
                            ws[ec(R, C)] = ws[ec(R+1, C)]
                        }
                    }
                    range.e.r--
                    ws['!ref'] = XLSX.utils.encode_range(range.s, range.e)
                }
                delete_row(worksheet, 1) 
                */              
                //
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "コート");
                worksheet["!cols"] = [ { wch: 11 }, { wch: 6 }, { wch: 12 }, { wch: 46 }, { wch: 128 }];
                // Style
                
                for (const sheet of Object.values(workbook.Sheets)) {
                    for (const rangeName in sheet) {
                        // 設定情報は操作しない
                        if (rangeName.indexOf("!") === 0) {
                            continue;
                        }

                        // スタイルを定義
                        const s = sheet[rangeName]?.s || {};
                        s.alignment = { vertical: "top", horizontal: "left" };
                        s.font = { name: "Yu Gothic medium", sz: 12, color: { rgb: "223344" } };
                        /*
                        s.border = {
                            top: { style: "thin", color: {theme: 4} },
                            bottom: { style: "thin", color: {theme: 4} },
                            left: { style: "thin", color: {theme: 4} },
                            right: { style: "thin", color: {theme: 4} }
                        };
                        */

                        // スタイルを反映
                        sheet[rangeName] = {
                            ...sheet[rangeName],
                            s,
                        };
                    }
                }
                

                //const wb = XLSX.utils.table_to_book(data);
                //XLSX.writeFile(wb, this.$t("Court") + this.date.year + ('0' + this.date.month.replace(/[^0-9]/g, '')).slice(-2) + '_' + this.formatDate(new Date(), 'yyMMdd') + '.xlsx');
                XLSX.writeFile(workbook, this.$t("Message") + this.date.year + ('0' + this.date.month.replace(/[^0-9]/g, '')).slice(-2) + '_' + this.formatDate(new Date(), 'yyMMdd') + '.xlsx');
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
            isActive: function(number) {
                if (number == this.activeNumber) return true;
            },
            clamp_range: function(range) {
                if(range.e.r >= (1<<20)) range.e.r = (1<<20)-1;
                if(range.e.c >= (1<<14)) range.e.c = (1<<14)-1;
                return range;
            },
            delete_cols: function(ws, start_col, ncols) {
                /*
                deletes `ncols` cols STARTING WITH `start_col`
                usage: delete_cols(ws, 4, 3); // deletes columns E-G and shifts everything after G to the left by 3 columns
                */
                if(!ws) throw new Error("operation expects a worksheet");
                //var dense = Array.isArray(ws);
                if(!ncols) ncols = 1;
                if(!start_col) start_col = 0;

                /* extract original range */
                var range = XLSX.utils.decode_range(ws["!ref"]);
                var R = 0, C = 0;

                var formula_cb = function($0, $1, $2, $3, $4, $5) {
                    var _R = XLSX.utils.decode_row($5), _C = XLSX.utils.decode_col($3);
                    if(_C >= start_col) {
                        _C -= ncols;
                        if(_C < start_col) return "#REF!";
                    }
                    return $1+($2=="$" ? $2+$3 : XLSX.utils.encode_col(_C))+($4=="$" ? $4+$5 : XLSX.utils.encode_row(_R));
                };

                var addr, naddr;
                for(C = start_col + ncols; C <= range.e.c; ++C) {
                    for(R = range.s.r; R <= range.e.r; ++R) {
                        addr = XLSX.utils.encode_cell({r:R, c:C});
                        naddr = XLSX.utils.encode_cell({r:R, c:C - ncols});
                        if(!ws[addr]) { delete ws[naddr]; continue; }
                        if(ws[addr].f) ws[addr].f = ws[addr].f.replace(this.crefregex, formula_cb);
                        ws[naddr] = ws[addr];
                    }
                }
                for(C = range.e.c; C > range.e.c - ncols; --C) {
                    for(R = range.s.r; R <= range.e.r; ++R) {
                        addr = XLSX.utils.encode_cell({r:R, c:C});
                        delete ws[addr];
                    }
                }
                for(C = 0; C < start_col; ++C) {
                    for(R = range.s.r; R <= range.e.r; ++R) {
                        addr = XLSX.utils.encode_cell({r:R, c:C});
                        if(ws[addr] && ws[addr].f) ws[addr].f = ws[addr].f.replace(this.crefregex, formula_cb);
                    }
                }

                /* write new range */
                range.e.c -= ncols;
                if(range.e.c < range.s.c) range.e.c = range.s.c;
                ws["!ref"] = XLSX.utils.encode_range(this.clamp_range(range));

                /* merge cells */
                if(ws["!merges"]) ws["!merges"].forEach(function(merge, idx) {
                    var mergerange;
                    switch(typeof merge) {
                        case 'string': mergerange = XLSX.utils.decode_range(merge); break;
                        case 'object': mergerange = merge; break;
                        default: throw new Error("Unexpected merge ref " + merge);
                    }
                    if(mergerange.s.c >= start_col) {
                        mergerange.s.c = Math.max(mergerange.s.c - ncols, start_col);
                        if(mergerange.e.c < start_col + ncols) { delete ws["!merges"][idx]; return; }
                        mergerange.e.c -= ncols;
                        if(mergerange.e.c < mergerange.s.c) { delete ws["!merges"][idx]; return; }
                    } else if(mergerange.e.c >= start_col) mergerange.e.c = Math.max(mergerange.e.c - ncols, start_col);
                    this.clamp_range(mergerange);
                    ws["!merges"][idx] = mergerange;
                });
                if(ws["!merges"]) ws["!merges"] = ws["!merges"].filter(function(x) { return !!x; });

                /* cols */
                if(ws["!cols"]) ws["!cols"].splice(start_col, ncols);
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
                        this.locale = enUS;
                        this.$i18n.locale = "en"
                }               
            }       
        }
    }
</script>

<style scoped>
    .court {
        min-width: 376px;
    }
    .nowrap {
        white-space: nowrap;
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
    .court190 {
        width: 190px;
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
    .court10 {
        width: 10px;
        white-space: nowrap;
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
    .margin50 {
        margin: 50px;
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
    .width50 {
        width: 50px;
    }
    .width60 {
        width: 60px;
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
        text-align: right;
        font-weight: normal;
    }
    .tipscenter {
        font-size: 80%;
        text-align: center;
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
        bottom: 0;
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
    .left {
        text-align: left;
    }
    .hidden {
        visibility: hidden;
    }
    .max360 {
        max-width: 360px;
    }
    .text-overflow {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>