<template>
    <div class="court"><Menu class="sticky-top"></Menu>
        <div class="container-fluid">   
            <h4>{{ $t("Court List") }} {{ date.year }}年{{ date.month }}</h4>
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
                        <input class="form-check-input" type="checkbox" value="" v-model="thursdayMeeting" @change="changedThursdayMeetingCheck()">
                        <label class="form-check-label" for="flexCheckChecked">
                            {{ $t("Thursday meeting") }}
                        </label>
                    </div>
                    <div class="form-check-inline">
                        <input class="form-check-input" type="checkbox" value="" v-model="seaside" @change="changedSeasideCheck()">
                        <label class="form-check-label" for="flexCheckChecked">
                            {{ $t("Seaside") }}
                        </label>
                    </div>
                </div>
                <div v-if='$store.state.isAdmin' class="col-sm-4">          
                    <div class="form-check-inline">
                        <input class="form-check-input" type="checkbox" value="" v-model="display">
                        <label class="form-check-label" for="flexCheckChecked">
                            {{ $t("Member") }}
                        </label>
                    </div>
                    <div class="form-check-inline">
                        <input class="form-check-input" type="checkbox" value="" v-model="edit" @change="changedEditCheck()">
                        <label class="form-check-label" for="flexCheckChecked">
                            {{ $t("Edit") }}
                        </label>
                    </div> 
                </div>
                <div class="col-sm-2"></div>
            </div>
            <div>
                <!-- 作成ボタン等 -->
                <div v-if='$store.state.isAdmin && edit && today < nextMonth'>  
                    <button class='btn btn-secondary btn_' data-toggle="modal" data-target="#demoNormalModal2" @click="setRowIdAdd()">{{ $t("Add") }}</button>   
                </div>
                <div v-else-if='$store.state.isAdmin && edit && today >= nextMonth && entryNum > 0'>  
                    <button class='btn btn-primary btn_' @click="selectDateCourt()">{{ $t("Create") }}</button>
                    <button class='btn btn-secondary btn_' data-toggle="modal" data-target="#demoNormalModal2" @click="setRowIdAdd()">{{ $t("Add") }}</button>
                    <button class='btn btn-danger btn_' @click="deleteAllEntry()">{{ $t("Delete") }}</button>    
                </div>
                <div v-else-if='$store.state.isAdmin && edit && today >= nextMonth && entryNum == 0'>
                    <button class='btn btn-primary btn_' @click="selectDateCourt()">{{ $t("Create") }}</button>
                    <button class='btn btn-secondary btn_' data-toggle="modal" data-target="#demoNormalModal2" @click="setRowIdAdd()">{{ $t("Add") }}</button>
                </div>
            </div>
            <div>
                <button v-if='!edit && ramens.length > 0' class='btn btn-secondary btn_' data-toggle="modal" data-target="#selectDialog" @click="setRowIdDownload()">{{ $t("Download") }}</button>
            </div>           
            <div class="margin"></div>         
            <div class="row">
                <div class="col-sm-0 col-md-0 col-lg-0 col-xl-0"></div>
                <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class='tipscenter'>{{ $t("L:lottery, x:cancel, s:stop using") }}</div>  
                    <div class="table-responsive">
                        <table class="table table-sm" ref="xlsxsheet" >
                            <thead >
                                <tr>
                                    <!--<th class='col court40'>#</th>-->
                                    <th class='col court100'>{{ $t("Date") }}</th>
                                    <th class='col court60'>{{ $t("Time") }}</th>
                                    <th class='col court10'></th>
                                    <th class='col court60'>To</th>
                                    <th class='col court100'>{{ $t("Court") }}</th>        
                                    <th class='col court130'>{{ $t("Name") }}</th>
                                    <th class='col court30'>L</th>
                                    <th class='col court30'>x</th>
                                    <th class='col court30'>s</th>
                                    <th v-if='edit' class='col court40'></th>
                                    <th v-if='$store.state.isAdmin && $store.state.opas' class='col court40'></th>
                                    <th class='col court190'>{{ $t("Kana") }}</th>
                                    <th class='col-auto nowrap'>{{ $t("Remarks") }}</th>
                                    <th class='col court100'><div class="text-right">{{ $t("Amount") }}</div></th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th><div>{{ sumL }}</div></th>
                                    <th></th>
                                    <th></th>
                                    <th v-if='edit'></th>
                                    <th v-if='$store.state.isAdmin && $store.state.opas'></th>
                                    <th></th>
                                    <th></th>
                                    <th><div class="text-right">{{ sum }}</div></th>
                                </tr>     
                            </tfoot>
                            <tbody>
                                <tr v-for="(ramen, key) in ramens" :key="key" 
                                    v-bind:style="key > 0 ? (sortByMemberNo ? tr1 : (ramen.date > ramens[key-1].date ? tr1 : tr2)) : tr2"
                                    :class="{ active: isActive(key) }"
                                    @click="activeNumber = key">
                                    <td class="nowrap">    
                                        <div v-if='edit && $store.state.isAdmin'>
                                            <button v-if='ramen.date.toDate().getDay() == 0' class='btn btn-danger btn-sm' data-toggle="modal" data-target="#demoNormalModal" @click="setRowId(ramen.id, key, ramen.date, ramen.end, ramen.courtUid, ramen.thursdayMeeting)">
                                                {{ formatDate(ramen.date.toDate(), 'd (D)') }}
                                            </button>
                                            <button v-else-if='ramen.date.toDate().getDay() == 6' class='btn btn-primary btn-sm' data-toggle="modal" data-target="#demoNormalModal" @click="setRowId(ramen.id, key, ramen.date, ramen.end, ramen.courtUid, ramen.thursdayMeeting)">
                                                {{ formatDate(ramen.date.toDate(), 'd (D)') }}
                                            </button>
                                            <button v-else-if='isHoliday(ramen.date.toDate())' class='btn btn-info btn-sm' data-toggle="modal" data-target="#demoNormalModal" @click="setRowId(ramen.id, key, ramen.date, ramen.end, ramen.courtUid, ramen.thursdayMeeting)">
                                                {{ formatDate(ramen.date.toDate(), 'd (D)') }}
                                            </button>
                                            <button v-else class='btn btn-light btn-sm' data-toggle="modal" data-target="#demoNormalModal" @click="setRowId(ramen.id, key, ramen.date, ramen.end, ramen.courtUid, ramen.thursdayMeeting)">
                                                {{ formatDate(ramen.date.toDate(), 'd (D)') }}
                                            </button>
                                        </div>
                                        <div v-else>
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
                                    <td class="nowrap">
                                        <div v-if='edit && $store.state.isAdmin'>
                                            <draggable
                                                class="list-group droparea"
                                                :list="list[key]"
                                                :disabled="enabled[key]"
                                                group="people"
                                                @change="changedDistList"
                                                @start="startDistList"
                                                @end="endDistList"                   
                                                item-key="name"
                                                :move="checkMove_"
                                                :data-column-id="key"
                                            >   
                                                <template #item="{ element }">
                                                    <div>{{ element.name }}</div>
                                                </template>
                                            </draggable>
                                        </div>
                                        <div v-else>
                                            <div v-if='ramen.cancel' style="text-decoration:line-through">
                                                {{ ramens[key].memberName }}
                                            </div>
                                            <div v-else-if='ramen.stop' style="color:lightgray">
                                                {{ ramens[key].memberName }}
                                            </div>
                                            <div v-else> 
                                                {{ ramens[key].memberName }}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if='edit' class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.lottery" @change="updateLottery(ramen.id, ramen.lottery)">
                                            <label class="form-check-label" for="flexCheckChecked">
                                            </label>
                                        </div>
                                        <div v-else>
                                            <div v-if='ramen.lottery'>L</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if='ramens[key].memberKana && edit' class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.cancel" @change="updateCancel(ramen.id, ramen.cancel)">
                                            <label class="form-check-label" for="flexCheckChecked">
                                            </label>
                                        </div>
                                        <div v-else>
                                            <div v-if='ramen.cancel'>x</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if='edit' class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="ramen.stop" @change="updateStop(ramen.id, ramen.stop)">
                                            <label class="form-check-label" for="flexCheckChecked">
                                            </label>
                                        </div>
                                        <div v-else>
                                            <div v-if='ramen.stop'>s</div>
                                        </div>
                                    </td>
                                    <td v-if='edit'>
                                        <button v-if='ramens[key].memberKana && edit' class='btn btn-warning btn-sm' @click="clearMember(ramen.id, key)">
                                            <fa icon="trash" />
                                        </button>
                                    </td>
                                    <td v-if='$store.state.isAdmin && $store.state.opas'>
                                        <button v-if='ramens[key].memberUid && $store.state.isAdmin' class='btn btn-success btn-sm' @click="loginOpas(ramens[key].memberUid)"><fa icon="sign-in-alt" /></button>
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
                                    <td class="nowrap">
                                        <div v-if='edit'>
                                            <input type="text" class="form-control" aria-label="Remarks"
                                                v-model="ramen.remarks"
                                                @change="updateRemarks(ramen.id, ramen.remarks)"
                                            >
                                        </div>
                                        <div v-else>
                                            {{ ramens[key].remarks }}
                                        </div>
                                    </td>
                                    <td><div class="text-right">{{ ramens[key].amount }}</div></td>
                                </tr>
                            </tbody>    
                        </table>
                    </div>
                </div>
                <div class="col-sm-0 col-md-0 col-lg-0 col-xl-0"></div>
            </div>

            <!-- Member Start -->
            <div v-if='display' class="member">
                <div id="app">
                    <div class="margin50"></div>
                    <table class="table table-sm">
                        
                        <thead>                
                            <tr>
                                <!--<th>No</th>-->
                                <th>{{ $t("Name") }}</th>
                                <th>{{ $t("Sort") }}
                                    <!--<div class="form-check-inline">
                                        <input class="form-check-input" type="checkbox" value="" v-model="sortByMemberKana" @change="getMember()">
                                        <label class="form-check-label" for="flexCheckChecked">
                                            {{ $t("Sort") }}
                                        </label>
                                    </div>-->
                                </th>
                            </tr>  
                        </thead> 
                                    
                        <draggable 
                            :list="myArray"                        
                            :group="{ name: 'people', pull: pullFunction, put: false }"                      
                            tag="tbody"
                            @change="changedSourceList"
                            @start="startSourceList"
                            @end="endSourceList"
                            :move="checkMove"
                            item-key="name" 
                        >
                            <template #item="{ element }">
                                <tr>
                                    <!--<th>{{ element.no }}</th>-->
                                    <td>{{ element.name }}</td>
                                    <td>{{ element.order }}</td>
                                    <div v-if="element.kana" >
                                        <button class='btn btn-success btn-sm' @click="loginOpas(element.id)"><fa icon="sign-in-alt" /></button>
                                    </div> 
                                </tr>
                            </template>
                        </draggable>
                            
                    </table>
                </div>
            </div> 
            <!-- Member End -->

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
                        <div class="form-inline ">
                            <div class="form-row align-items-center">
                                <div class="input-group">                                   
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect01">{{ $t("Court") }}</label>
                                    </div>
                                    <select class="custom-select mr-sm-4" id="inlineFormCustomSelect"
                                        v-model="court"
                                    >
                                        <option v-for="item in courts" :key="item" :value="item.id">{{ item.name }}</option>
                                    </select>           
                                </div>
                                <div class="form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="thursdayMeeting">
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {{ $t("Thursday meeting") }}
                                    </label>
                                </div>
                                <div class="form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="seaside">
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {{ $t("Seaside") }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="form-inline ">
                            <div class="form-row align-items-center">
                                <div class="input-group">
                                    
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect01">{{ $t("Start") }}</label>
                                    </div>
                                    <select class="custom-select mr-sm-4" id="inlineFormCustomSelect"
                                        v-model="inTime"
                                    >
                                        <option selected>...</option>
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
                                    </select>
                                
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect01">{{ $t("End") }}</label>
                                    </div>
                                    <select class="custom-select mr-sm-4" id="inlineFormCustomSelect"
                                        v-model="outTime"
                                    >
                                        <option selected>...</option>
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
                                    </select>
                                    
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger btn_" data-dismiss="modal" @click='deleteCourt(rowId)'>{{ $t("Delete") }}</button>
                        <button type="button" class="btn btn-primary btn_" data-dismiss="modal" @click='updateCourt(rowId, inTime, outTime, court)'>{{ $t("OK") }}</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 追加ダイアログ -->
        <div class="modal fade" id="demoNormalModal2" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
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
                            <div class="form-row align-items-center">
                                <div class="input-group">                        
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect01">{{ $t("Court") }}</label>
                                    </div>
                                    <select class="custom-select mr-sm-4" id="inlineFormCustomSelect"
                                        v-model="court"
                                    >
                                        <option v-for="item in courts" :key="item" :value="item.id">{{ item.name }}</option>
                                    </select>                                  
                                </div>
                                <div class="form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="thursdayMeeting">
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {{ $t("Thursday meeting") }}
                                    </label>
                                </div>
                                <div class="form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" v-model="seaside">
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {{ $t("Seaside") }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="form-inline ">
                            <div class="form-row align-items-center">
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

                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect01">{{ $t("Start") }}</label>
                                    </div>
                                    <select class="custom-select mr-sm-4" id="inlineFormCustomSelect"
                                        v-model="inTime"
                                    >
                                        <option selected>...</option>
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
                                    </select>
                                
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect01">{{ $t("End") }}</label>
                                    </div>
                                    <select class="custom-select mr-sm-4" id="inlineFormCustomSelect"
                                        v-model="outTime"
                                    >
                                        <option selected>...</option>
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
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary btn_" data-dismiss="modal" @click='addCourt(day, inTime, outTime, court)'>{{ $t("OK") }}</button>
                    </div>
                </div>
            </div>
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
                        <!--<button type="button" class="btn btn-primary" data-dismiss="modal" @click='downloadTypeC()'>{{ $t("Type") }}C</button>-->
                        <button v-if="!sortByMemberNo" type="button" class="btn btn-primary" data-dismiss="modal" @click='downloadTypeB()'>{{ $t("Type") }}B</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click='downloadTypeA()'>{{ $t("Type") }}A</button>    
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
    import draggable from 'vuedraggable'
    import { MonthPicker } from 'vue-month-picker'
    import crypto from 'crypto-js'
    import JapaneseHolidays from 'japanese-holidays'
    //import * as XLSX from 'xlsx'
    import XLSX from "xlsx-js-style"

    const setDragCursor = value => {
        const html = document.getElementsByTagName('html').item(0)
            html.classList.toggle('grabbing', value)
    }

    //var memberRef = db.collection("users");
    export default {
        name: 'courtentries',
        display: "Simple",
        order: 2,
        components: {
            Menu,
            //Datepicker,
            //VueDatePicker,
            MonthPicker,
            //MonthPickerInput,
            draggable,
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
                sumL: 0,
                activeNumber: null,
                entryNum: 0,
                sortByMemberNo: null,
                sortByMemberKana: true,
                thursdayMeeting: false,
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
            this.getCourtEntries();
            this.getMember();
            this.getCourt();
            // 日付をセット
            this.innerSearchText = this.today;
            this.setLanguage();
            let d = new Date();
            this.nextMonth = new Date(d.getFullYear(), d.getMonth() + 2, 0, 0, 0, 0);  
            this.thursdayMeeting = this.$store.state.thursdayMeeting
            this.seaside = this.$store.state.seaside
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
                this.list = []
                
                db.collection("courtEntries").where("config", "==", this.$store.state.config).orderBy("date").orderBy("courtNo").startAt(startDate).endAt(endDate)
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = [];
                        let i = 0;
                        let ii = 0;
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            const d = doc.data();
                            d.id = doc.id;
                            if (this.thursdayMeeting) {
                                if (d.thursdayMeeting) {
                                    array.push(d)
                                    let m = {};
                                    m.name = d.memberName;
                                    m.id = d.memberUid;
                                    m.kana = d.memberKana;
                                    m.docid = d.id;
                                    let result = [];
                                    if (m.name) result.push(m);
                                    this.list[i] = result;
                                    i++;
                                }
                            } else if (this.seaside) {
                                if (d.seaside) {
                                    array.push(d)
                                    let m = {};
                                    m.name = d.memberName;
                                    m.id = d.memberUid;
                                    m.kana = d.memberKana;
                                    m.docid = d.id;
                                    let result = [];
                                    if (m.name) result.push(m);
                                    this.list[i] = result;
                                    i++;
                                }
                            } else {
                                if (!d.thursdayMeeting && !d.seaside) {
                                    array.push(d)
                                    let m = {};
                                    m.name = d.memberName;
                                    m.id = d.memberUid;
                                    m.kana = d.memberKana;
                                    m.docid = d.id;
                                    let result = [];
                                    if (m.name) result.push(m);
                                    this.list[i] = result;
                                    i++;
                                }
                            }
                            ii++                   
                        });
                        /*
                        // memberNoでソート
                        if (this.sortByMemberNo) {
                            array.sort(function(a, b){
                                return a.memberNo - b.memberNo;
                            });
                        }
                        */
                        this.ramens = array
                        this.sumL = this.calculateL()
                        this.sum = this.calculate()
                        this.entryNum = ii
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
                        d.kana = doc.data().kanaSei ? doc.data().kanaSei + " " + doc.data().kanaNa : ""
                        d.no = doc.data().userNo;
                        // ゲストと退会者、(一時停止)は除く
                        if (!d.guest && !d.resigned /*&& !d.suspension*/) {
                            array.push(d);
                        }
                        // カナでソート
                        if (this.sortByMemberKana) {
                            array.sort(function(a, b) {
                                if (a.kana < b.kana) return -1;
                                if (a.kana > b.kana) return 1;
                                return 0;
                            });
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
            getCourt: function() {
                // コート取得
                db.collection("courts").where("config", "==", this.$store.state.config).orderBy("no")
                    .get(this.soruce)
                    .then((querySnapshot) => {
                        const array = [];
                        querySnapshot.forEach((doc) => {
                            const d = doc.data();
                            // 待ちコートは除く
                            if (d.no != 0) {
                                d.id = doc.id;
                                array.push(d);
                            }
                        });
                        this.courts = array
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
            deleteAllEntry: async function() {
                let result = window.confirm(this.$t("Are you sure you want to delete everything?"));
                if (result) {
                    // 現在のエントリーデータ取得して削除
                    var d = this.today;
                    var sd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                    var ed = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
                    this.today = d;
                    const startDate = firebase.firestore.Timestamp.fromDate(sd);
                    const endDate = firebase.firestore.Timestamp.fromDate(ed);
                    await db.collection("courtEntries").where("config", "==", this.$store.state.config).orderBy("date").orderBy("courtNo").startAt(startDate).endAt(endDate)
                        .get(this.soruce)
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                // doc.data() is never undefined for query doc snapshots
                                db.collection("courtEntries").doc(doc.id).delete().then(() => {
                                    console.log("Document successfully deleted!");
                                }).catch((error) => {
                                    console.error("Error removing document: ", error);
                                });                      
                            });
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                    });
                    this.getCourtEntries();
                }            
            },
            deleteEntry: function(docid) {
                db.collection("courtEntries").doc(docid).delete().then(() => {
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
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
            updateCourtEntryMember: function(docid, id, name, kana, no) {
                    db.collection("courtEntries").doc(docid).update({
                        memberUid: id,
                        memberName: name,
                        memberKana: kana,
                        memberNo: no
                    })
                    .then(() => {
                        console.log("Document successfully written!(courtEntries)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            },
            updateLottery: function(docid, checked) {
                    db.collection("courtEntries").doc(docid).update({
                        lottery: checked
                    })
                    .then(() => {
                        console.log("Document successfully written!(courtEntries)");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                    this.sumL = this.calculateL();
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
            disableDragAndDrop: function(n) {
                this.enabled[n] = true;
            },
            remove: function(evt) {
                console.log("removed!", evt);
            },
            changedSourceList: function(evt) {
                console.log(evt);
            },
            startDistList: function(evt) {
                console.log("start evt", evt)
                this.dragstart = "dist"
                //this.controlOnStart = true
            },
            endDistList: function(evt) {
                // コートリストからドラッグした場合
                console.log("endDistList(): " + evt)
                const from = evt.from.outerHTML;
                const fromId = from.match( /data-column-id="[0-9]+"/ )[0];
                const fromIndex = fromId.match(/"(.*?)"/)[1];
                const to = evt.to.outerHTML;
                const toId = to.match( /data-column-id="[0-9]+"/ )[0];
                const toIndex = toId.match(/"(.*?)"/)[1];
                const src = this.ramens[fromIndex];
                const dst = this.ramens[toIndex];
                // カナ
                this.ramens[toIndex].memberKana = src.memberKana;
                // userNo
                this.ramens[toIndex].memberNo = src.memberNo;
                // DB更新
                this.updateCourtEntryMember(dst.id, src.memberUid, src.memberName, src.memberKana, src.memberNo);
                // 元をクリア
                this.clearMember(src.id, fromIndex);
            },
            startSourceList: function(evt) {
                console.log("start evt", evt)
                this.dragstart = "source"
                this.oldIndex = evt.oldIndex
            },
            endSourceList: function(evt) {
                // メンバーリストからドラッグした場合               
                const str = evt.to.outerHTML;
                const cname = str.match( /class="[0-9a-z\s-]+"/ );
                // メンバーリストに戻すの禁止
                if (!cname) {
                    // ドラッグ先にclass名がなければReturn
                    return
                } else {
                    // ドラッグ先のclass名にdropareaがなければReturn
                    if (!cname[0].match( /droparea/ )) return;
                }
                const id = str.match( /data-column-id="[0-9]+"/ )[0];
                const index = id.match(/"(.*?)"/)[1];
                const src = this.members[this.oldIndex];
                const dst = this.ramens[index];
                // カナ
                this.ramens[index].memberKana = src.kana;
                this.ramens[index].memberName = src.name;
                // userNo
                this.ramens[index].memberNo = src.no;
                // DB更新
                this.updateCourtEntryMember(dst.id, src.id, src.name, src.kana, src.no);             
            },
            changedDistList: function(evt) {
                console.log(evt);               
                if (evt.added) {
                    // 追加の場合
                    console.log("changedDistList(added)")
                    if (evt.added.newIndex > 1) {
                        console.log("over 1!")
                        return false;
                    }
                    console.log("Document successfully written!", evt.added.element.name, evt.added.element.id, evt.added.element.guest);
                    // ドラッグ元を残す
                    if (this.dragstart == "source") this.myArray.splice(this.oldIndex, 0, evt.added.element)
                } else if (evt.moved) {
                    // 移動の場合
                    console.log("changedDistList(moved)")
                }              
            },           
            clearList: function() {
                let n = this.list.length;
                console.log("n =", n);
                for (let i = 0; i < n; i++) {
                    //this.list[i] = [];
                    this.list.splice(i, 1);
                }               
            },
            checkMove: function(evt) {
                console.log(evt)
                console.log("list: " + evt.relatedContext.list)
                this.dragTargetLength = evt.relatedContext.list.length
                if (evt.relatedContext.list.length > 0) {
                    // ターゲットが1件以上あるときはドラッグをキャンセル
                    return false
                }
                return true;
            },
            checkMove_: function(evt) {
                // 動いてない？
                console.log("evt_")
                console.log(evt)
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
            setRowId: function(docid, key, from, to, court, tm) {
                this.rowId = docid;
                this.key = key;
                this.fromDate = from.toDate();
                this.inTime = from?this.formatDate(from.toDate(), 'H'):"";
                this.outTime = to?this.formatDate(to.toDate(), 'H'):"";
                this.court = court;
                this.thursdayMeeting = tm;
            },
            setRowIdDownload: function() {
                //
            },
            setRowIdAdd: function() {
                //
            },
            updateCourt: function(docid, from, to, court) {
                var st = new Date(this.fromDate);
                var ed = new Date(this.fromDate);
                st.setHours(this.toHankaku(from));
                st.setMinutes(0);
                st.setSeconds(0);
                ed.setHours(this.toHankaku(to));
                ed.setMinutes(0);
                ed.setSeconds(0);
                const result = this.courts.filter(e => e.id === court);
                if (result.length == 0) {
                    // データがなければReturn
                    return    
                }
                const no = result[0].no;
                const name = result[0].name;
                const st_ = firebase.firestore.Timestamp.fromDate(new Date(st))
                const ed_ = firebase.firestore.Timestamp.fromDate(new Date(ed))
                // DB
                db.collection("courtEntries").doc(docid).update({
                    date: st_,
                    end: ed_,
                    courtUid: court,
                    courtNo: no,
                    courtName: name,
                    thursdayMeeting: this.thursdayMeeting ? this.thursdayMeeting : false,
                    seaside: this.seaside ? this.seaside : false
                })
                .then(() => {
                    console.log("Document successfully written!");
                    // Reload
                    this.ramens[this.key].courtUid = court;
                    this.ramens[this.key].courtNo = no;
                    this.ramens[this.key].courtName = name;
                    this.ramens[this.key].date = st_;
                    this.ramens[this.key].end = ed_;
                    this.ramens[this.key].thursdayMeeting = this.thursdayMeeting;
                    this.ramens[this.key].seaside = this.seaside;
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });              
            },
            addCourt: function(day, from, to, court) {
                const date = this.date.year + "-" +  ('0' + this.date.month.replace(/[^0-9]/g, '')).slice(-2) + "-" + ('0' + day).slice(-2);
                var st = new Date(date);
                var ed = new Date(date);
                st.setHours(this.toHankaku(from));
                st.setMinutes(0);
                st.setSeconds(0);
                ed.setHours(this.toHankaku(to));
                ed.setMinutes(0);
                ed.setSeconds(0);
                const result = this.courts.filter(e => e.id === court);
                if (result.length == 0) {
                    // データがなければReturn
                    return    
                }
                const no = result[0].no;
                const name = result[0].name;
                const st_ = firebase.firestore.Timestamp.fromDate(new Date(st))
                const ed_ = firebase.firestore.Timestamp.fromDate(new Date(ed))
                // DB
                db.collection("courtEntries").doc().set({
                    config: this.$store.state.config,
                    date: st_,
                    end: ed_,
                    courtUid: court,
                    courtNo: no,
                    courtName: name,
                    thursdayMeeting: this.thursdayMeeting,
                    seaside: this.seaside,
                })
                .then(() => {
                    console.log("Document successfully written!");
                    // Reload
                    this.getCourtEntries();
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });              
            },
            deleteCourt: function(docid) {
                let result = window.confirm(this.$t("Are you sure you want to delete it?"));
                if( result ) {
                    db.collection("courtEntries").doc(docid).delete().then(() => {
                    console.log("Document successfully deleted!");
                    this.getCourtEntries()
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
                }    
            },
            changedThursdayMeetingCheck: function() { 
                // 両方チェックはない 
                if (this.thursdayMeeting && this.seaside) {
                    this.seaside = false
                }  
                this.getCourtEntries()
                this.list = []
                this.$store.commit('setThursdayMeeting', this.thursdayMeeting)
                this.$store.commit('setSeaside', this.seaside)
            },
            changedSeasideCheck: function() {
                // 両方チェックはない 
                if (this.thursdayMeeting && this.seaside) {
                    this.thursdayMeeting = false
                }
                this.getCourtEntries()
                this.$store.commit('setThursdayMeeting', this.thursdayMeeting)
                this.$store.commit('setSeaside', this.seaside)
            },
            changedEditCheck: function() {    
                this.getCourtEntries()
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
                    if (this.ramens[key].cancel || this.ramens[key].stop || !this.ramens[key].memberUid) hours = 0
                    let amount = rates * hours
                    this.ramens[key].amount = amount
                    if (this.thursdayMeeting) {
                        if (this.ramens[key].thursdayMeeting) sum = sum + amount
                    } else {
                        if (!this.ramens[key].thursdayMeeting) sum = sum + amount
                    }                        
                });
                return sum

            },
            calculateL: function() {
                // 抽選の計算
                let sum = 0;
                this.ramens.forEach((item, key) => {
                    if (this.ramens[key].lottery) {
                        sum++
                    }                      
                });
                return sum
            },
            downloadTypeA: async function() {
                const data = this.$refs.xlsxsheet

                const sheet = XLSX.utils.table_to_sheet(data);
                const json = XLSX.utils.sheet_to_json(sheet);
                const rows = json.map(row => ({
                    日付: row.日付,
                    時間: row.時間 + "-" + row.To,
                    コート: row.コート,
                    名前: (row.x || row.s) ? "" : row.名前,
                    カナ: (row.x || row.s) ? "" : row.カナ,
                    L: row.L,
                    x: row.x,
                    s: row.s,
                    備考: row.備考,
                    金額: row.金額
                }));
                /* generate worksheet and workbook */
                const worksheet = XLSX.utils.json_to_sheet(rows);
                // タイトル
                worksheet["A1"] = {
                    v: this.date.year + "年" + this.date.month
                };
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
                delete_row(worksheet, 1)               
                //
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "コート");
                worksheet["!cols"] = [ { wch: 12 }, { wch: 12 }, { wch: 9 }, { wch: 11 }, { wch: 22 }, { wch: 4 }, { wch: 4 }, { wch: 4 }, { wch: 14 }, { wch: 8 } ];
                // Style
                /*
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
                //XLSX.writeFile(wb, this.$t("Court") + this.date.year + ('0' + this.date.month.replace(/[^0-9]/g, '')).slice(-2) + '_' + this.formatDate(new Date(), 'yyMMdd') + '.xlsx');
                XLSX.writeFile(workbook, this.$t("Court") + this.date.year + ('0' + this.date.month.replace(/[^0-9]/g, '')).slice(-2) + '_' + this.formatDate(new Date(), 'yyMMdd') + '.xlsx');
            },
            downloadTypeB: async function() {
                if (this.seaside) {
                    // 臨海
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
                    日付: row.日付,
                    時間: row.時間 + "-" + row.To,
                    コート: row.コート,
                    カナ: (row.x || row.s) ? "" : row.カナ,
                    "E" : "",
                    "F" : "",
                    "G" : ""
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
                    switch ((idx + 1) % 4) {
                        case 1:
                            if (worksheet["D" + idx]) worksheet["E" + (idx - 1)] = {v: worksheet["D" + idx].v};
                            break;
                        case 2:
                            if (worksheet["D" + idx]) worksheet["F" + (idx - 2)] = {v: worksheet["D" + idx].v};
                            break;
                        case 3:
                            if (worksheet["D" + idx]) worksheet["G" + (idx - 3)] = {v: worksheet["D" + idx].v};
                            break;
                        default:
                            break;
                    }                  
                });
                // タイトル
                worksheet["A1"] = {
                    v: this.date.year + "年" + this.date.month
                };
                worksheet["D1"] = {v: worksheet["C3"].v};
                worksheet["E1"] = {v: worksheet["C4"].v};
                worksheet["F1"] = {v: worksheet["C5"].v};
                worksheet["G1"] = {v: worksheet["C6"].v};
                
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
                delete_row(worksheet, 1)               
                let n = rows.length / 4
                for (let i = 1; i < n; i++) {
                    delete_row(worksheet, i + 1)
                    delete_row(worksheet, i + 1)
                    delete_row(worksheet, i + 1)
                }
                // 列削除
                this.delete_cols(worksheet, 2, 1)
                //
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "コート");         
                worksheet["!cols"] = [ { wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 } ];

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

                // Merge
                let merge = [];
                for (let i = 1; i < n; i = i + 4) {
                    let obj = { s: { r: i, c: 0 }, e: { r: i + 3, c: 0 } }
                    merge.push(obj)
                }
                worksheet["!merges"] = merge;

                /* create an XLSX file and try to save to *.xlsx */
                XLSX.writeFile(workbook, this.$t("Court") + this.date.year + ('0' + this.date.month.replace(/[^0-9]/g, '')).slice(-2) + '_' + this.formatDate(new Date(), 'yyMMdd') + '_B.xlsx');
            },
            downloadTypeB2: async function() {
                // 臨海用
                const data = this.$refs.xlsxsheet;
                const sheet = XLSX.utils.table_to_sheet(data);
                const json = XLSX.utils.sheet_to_json(sheet);
                
                const rows = json.map(row => ({
                    日付: row.日付,
                    時間: row.時間 + "-" + row.To,
                    コート: row.コート,
                    カナ: (row.x || row.s) ? "" : row.カナ,
                    "E" : "",
                    "F" : "",
                    "G" : "",
                    "H" : "",
                    "I" : "",
                    "J" : "",
                    "K" : ""
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
                    switch ((idx + 5) % 8) {
                        case 1:
                            if (worksheet["D" + idx]) worksheet["E" + (idx - 1)] = {v: worksheet["D" + idx].v};
                            break;
                        case 2:
                            if (worksheet["D" + idx]) worksheet["F" + (idx - 2)] = {v: worksheet["D" + idx].v};
                            break;
                        case 3:
                            if (worksheet["D" + idx]) worksheet["G" + (idx - 3)] = {v: worksheet["D" + idx].v};
                            break;
                        case 4:
                            if (worksheet["D" + idx]) worksheet["H" + (idx - 4)] = {v: worksheet["D" + idx].v};
                            break;
                        case 5:
                            if (worksheet["D" + idx]) worksheet["I" + (idx - 5)] = {v: worksheet["D" + idx].v};
                            break;
                        case 6:
                            if (worksheet["D" + idx]) worksheet["J" + (idx - 6)] = {v: worksheet["D" + idx].v};
                            break;
                        case 7:
                            if (worksheet["D" + idx]) worksheet["K" + (idx - 7)] = {v: worksheet["D" + idx].v};
                            break;
                        default:
                            break;
                    }                  
                });
                // タイトル
                worksheet["A1"] = {
                    v: this.date.year + "年" + this.date.month
                };
                worksheet["D1"] = {v: worksheet["C3"].v};
                worksheet["E1"] = {v: worksheet["C4"].v};
                worksheet["F1"] = {v: worksheet["C5"].v};
                worksheet["G1"] = {v: worksheet["C6"].v};
                worksheet["H1"] = {v: worksheet["C7"].v};
                worksheet["I1"] = {v: worksheet["C8"].v};
                worksheet["J1"] = {v: worksheet["C9"].v};
                worksheet["K1"] = {v: worksheet["C10"].v};
                
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
                delete_row(worksheet, 1)               
                let n = rows.length / 8
                for (let i = 1; i < n; i++) {
                    delete_row(worksheet, i + 1)
                    delete_row(worksheet, i + 1)
                    delete_row(worksheet, i + 1)
                    delete_row(worksheet, i + 1)
                    delete_row(worksheet, i + 1)
                    delete_row(worksheet, i + 1)
                    delete_row(worksheet, i + 1)
                }
                // 列削除
                this.delete_cols(worksheet, 2, 1)
                //
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "コート");         
                worksheet["!cols"] = [ { wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 } ];

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

                // Merge
                let merge = [];
                for (let i = 1; i < n; i = i + 3) {
                    let obj = { s: { r: i, c: 0 }, e: { r: i + 2, c: 0 } }
                    merge.push(obj)
                }
                worksheet["!merges"] = merge;

                /* create an XLSX file and try to save to *.xlsx */
                XLSX.writeFile(workbook, this.$t("Court") + this.date.year + ('0' + this.date.month.replace(/[^0-9]/g, '')).slice(-2) + '_' + this.formatDate(new Date(), 'yyMMdd') + '_B.xlsx');
            },
            downloadTypeC: async function() {
                const data = this.$refs.xlsxsheet

                const sheet = XLSX.utils.table_to_sheet(data);
                const json = XLSX.utils.sheet_to_json(sheet);
                const rows_ = json.map(row => ({
                    日付: row.日付,
                    時間: row.時間 + "-" + row.To,
                    コート: row.コート,
                    L: row.L
                }));
                const rows = rows_.filter(row => {
                    return row.L
                })
                /* generate worksheet and workbook */
                const worksheet = XLSX.utils.json_to_sheet(rows);
                // タイトル
                worksheet["A1"] = {
                    v: this.date.year + "年" + this.date.month
                };
                
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
                delete_row(worksheet, 1) 
                             
                //
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "コート");
                worksheet["!cols"] = [ { wch: 10 }, { wch: 12 }, { wch: 9 }, { wch: 4 } ];
                
                XLSX.writeFile(workbook, this.$t("OPAS予約") + this.date.year + ('0' + this.date.month.replace(/[^0-9]/g, '')).slice(-2) + '.xlsx');
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
</style>