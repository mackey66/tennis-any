//import Vue from 'vue'
//import Router from 'vue-router'

//import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
//import { createRouter } from 'vue-router'

// 各view読み込み
import Main from '../views/Main.vue'
import MyPage from '../views/MyPage.vue'
import Login from '../views/Login.vue'
import Member from '../views/Member.vue'
import MemberLink from '../views/MemberLink.vue'
import Attendance from '../views/Attendance.vue'
import MemberAttendance from '../views/MemberAttendance.vue'
import GameEntries from '../views/GameEntries.vue'
import GameFinished from '../views/GameFinished.vue'
import Court from '../views/Court.vue'
import CourtSelect from '../views/CourtSelect.vue'
import CourtChange from '../views/CourtChange.vue'
import CourtDaily from '../views/CourtDaily.vue'
import CourtEntries from '../views/CourtEntries.vue'
import CourtEntriesSelect from '../views/CourtEntriesSelect.vue'
import CourtLottery from '../views/CourtLottery.vue'
import Individual from '../views/Individual.vue'
import MemberSelect from '../views/MemberSelect.vue'
import MemberEdit from '../views/MemberEdit.vue'
import Schedule from '../views/Schedule.vue'
import MemberSchedule from '../views/MemberSchedule.vue'
import Maintenance from '../views/Maintenance.vue'
import Reservation from '../views/Reservation.vue'
import Analysis from '../views/Analysis.vue'
import AnalysisSchedule from '../views/AnalysisSchedule.vue'
import Chat from '../views/Chat.vue'
import Config from '../views/Config.vue'
import Invite from '../views/Invite.vue'
import MemberNew from '../views/MemberNew.vue'
import ConfigSelect from '../views/ConfigSelect.vue'
import Opas from '../views/Opas.vue'
import AnalysisIndividual from '../views/AnalysisIndividual.vue'
import Privacy from '../views/Privacy.vue'
import Messages from '../views/Messages.vue'

// Firebase読み込み
import firebase from 'firebase'

//Vue.use(Router)

