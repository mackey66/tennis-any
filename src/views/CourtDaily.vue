<template>
    <div class="court"><Menu class="sticky-top"></Menu>
        <div class="container-fluid">   
            <h4>{{ $t("Today's Court") }} {{ format(today, 'MMM do (E)', {locale: locale}) }}</h4>
            <div class="margin5"></div>
            <div>{{ courtConditions }}</div>
            <div class="margin5"></div>
            <div class="row">
                <div class="col-sm-2"></div>
                <div class="col-sm-8">
                    <datepicker 
                        v-model="picked"
                        position="center"
                        :locale="locale"
                        :weekStartsOn=0
                    />
                </div>
                <div class="col-sm-2"></div>
            </div>
            <div class="margin5"></div>
            <div>
                <!--<button class='btn btn-primary btn_' @click="back()">{{ $t("Back") }}</button>-->
                <button v-if="ramens.length > 0" class='btn btn-secondary btn_' data-toggle="modal" data-target="#selectDialog" @click="setRowId1()">{{ $t("Download") }}</button>
            </div>
            <div class="margin5"></div>
            <div v-if="courtNum > 0">
                <div class="message">
                    <div class="row">
                        <div class="col-sm-1 col-lg-2"></div>
                        <div class="col-sm-10 col-lg-8">
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <th class="width120">{{ $t("Message") }}</th>
                                        <td ><p v-html="htmlText(dailyMessageText)"></p></td>
                                        <td class="width70">
                                            <button class='btn btn-primary btn-sm nowrap' data-toggle="modal" data-target="#demoNormalModal3" @click="setRowId3(dailyMessage)">
                                                {{ $t("Edit") }}
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="width120">{{ $t("On duty") }}</th>
                                        <td >{{ onDuty }}</td>
                                        <td class="width70">
                                            <button class='btn btn-primary btn-sm nowrap' data-toggle="modal" data-target="#demoNormalModal4" @click="setRowId4(onDuty)">
                                                {{ $t("Edit") }}
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="width120">
                                            <div v-if="weatherCode >= 0 && weatherCode < 2"><fa icon="sun" />&ensp;{{ $t("Weather") }}</div>
                                            <div v-else-if="weatherCode == 2"><fa icon="cloud-sun" />&ensp;{{ $t("Weather") }}</div>
                                            <div v-else-if="weatherCode == 3"><fa icon="cloud" />&ensp;{{ $t("Weather") }}</div>
                                            <div v-else-if="weatherCode >= 40 && weatherCode < 50"><fa icon="smog" />&ensp;{{ $t("Weather") }}</div>
                                            <div v-else-if="weatherCode >= 50 && weatherCode < 60"><fa icon="cloud-sun-rain" />&ensp;{{ $t("Weather") }}</div>
                                            <div v-else-if="weatherCode >= 60 && weatherCode < 99"><fa icon="umbrella" />&ensp;{{ $t("Weather") }}</div>
                                            <div v-else>{{ $t("Weather") }}</div>    
                                        </th>
                                        <td>{{ weather }}</td>
                                        <td class="width70">
                                            <button class='btn btn-primary btn-sm nowrap' data-toggle="modal" data-target="#demoNormalModal2" @click="setRowId2(weather)">
                                                {{ $t("Edit") }}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="margin"></div>
                <div class="row">
                    <div class="col-sm-1 col-lg-2"></div>
                    <div class="col-sm-10 col-lg-8">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th class="width120">
                                        <div v-if="weatherCode >= 0 && weatherCode < 2"><fa icon="sun" />&ensp;{{ $t("Weather") }}</div>
                                        <div v-else-if="weatherCode == 2"><fa icon="cloud-sun" />&ensp;{{ $t("Weather") }}</div>
                                        <div v-else-if="weatherCode == 3"><fa icon="cloud" />&ensp;{{ $t("Weather") }}</div>
                                        <div v-else-if="weatherCode >= 40 && weatherCode < 50"><fa icon="smog" />&ensp;{{ $t("Weather") }}</div>
                                        <div v-else-if="weatherCode >= 50 && weatherCode < 60"><fa icon="cloud-sun-rain" />&ensp;{{ $t("Weather") }}</div>
                                        <div v-else-if="weatherCode >= 60 && weatherCode < 99"><fa icon="umbrella" />&ensp;{{ $t("Weather") }}</div>
                                        <div v-else>{{ $t("Weather") }}</div>    
                                    </th>
                                    <td>{{ weather }}</td>
                                    <td class="width70">
                                        <button class='btn btn-primary btn-sm nowrap' data-toggle="modal" data-target="#demoNormalModal2" @click="setRowId2(weather)">
                                            {{ $t("Edit") }}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div v-if="courtNum > 0">             
                <div class="row">
                    <div class="col-sm-0 col-md-1 col-lg-2 col-xl-2"></div>
                    <div class="col-sm-12 col-md-10 col-lg-8 col-xl-8">
                        
                        <div class="form-check-inline tipscenter">
                            {{ $t("x:cancel, s:stop using") }}
                            <input class="form-check-input ml-3" type="checkbox" value="" v-model="edit" @change="changedEditCheck()">
                            <label class="form-check-label" for="flexCheckChecked">
                                {{ $t("Edit") }}
                            </label>
                        </div> 
                        <div class="table-responsive">
                            <table class="table table-sm" ref="xlsxsheet">
                                <thead >
                                    <tr>                                   
                                        <!--<th class='col court80'>{{ $t("Date") }}</th>-->
                                        <th class='col court60'>{{ $t("Time") }}</th>
                                        <th class='col court10'></th>
                                        <th class='col court60'>To</th>
                                        <th class='col court90'>{{ $t("Court") }}</th>
                                        <!--<th class='col court130'>{{ $t("Name") }}</th>-->
                                        <th class='col court190'>{{ $t("Kana") }}</th>
                                        <th v-if='$store.state.isAdmin && $store.state.opas' class='col court40'></th>
                                        <th class='col court30'>x</th>
                                        <th class='col court30'>s</th>
                                        <th class='col-auto min-width100 small'>
                                            {{ $t("Remarks") }}
                                        </th> 
                                        <th class='col court40'></th>
                                        <th class='col court45 small'>{{ $t("Temperature") }}</th>
                                        <th class='col court45 small'>{{ $t("Humidity") }}</th>
                                        <th class='col court45 small'>{{ $t("UV Index") }}</th>
                                        <th class='col court45 small'>{{ $t("Cloudcover") }}</th>
                                        <th class='col court45 small'>{{ $t("Rain") }}</th>
                                        <th class='col court45 small'>{{ $t("Wind Speed") }}</th>
                                        
                                        <!--<th class='col court100'><div class="text-right">{{ $t("Amount") }}</div></th>-->
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>                            
                                        <!--<th></th>-->
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <!--<th></th>-->
                                        <th></th>
                                        <th v-if='$store.state.isAdmin && $store.state.opas'></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <!--<th><div class="text-right">{{ sum }}</div></th>-->
                                    </tr>     
                                </tfoot>
                                <tbody class=" table-borderless">
                                    <tr v-for="(ramen, key) in ramens" :key="key" v-bind:style="key > 0 ? [ramen.date > ramens[key-1].date ? tr1 : tr2] : tr2">
                                        <td>
                                            <div v-if='ramen.stop' style="text-decoration:line-through">{{ formatDate(ramen.date.toDate(), 'H:mm') }}</div>
                                            <div v-else>{{ formatDate(ramen.date.toDate(), 'H:mm') }}</div>
                                        </td>
                                        <td>-</td>
                                        <td>
                                            <div v-if='ramen.stop' style="text-decoration:line-through">{{ formatDate(ramen.end.toDate(), 'H:mm') }}</div>
                                            <div v-else>{{ formatDate(ramen.end.toDate(), 'H:mm') }}</div>
                                        </td>
                                        <td>
                                            <div v-if='ramen.stop' style="text-decoration:line-through">{{ ramen.courtName }}</div>
                                            <div v-else>{{ ramen.courtName }}</div>
                                        </td>
                                        <!--<td>
                                            <div v-if='ramen.cancel' style="text-decoration:line-through">{{ ramens[key].memberName }}</div>
                                            <div v-else >{{ ramens[key].memberName }}</div>
                                        </td>-->
                                        <td>
                                            <div v-if='ramen.cancel' class="nowrap" style="text-decoration:line-through">{{ ramens[key].memberKana }}</div>
                                            <div v-else-if='ramen.stop' class="nowrap" style="color:lightgray">{{ ramens[key].memberKana }}</div>
                                            <div v-else class="nowrap">{{ ramens[key].memberKana }}</div>
                                        </td>
                                        <td v-if='$store.state.isAdmin && $store.state.opas'>
                                            <button v-if='ramens[key].memberUid && $store.state.isAdmin' class='btn btn-success btn-sm' @click="loginOpas(ramens[key].memberUid)">
                                                <fa icon="sign-in-alt" />
                                            </button>
                                        </td>
                                        <td>
                                            <div v-if='edit && lowerThanDate(today0, today, 3)' class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.cancel" @change="updateCancel(ramen.id, ramen.cancel)">
                                                <label class="form-check-label" for="flexCheckChecked">
                                                </label>
                                            </div>
                                            <div v-else>
                                                <div v-if='ramen.cancel'>x</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div v-if='edit && lowerThanDate(today0, today, -7)' class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.stop" @change="updateStop(ramen.id, ramen.stop)">
                                                <label class="form-check-label" for="flexCheckChecked">
                                                </label>
                                            </div>
                                            <div v-else>
                                                <div v-if='ramen.stop'>s</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div v-if='edit'>
                                                <input type="text" class="form-control" aria-label="Remarks"
                                                    v-model="ramen.remarks"
                                                    @change="updateRemarks(ramen.id, ramen.remarks)"
                                                >
                                            </div>
                                            <div v-else class="nowrap">{{ ramens[key].remarks }}</div>
                                        </td>
                                        <td>
                                            <div v-bind:class="key > 0 ? [ramen.date > ramens[key-1].date ? '' : 'none'] : ''">
                                                <div v-if="ramens[key].weatherCode >= 0 && ramens[key].weatherCode < 2"><fa icon="sun" /></div>
                                                <div v-else-if="ramens[key].weatherCode == 2"><fa icon="cloud-sun" /></div>
                                                <div v-else-if="ramens[key].weatherCode == 3"><fa icon="cloud" /></div>
                                                <div v-else-if="ramens[key].weatherCode >= 40 && ramens[key].wearherCode < 50"><fa icon="smog" /></div>
                                                <div v-else-if="ramens[key].weatherCode >= 50 && ramens[key].weatherCode < 60"><fa icon="cloud-sun-rain" /></div>
                                                <div v-else-if="ramens[key].weatherCode >= 60 && ramens[key].weatherCode < 99"><fa icon="umbrella" /></div>
                                            </div>
                                        </td>
                                        <td>
                                            <div v-bind:class="key > 0 ? [ramen.date > ramens[key-1].date ? '' : 'none'] : ''"
                                                data-bs-toggle="tooltip" data-bs-placement="left" 
                                                :title='$t("Temperature") + ramens[key].temperature + ", " + 
                                                    $t("Humidity") + ramens[key].humidity + ", " + 
                                                    $t("UV Index") + ramens[key].uvindex + ", " + 
                                                    $t("Cloudcover") + ramens[key].cloudcover + ", " + 
                                                    $t("Rain") + ramens[key].rain + ", " + 
                                                    $t("Wind Speed") + (ramens[key].windspeed ? Math.round((ramens[key].windspeed / 3.6) * 10) / 10 : "")
                                                    '
                                            >
                                                {{ ramens[key].temperature }}
                                            </div>
                                        </td>
                                        <td>
                                            <div v-bind:class="key > 0 ? [ramen.date > ramens[key-1].date ? '' : 'none'] : ''">
                                                {{ ramens[key].humidity }}
                                            </div>
                                        </td>
                                        <td>
                                            <div v-bind:class="key > 0 ? [ramen.date > ramens[key-1].date ? '' : 'none'] : ''">
                                                {{ ramens[key].uvindex }}
                                            </div>
                                        </td>
                                        <td>
                                            <div v-bind:class="key > 0 ? [ramen.date > ramens[key-1].date ? '' : 'none'] : ''">
                                                {{ ramens[key].cloudcover }}
                                            </div>
                                        </td>
                                        <td>
                                            <div v-bind:class="key > 0 ? [ramen.date > ramens[key-1].date ? '' : 'none'] : ''">
                                                {{ ramens[key].rain }}
                                            </div>
                                        </td>
                                        <td>
                                            <div v-bind:class="key > 0 ? [ramen.date > ramens[key-1].date ? '' : 'none'] : ''">
                                                {{ ramens[key].windspeed ? Math.round((ramens[key].windspeed / 3.6) * 10) / 10 : "" }}
                                            </div>
                                        </td>
                                        <!--<td><div class="text-right">{{ ramens[key].amount }}</div></td>-->
                                    </tr>
                                </tbody>    
                            </table>
                        </div>
                    </div>
                    <div class="col-sm-0 col-md-1 col-lg-2 col-xl-2"></div>
                </div>
            </div>
            <!-- 天気 入力ダイアログ -->
            <div class="modal fade" id="demoNormalModal2" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="demoModalTitle">{{ $t("Weather") }}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="weather" :placeholder='$t("Weather")'></textarea>
                            <div class='tips'>{{ weatherMessage }}</div>
                        </div>
                        <div class="modal-footer">
                            <button v-if="today.getFullYear() == today0.getFullYear() && today.getMonth() == today0.getMonth() && today.getDate() == today0.getDate()" type="button" class="btn btn-secondary btn_" @click='getWeather()'>{{ $t("Get from Web") }}</button>                         
                            <button type="button" class="btn btn-primary btn_" data-dismiss="modal" @click='editOkWeather(weather)'>OK</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- DailyMessage 入力ダイアログ -->
            <div class="modal fade" id="demoNormalModal3" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="demoModalTitle">{{ $t("Message") }}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="dailyMessageText" :placeholder='$t("Message")'></textarea>
                        </div>
                        <div class="modal-footer">                           
                            <button type="button" class="btn btn-primary" data-dismiss="modal" @click='editOkDailyMessage(dailyMessageText)'>OK</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 当番 入力ダイアログ -->
            <div class="modal fade" id="demoNormalModal4" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="demoModalTitle">{{ $t("On duty") }}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="2" v-model="onDuty" :placeholder='$t("On duty")'></textarea>
                        </div>
                        <div class="modal-footer">                           
                            <button type="button" class="btn btn-primary" data-dismiss="modal" @click='editOkOnduty(onDuty)'>OK</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ダウンロードダイアログ -->
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
                            <div>{{ $t("Please select") }}</div>
                            <div class="form-check-inline">
                                <input class="form-check-input" type="checkbox" value="" v-model="seaside">
                                <label class="form-check-label" for="flexCheckChecked">
                                    {{ $t("Seaside") }}
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">                           
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" >{{ $t("Cancel") }}</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" @click='downloadTypeB()'>{{ $t("Type") }}B</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" @click='downloadTypeA()'>{{ $t("Type") }}A</button>    
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
    import Datepicker from 'vue3-datepicker'
    import { format } from 'date-fns'
    import { ja, enUS, zhCN, zhTW, ru, de, fr, nl, es, pt, it, arSA, ko, sr, cs, ro, hr, sv, sk } from 'date-fns/locale'
    import crypto from 'crypto-js'
    import JapaneseHolidays from 'japanese-holidays'
    //import * as XLSX from 'xlsx'
    import XLSX from "xlsx-js-style"
    import axios from 'axios';

    const setDragCursor = value => {
        const html = document.getElementsByTagName('html').item(0)
            html.classList.toggle('grabbing', value)
    }

    export default {
        name: 'individual',
        display: "Simple",
        order: 2,
        components: {
            Menu,
            Datepicker,
        },
        data() {
            return {
                ramens: [],
                members: [],
                today: new Date(this.$route.params.id),
                fromDate: new Date(),
                key: null,
                innerSearchText: new Date(this.$route.params.id),
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
                courtConditions: null,
                dailyMessage: null,
                weather: null,
                weathers: [],
                weatherCode: null,
                weatherCodes: [],
                res: null,
                resHourly: null,
                error: null,
                weatherMessage:null,
                onDuty: null,
                courtNum: 0,
                today0: new Date(),
                crefregex: null,
                seaside: false,
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
            }
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
            });
            this.now = new Date();
            
            this.getMember();
            // 日付をセット
            this.innerSearchText = this.today;
            this.getDailyMessage();
            
            this.setLanguage();
            this.crefregex = /(^|[^._A-Z0-9])([$]?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])([$]?)([1-9]\d{0,5}|10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6])(?![_.(A-Za-z0-9])/g;
        },
        methods: {
            getCourtEntries: function() {
                console.log("getCourtEntries")
                // コートエントリー取得
                var d = this.today;          
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);             
                db.collection("courtEntries").where("config", "==", this.$store.state.config).orderBy("date").orderBy("courtNo").startAt(startDate).endAt(endDate)
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = [];
                        let i = 0
                        let c = 0
                        let t = null
                        let courts = ""
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            const d = doc.data();
                            //if (d.memberUid) {
                                d.id = doc.id
                                array.push(d)
                                if (i > 0 && d.date > t) {
                                    courts = courts + String(c)
                                    c = 0 
                                }
                                if (!d.cancel && !d.stop && d.memberUid) {
                                    i++
                                    c++ 
                                    //console.log(i, c)
                                }
                                t = d.date
                            //}                                          
                        });
                        courts = courts + String(c)
                        this.ramens = array
                        this.sum = this.calculate()
                        this.courtNum = i
                        // コートがあるか
                        if (i == 0) {
                            this.courtConditions = this.$t("No courts available")
                        } else {
                            this.courtConditions = courts
                            // コート面数をmessagesに記録
                            this.updateCourts(courts)
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
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
            getDailyMessage: function() {
                this.dailyMessage = null
                this.dailyMessageText = null
                this.weather = null
                this.onDuty = null
                // DailyMessage取得
                var d = this.today;
                var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                var ed = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
                this.today = d;
                const startDate = firebase.firestore.Timestamp.fromDate(sd);
                const endDate = firebase.firestore.Timestamp.fromDate(ed);
                db.collection("messages").where("config", "==", this.$store.state.config).where("date", ">=", startDate).where("date", "<=", endDate).where("class", "==", "daily").orderBy("date")
                    .get(this.source)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            d.id = doc.id;
                            this.dailyMessage = d;
                            this.dailyMessageText = d.message;
                            this.onDuty = d.onduty;
                            this.weather = d.weather;
                            this.weatherCode = d.weatherCode;
                        });
                        // コート面数のUpdateの都合でここで実行
                        this.getCourtEntries();
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
            },
            updateCourts: function(msg) {
                if (this.dailyMessage) {
                    db.collection("messages").doc(this.dailyMessage.id).update({
                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                        courts: msg
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                } else {
                    db.collection("messages").doc().set({
                        date: firebase.firestore.Timestamp.fromDate(new Date(this.today)),
                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                        config: this.$store.state.config,
                        courts: msg,
                        class: "daily"
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
            },
            editOkDailyMessage: function(msg) {
                if (this.dailyMessage) {
                    db.collection("messages").doc(this.dailyMessage.id).update({
                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                        message: msg
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                } else {
                    db.collection("messages").doc().set({
                        date: firebase.firestore.Timestamp.fromDate(new Date(this.today)),
                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                        config: this.$store.state.config,
                        message: msg,
                        class: "daily"
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
                this.getDailyMessage();
            },
            editOkOnduty: function(msg) {
                if (this.dailyMessage) {
                    db.collection("messages").doc(this.dailyMessage.id).update({
                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                        onduty: msg
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                } else {
                    db.collection("messages").doc().set({
                        date: firebase.firestore.Timestamp.fromDate(new Date(this.today)),
                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                        config: this.$store.state.config,
                        onduty: msg,
                        class: "daily"
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
                this.getDailyMessage();
            },
            setRowId1: function() {
                //
            },
            setRowId2: function(msg) {
                this.weather = msg;
                this.weatherMessage = "";
            },
            setRowId3: function(msg) {
                this.dailyMessage = msg;
            },
            setRowId4: function(msg) {
                this.onDuty = msg;
            },       
            getWeather: function() {
                // Daily
                let url = "https://api.open-meteo.com/v1/forecast?latitude=" + this.$store.state.latitude + "&longitude=" + this.$store.state.longitude + "&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=Asia%2FTokyo";
                axios
                    .get(url)
                    .then((response) => {
                        this.res = response.data;
                        for (let i = 0; i < 7; i++) {
                            this.weathers[i] = this.$t("wmo:" + this.res.daily.weathercode[i]) + "(" + this.$t(this.res.daily_units.weathercode) + ":" + this.res.daily.weathercode[i] + ")" + ", " + 
                                this.$t("Highest temperature") + ":" + this.res.daily.temperature_2m_max[i] + this.res.daily_units.temperature_2m_max + ", " + 
                                this.$t("Lowest temperature") + ":" + this.res.daily.temperature_2m_min[i] + this.res.daily_units.temperature_2m_min + ", " + 
                                this.$t("UV Index") + ":" + this.res.daily.uv_index_max[i] + this.res.daily_units.uv_index_max + ", " + 
                                this.$t("Precipitation Probability Max") + ":" + this.res.daily.precipitation_probability_max[i] + this.res.daily_units.precipitation_probability_max + ", " + 
                                this.$t("Precipitation Sum") + ":" + this.res.daily.precipitation_sum[i] + this.res.daily_units.precipitation_sum + ", " +                             
                                this.$t("Maximum Wind Speed") + ":" + /*this.res.daily.windspeed_10m_max[0] + this.res.daily_units.windspeed_10m_max + "(" + */ Math.round((this.res.daily.windspeed_10m_max[i] / 3.6) * 10) / 10 + "m/s" + /*")" + */ ", " + 
                                this.$t("Dominant Wind Direction") + ":" + this.res.daily.winddirection_10m_dominant[i] + this.res.daily_units.winddirection_10m_dominant;
                            this.weatherCodes[i] = this.res.daily.weathercode[i]
                            if (i == 0) {
                                this.weather = this.weathers[i]
                                this.weatherCode = this.weatherCodes[i]
                            }
                        }
                    })
                    .catch( e => this.error = e )
                    .finally( this.weatherMessage = this.$t("Weather information retrieved") )
                // Hourly
                let urlHourly = "https://api.open-meteo.com/v1/forecast?latitude=" + this.$store.state.latitude + "&longitude=" + this.$store.state.longitude + "&hourly=temperature_2m,relativehumidity_2m,rain,showers,snowfall,snow_depth,weathercode,surface_pressure,cloudcover,windspeed_10m,winddirection_10m,uv_index&current_weather=true&timezone=Asia%2FTokyo";
                axios
                    .get(urlHourly)
                    .then((response) => {
                        this.resHourly = response.data;
                    })
                    .catch( e => this.error = e )
                    .finally( this.weatherMessage = this.$t("Weather information retrieved") )
            },
            editOkWeather: function() {
                // Daily
                let d = this.today;
                let n = this.weathers.length
                if (n == 0) {
                    n = 1;
                    this.weathers[0] = this.weather
                    this.weatherCodes[0] = ""
                }
                let sd, ed, startDate, endDate
                let msg = []
                let start = []
                for (let i = 0; i < n; i++) {
                    sd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i, 0, 0, 0);
                    ed = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i, 23, 59, 59);
                    startDate = firebase.firestore.Timestamp.fromDate(sd);
                    endDate = firebase.firestore.Timestamp.fromDate(ed);
                    start[i] = startDate;
                    db.collection("messages").where("config", "==", this.$store.state.config).where("date", ">=", startDate).where("date", "<=", endDate).where("class", "==", "daily").orderBy("date")
                        .get(this.source)
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                msg[i] = doc.id;
                            });
                            if (msg[i]) {
                                if (this.weatherCodes[i] == "") {
                                    db.collection("messages").doc(msg[i]).update({
                                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                                        weather: this.weathers[i]
                                    })
                                    .then(() => {
                                        console.log("Document successfully update!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                                } else {
                                    db.collection("messages").doc(msg[i]).update({
                                        modified: firebase.firestore.Timestamp.fromDate(new Date()),
                                        weather: this.weathers[i],
                                        weatherCode: this.weatherCodes[i]
                                    })
                                    .then(() => {
                                        console.log("Document successfully update!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                                }
                            } else {
                                db.collection("messages").doc().set({
                                    date: start[i],
                                    modified: firebase.firestore.Timestamp.fromDate(new Date()),
                                    config: this.$store.state.config,
                                    class: "daily",
                                    weather: this.weathers[i],
                                    weatherCode: this.weatherCodes[i]    
                                })
                                .then(() => {
                                    console.log("Document successfully create!");
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                            }
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });                   
                }
                // Hourly
                let nn = this.resHourly.hourly.time.length;
                for (let i = 0; i < nn; i++) {
                    let date = this.resHourly.hourly.time[i]
                    let searchDate = firebase.firestore.Timestamp.fromDate(new Date(date))
                    db.collection("courtEntries").where("config", "==", this.$store.state.config).where("date", "==", searchDate)
                        .get(this.source)
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                //console.log("date:" + date + ", weatherCode:" + this.resHourly.hourly.weathercode[i])
                                db.collection("courtEntries").doc(doc.id).update({
                                    modified: firebase.firestore.Timestamp.fromDate(new Date()),
                                    weatherCode: this.resHourly.hourly.weathercode[i],
                                    temperature: this.resHourly.hourly.temperature_2m[i],
                                    humidity: this.resHourly.hourly.relativehumidity_2m[i],
                                    rain: this.resHourly.hourly.rain[i],
                                    snowfall: this.resHourly.hourly.snowfall[i],
                                    surfacePressure: this.resHourly.hourly.surface_pressure[i],
                                    cloudcover: this.resHourly.hourly.cloudcover[i],
                                    windspeed: this.resHourly.hourly.windspeed_10m[i],
                                    winddirection: this.resHourly.hourly.winddirection_10m[i],
                                    uvindex: this.resHourly.hourly.uv_index[i]
                                })
                                .then(() => {
                                    console.log("Document successfully update!");
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                            });                            
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
                }
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
            clearMember: function (docid, key) {
                //this.list[key][0] = "";
                this.list[key].splice(0, 1);
                this.ramens[key].memberName = "";
                this.ramens[key].memberKana = "";
                this.ramens[key].memberUid = "";
                this.ramens[key].memberNo = "";
                this.ramens[key].cancel = false;
                // DB
                this.getAndClearMember(docid);    
            },
            getAndClearMember: function (docid) {
                db.collection("courtEntries").doc(docid)
                    .get(this.soruce).then((doc) => {
                        if (doc.exists) {
                            db.collection("courtEntries").doc(docid).update({
                                memberUid: "",
                                memberName: "",
                                memberKana: "",
                                memberNo: "",
                                cancel: false
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
            changeDate: function() {
                this.today = this.picked;
                this.$router.push({ name: 'courtdaily', params: { id: this.today } });
                this.weathers = [];
                this.weatherCodes = [];
                this.weatherCode = -1;
                //console.log(this.date);
                //this.$router.push({ name: 'courtentries', params: { id: this.today } });
                //this.getCourtEntries();
                this.getDailyMessage();
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
            back: function() {
                this.$router.go(-1)
            },         
            clearList: function() {
                let n = this.list.length;
                console.log("n =", n);
                for (let i = 0; i < n; i++) {
                    //this.list[i] = [];
                    this.list.splice(i, 1);
                }               
            },
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
                let sum = 0;
                this.ramens.forEach((item, key) => {
                    let hours = Math.round((this.ramens[key].end.toDate() - this.ramens[key].date.toDate()) / 1000 / 60 / 60)
                    let rates = this.$store.state.weekdayRatesPerHour
                    if (this.isHoliday(this.ramens[key].date.toDate()) || this.ramens[key].date.toDate().getDay() == 0 || this.ramens[key].date.toDate().getDay() == 6) {
                        rates = this.$store.state.holidayRatesPerHour
                    }
                    if (this.ramens[key].cancel || !this.ramens[key].memberUid) hours = 0
                    let amount = rates * hours
                    this.ramens[key].amount = amount
                    if (this.displayThursdayMeeting) {
                        if (this.ramens[key].thursdayMeeting) sum = sum + amount
                    } else {
                        if (!this.ramens[key].thursdayMeeting) sum = sum + amount
                    }                        
                });
                return sum

            },
            downloadTypeA: async function() {
                const data = this.$refs.xlsxsheet

                const sheet = XLSX.utils.table_to_sheet(data);
                const json = XLSX.utils.sheet_to_json(sheet);

                const rows = json.map(row => ({
                    時間: row.時間 + "-" + row.To,
                    コート: row.コート,
                    カナ: (row.x || row.s) ? "" : row.カナ,
                    x: row.x,
                    s: row.s,
                    備考: row.備考編集
                }));
                /* generate worksheet and workbook */
                const worksheet = XLSX.utils.json_to_sheet(rows);
                // タイトル
                worksheet["A1"] = {
                    v: this.formatDate(this.today, 'yyyy/MM/dd'),
                    t: "d"
                };
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "コート");
                worksheet["!cols"] = [ { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 4 }, { wch: 4 }, { wch: 12 } ];
                /*
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
                        s.border = {
                            top: { style: "thin", color: {theme: 4} },
                            bottom: { style: "thin", color: {theme: 4} },
                            left: { style: "thin", color: {theme: 4} },
                            right: { style: "thin", color: {theme: 4} }
                        };

                        // スタイルを反映
                        sheet[rangeName] = {
                            ...sheet[rangeName],
                            s,
                        };
                    }
                }
                */
                //const wb = XLSX.utils.table_to_book(data);
                XLSX.writeFile(workbook, this.$t("Court") + this.formatDate(this.today, 'yyyyMMdd') + '.xlsx');
            },
            downloadTypeB: async function() {
                if (this.seaside) {
                    this.downloadTypeB2()
                    return
                }
                const data = this.$refs.xlsxsheet;
                const sheet = XLSX.utils.table_to_sheet(data);
                const json = XLSX.utils.sheet_to_json(sheet);
                //console.log(json);
                
                /* filter for the Presidents */
                //const amount = json.filter(row => row.小計 > 0);

                /* sort by first presidential term */
                //amount.forEach(prez => prez.start = prez.terms.find(term => term.type === "prez").start);
                //amount.sort((l,r) => l.start.localeCompare(r.start));

                /* flatten objects */
                
                const rows = json.map(row => ({
                    時間: row.時間 + "-" + row.To,
                    コート: row.コート,
                    カナ: (row.x || row.s) ? "" : row.カナ,
                    "D" : "",
                    "E" : "",
                    "F" : ""
                }));
                // 最後2行が処理されないので空行を追加しておく
                let empty = {};
                rows.push(empty);
                rows.push(empty);
                

                /* generate worksheet and workbook */
                const worksheet = XLSX.utils.json_to_sheet(rows);
                // 横に
                rows.forEach((value, idx) => {
                    console.log(value);
                    switch ((idx + 2) % 4) {
                        case 1:
                            if (worksheet["C" + idx]) worksheet["D" + (idx - 1)] = {v: worksheet["C" + idx].v};
                            break;
                        case 2:
                            if (worksheet["C" + idx]) worksheet["E" + (idx - 2)] = {v: worksheet["C" + idx].v};
                            break;
                        case 3:
                            if (worksheet["C" + idx]) worksheet["F" + (idx - 3)] = {v: worksheet["C" + idx].v};
                            break;
                        default:
                            break;
                    }                  
                });
                // タイトル
                worksheet["A1"] = {
                    v: this.formatDate(this.today, 'yyyy/MM/dd'),
                    t: "d"
                };
                worksheet["C1"] = {v: worksheet["B2"].v};
                worksheet["D1"] = {v: worksheet["B3"].v};
                worksheet["E1"] = {v: worksheet["B4"].v};
                worksheet["F1"] = {v: worksheet["B5"].v};
                // 行削除
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
                delete_row(worksheet, 2)
                delete_row(worksheet, 2)
                delete_row(worksheet, 2)
                delete_row(worksheet, 3)
                delete_row(worksheet, 3)
                delete_row(worksheet, 3)
                delete_row(worksheet, 4)
                delete_row(worksheet, 4)
                delete_row(worksheet, 4)
                delete_row(worksheet, 5)
                delete_row(worksheet, 5)
                delete_row(worksheet, 5)
                // 列
                /*
                worksheet["B2"] = {v: ""};
                worksheet["B3"] = {v: ""};
                worksheet["B4"] = {v: ""};
                worksheet["B5"] = {v: ""};
                */
                // 列削除
                this.delete_cols(worksheet, 1, 1)

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "コート");

                /* fix headers */
                //XLSX.utils.sheet_add_aoa(worksheet, [[this.formatDate(this.today, 'yyyy/MM/dd')]], { origin: "A1" });

                /* calculate column width */
                //const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
                worksheet["!cols"] = [ { wch: 12 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 } ];

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
                        s.border = {
                            top: { style: "thin", color: {theme: 4} },
                            bottom: { style: "thin", color: {theme: 4} },
                            left: { style: "thin", color: {theme: 4} },
                            right: { style: "thin", color: {theme: 4} }
                        };

                        // スタイルを反映
                        sheet[rangeName] = {
                            ...sheet[rangeName],
                            s,
                        };
                    }
                }

                /* create an XLSX file and try to save to *.xlsx */
                XLSX.writeFile(workbook, this.$t("Court") + this.formatDate(this.today, 'yyyyMMdd') + '_B.xlsx');
            },
            downloadTypeB2: async function() {
                const data = this.$refs.xlsxsheet;
                const sheet = XLSX.utils.table_to_sheet(data);
                const json = XLSX.utils.sheet_to_json(sheet);
                
                const rows = json.map(row => ({
                    時間: row.時間 + "-" + row.To,
                    コート: row.コート,
                    カナ: (row.x || row.s) ? "" : row.カナ,
                    "D" : "",
                    "E" : "",
                    "F" : "",
                    "G" : "",
                    "H" : "",
                    "I" : "",
                    "J" : ""
                }));
                // 最後2行が処理されないので空行を追加しておく
                let empty = {};
                rows.push(empty);
                rows.push(empty);
                
                /* generate worksheet and workbook */
                const worksheet = XLSX.utils.json_to_sheet(rows);
                // 横に
                rows.forEach((value, idx) => {
                    console.log(value);
                    switch ((idx + 6) % 8) {
                        case 1:
                            if (worksheet["C" + idx]) worksheet["D" + (idx - 1)] = {v: worksheet["C" + idx].v};
                            break;
                        case 2:
                            if (worksheet["C" + idx]) worksheet["E" + (idx - 2)] = {v: worksheet["C" + idx].v};
                            break;
                        case 3:
                            if (worksheet["C" + idx]) worksheet["F" + (idx - 3)] = {v: worksheet["C" + idx].v};
                            break;
                        case 4:
                            if (worksheet["C" + idx]) worksheet["G" + (idx - 4)] = {v: worksheet["C" + idx].v};
                            break;
                        case 5:
                            if (worksheet["C" + idx]) worksheet["H" + (idx - 5)] = {v: worksheet["C" + idx].v};
                            break;
                        case 6:
                            if (worksheet["C" + idx]) worksheet["I" + (idx - 6)] = {v: worksheet["C" + idx].v};
                            break;
                        case 7:
                            if (worksheet["C" + idx]) worksheet["J" + (idx - 7)] = {v: worksheet["C" + idx].v};
                            break;
                        default:
                            break;
                    }                  
                });
                // タイトル
                worksheet["A1"] = {
                    v: this.formatDate(this.today, 'yyyy/MM/dd'),
                    t: "d"
                };
                worksheet["C1"] = {v: worksheet["B2"].v};
                worksheet["D1"] = {v: worksheet["B3"].v};
                worksheet["E1"] = {v: worksheet["B4"].v};
                worksheet["F1"] = {v: worksheet["B5"].v};
                worksheet["G1"] = {v: worksheet["B6"].v};
                worksheet["H1"] = {v: worksheet["B7"].v};
                worksheet["I1"] = {v: worksheet["B8"].v};
                worksheet["J1"] = {v: worksheet["B9"].v};
                
                // 行削除
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
                delete_row(worksheet, 2)
                delete_row(worksheet, 2)
                delete_row(worksheet, 2)
                delete_row(worksheet, 2)
                delete_row(worksheet, 2)
                delete_row(worksheet, 2)
                delete_row(worksheet, 2)
                delete_row(worksheet, 3)
                delete_row(worksheet, 3)
                delete_row(worksheet, 3)
                delete_row(worksheet, 3)
                delete_row(worksheet, 3)
                delete_row(worksheet, 3)
                delete_row(worksheet, 3)
                delete_row(worksheet, 4)
                delete_row(worksheet, 4)
                delete_row(worksheet, 4)
                delete_row(worksheet, 4)
                delete_row(worksheet, 4)
                delete_row(worksheet, 4)
                delete_row(worksheet, 4)
                // 列
                /*
                worksheet["B2"] = {v: ""};
                worksheet["B3"] = {v: ""};
                worksheet["B4"] = {v: ""};
                worksheet["B5"] = {v: ""};
                */
                // 列削除
                this.delete_cols(worksheet, 1, 1)

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "コート");

                /* fix headers */
                //XLSX.utils.sheet_add_aoa(worksheet, [[this.formatDate(this.today, 'yyyy/MM/dd')]], { origin: "A1" });

                /* calculate column width */
                //const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
                worksheet["!cols"] = [ { wch: 12 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 } ];

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
                        s.border = {
                            top: { style: "thin", color: {theme: 4} },
                            bottom: { style: "thin", color: {theme: 4} },
                            left: { style: "thin", color: {theme: 4} },
                            right: { style: "thin", color: {theme: 4} }
                        };

                        // スタイルを反映
                        sheet[rangeName] = {
                            ...sheet[rangeName],
                            s,
                        };
                    }
                }

                /* create an XLSX file and try to save to *.xlsx */
                XLSX.writeFile(workbook, this.$t("Court") + this.formatDate(this.today, 'yyyyMMdd') + '_B.xlsx');
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
            htmlText(msg){
                if (msg) {
                    return msg.replace(/\r?\n/g, '<br>')
                }
            },
            changedEditCheck: function() {    
                this.getCourtEntries()
            },
            updateRemarks: function(id, value) {
                    db.collection("courtEntries").doc(id).update({
                        remarks: value
                    })
                    .then(() => {
                        console.log("Document successfully written!(Score)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            },
            updateCancel: function(docid, checked) {
                    db.collection("courtEntries").doc(docid).update({
                        cancel: checked
                    })
                    .then(() => {
                        console.log("Document successfully written!(courtEntries)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            },
            updateStop: function(docid, checked) {
                    db.collection("courtEntries").doc(docid).update({
                        stop: checked
                    })
                    .then(() => {
                        console.log("Document successfully written!(courtEntries)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            },          
            lowerThanDate: function(date1, date2, day) {
                let year1 = date1.getFullYear();
                let month1 = date1.getMonth() + 1;
                let day1 = date1.getDate();
        
                let year2 = date2.getFullYear();
                let month2= date2.getMonth() + 1;
                let day2 = date2.getDate() - day;
        
                if (year1 == year2) {
                    if (month1 == month2) {
                        return day1 < day2;
                    }
                    else {
                        return month1 < month2;
                    }
                } else {
                    return year1 < year2;
                }
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
    .court50 {
        width: 50px;
        white-space: nowrap;
    }
    .court45 {
        width: 45px;
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
    .col-auto {
        white-space: nowrap;
    }
    .nowrap {
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
    .margin5 {
        margin: 5px;
    }
    .margin10 {
        margin: 10px;
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
    .width300 {
        min-width: 300px;
    }
    .width120 {
        width: 120px;
        white-space: nowrap;
    }
    .width70 {
        width: 72px;
        white-space: nowrap;
    }
    .nowrap {
        white-space: nowrap;
    }
    /*
    .tips {
        margin: 5px;
        font-size: 80%;
        text-align: right;
        font-weight: normal;
    }
    */
    .small {
        margin: 5px;
        font-size: 80%;
    }
    .none {
        display: none;
    }
    .min-width100 {
        min-width: 100px;
    }
    .min-width120 {
        min-width: 100px;
    }
    .left {
        text-align: left;
    }
</style>