const routes = [
    {
        // ログインページ
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        // メインページ
        path: '/main',
        name: 'main',
        component: Main,
        meta: { requiresAuth: true }
    },
    {
        // マイページ
        path: '/mypage',
        name: 'mypage',
        component: MyPage,
        meta: { requiresAuth: true }
    },
    {
        // メンバー
        path: '/member',
        name: 'member',
        component: Member,
        meta: { requiresAuth: true }
    },
    {
        // メンバーリンク
        path: '/memberlink',
        name: 'memberlink',
        component: MemberLink,
        meta: { requiresAuth: true }
    },
    {
        // メンバー編集
        path: '/memberedit/:id',
        name: 'memberedit',
        component: MemberEdit,
        meta: { requiresAuth: true }
    },
    {
        // エントリー
        path: '/entry/:id',
        name: 'entry',
        component: Attendance,
        meta: { requiresAuth: true }
    },
    {
        // エントリーメンバー選択
        path: '/memberattendance',
        name: 'memberattendance',
        component: MemberAttendance,
        meta: { requiresAuth: true }
    },
    {
        // ゲーム
        path: '/game/:id',
        name: 'game',
        component: GameEntries,
        meta: { requiresAuth: true }
    },
    {
        // ゲームメンバー選択
        path: '/memberselect/:id',
        name: 'memberselect',
        component: MemberSelect,
        //props: true,
        meta: { requiresAuth: true }
    },
    {
        // コート選択
        path: '/courtselect',
        name: 'courtselect',
        component: CourtSelect,
        meta: { requiresAuth: true }
    },
    {
        // コート変更
        path: '/courtchange/:id',
        name: 'courtchange',
        component: CourtChange,
        meta: { requiresAuth: true }
    },
    {
        // 終了ゲーム
        path: '/gamefinished/:id',
        name: 'gamefinished',
        component: GameFinished,
        meta: { requiresAuth: true }
    },
    {
        // 予定
        path: '/schedule/:id',
        name: 'schedule',
        component: Schedule,
        meta: { requiresAuth: true }
    },
    {
        // 参加予定メンバー選択
        path: '/memberschedule/:id',
        name: 'memberschedule',
        component: MemberSchedule,
        meta: { requiresAuth: true }
    },
    {
        // メンテナンスメニュー
        path: '/maintenance',
        name: 'maintenance',
        component: Maintenance,
        meta: { requiresAuth: true }
    },
    {
        // コート
        path: '/court',
        name: 'court',
        component: Court,
        meta: { requiresAuth: true }
    },
    {
        // 今日のコート
        path: '/courtdaily/:id',
        name: 'courtdaily',
        component: CourtDaily,
        meta: { requiresAuth: true }
    },
    {
        // コート確保
        path: '/courtentries/:id',
        name: 'courtentries',
        component: CourtEntries,
        meta: { requiresAuth: true }
    },
    {
        // コート確保のコート選択
        path: '/courtentriesselect/:id',
        name: 'courtentriesselect',
        component: CourtEntriesSelect,
        meta: { requiresAuth: true }
    },
    {
        // コート確保
        path: '/courtlottery/:id',
        name: 'courtlottery',
        component: CourtLottery,
        meta: { requiresAuth: true }
    },
    {
        // 個別集計
        path: '/individual/:id',
        name: 'individual',
        component: Individual,
        meta: { requiresAuth: true }
    },
    {
        // 集計（エントリー）
        path: '/analysis/:id',
        name: 'analysis',
        component: Analysis,
        meta: { requiresAuth: true }
    },
    {
        // 集計（予定）
        path: '/analysisschedule/:id',
        name: 'analysisschedule',
        component: AnalysisSchedule,
        meta: { requiresAuth: true }
    },
    {
        // 集計（個別）
        path: '/analysisindividual',
        name: 'analysisindividual',
        component: AnalysisIndividual,
        meta: { requiresAuth: true }
    },
    {
        // OPAS
        path: '/reservation',
        name: 'reservation',
        component: Reservation,
        meta: { requiresAuth: true }
    },
    {
        // メッセージ
        path: '/messages/:id',
        name: 'messages',
        component: Messages,
        meta: { requiresAuth: true }
    },
    {
        // チャット
        path: '/chat',
        name: 'chat',
        component: Chat,
        meta: { requiresAuth: true }
    },
    {
        // 設定
        path: '/config',
        name: 'config',
        component: Config,
        meta: { requiresAuth: true }
    },
    {
        // 招待コード入力
        path: '/invite',
        name: 'invite',
        component: Invite,
        meta: { requiresAuth: true }
    },
    {
        // 新規メンバー
        path: '/membernew/:id',
        name: 'membernew',
        component: MemberNew,
        meta: { requiresAuth: true }
    },
    {
        // 設定の選択
        path: '/configselect',
        name: 'configselect',
        component: ConfigSelect,
        meta: { requiresAuth: true }
    },
    {
        // OPASリンク
        path: '/opas',
        name: 'opas',
        component: Opas,
        meta: { requiresAuth: true }
    },
    {
        // Privacy
        path: '/privacy',
        name: 'privacy',
        component: Privacy
    },
    {
        // リダイレクト
        path: '/',
        redirect: '/login'
    }
]

const router = createRouter({
  //history: createWebHashHistory(),
  history: createWebHistory(),
  routes
})

// ナビゲーションの前に実行
router.beforeEach((to, from, next) => {
    // ログインの有無判断
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth) {
        firebase.auth().onAuthStateChanged(function (user) {
          //console.log('user = ' + user)
          if (user) {
              // ログイン時は各ページに移動
              next()
          } else {
              // 未ログイン時はログイン画面にリダイレクト
              next({
                  path: '/login'
              })
          }
        })
    } else {
        next()
    }
});

export default router