<template>
    <div class='menu'>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <span class="navbar-brand">{{ $store.state.name }}</span>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="goMenu()"><fa icon="bars" />&ensp;{{ $t("Menu") }}<span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="goAttendance()"><fa icon="clipboard" />&ensp;{{ $t("Entry") }}<span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="goGameEntries()"><fa icon="running" />&ensp;{{ $t("Game") }}<span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="goRanking()"><fa icon="trophy" />&ensp;{{ $t("Ranking") }}<span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="goMember()"><fa icon="address-card" />&ensp;{{ $t("Member") }}<span class="sr-only">(current)</span></a>
                    </li>
                    <li v-if='admin' class="nav-item">
                        <a class="nav-link" href="#" @click="goMaintenance()"><fa icon="wrench" />&ensp;{{ $t("Maintenance") }}<span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="goMyPage()"><fa icon="user-cog" />&ensp;{{ $t("MyPage") }}<span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click="logout()"><fa icon="sign-out-alt" />&ensp;{{ $t("Logout") }}</a>
                    </li>
                </ul>
            </div>
        </nav>

    
        
    </div>
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase';
    import { db } from "../main";

    export default {
        name: 'Menu',
        data() {
            return {
                admin: false
            }
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
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
            });
        },
        methods: {
            logout: function () {
                // Session Strageをクリア
                this.$store.commit('setConfig', null)
                this.$store.commit('setName', null)
                this.$store.commit('setTopTitle', null)
                this.$store.commit('setOfficialUrl', null)
                this.$store.commit('setOfficialTitle', null)
                this.$store.commit('setOpas', false)
                this.$store.commit('setAdmin', false)
                this.$store.commit('setInvite', false)
                // ログアウト処理
                firebase.auth().signOut();
            },
            goMenu: function() {
                this.$router.push({ name: 'main' })
                //this.$router.push(`/main`);
            },
            goAttendance: function() {
                this.$router.push({ name: 'entry', params: { id: new Date() } });
            },
            goGameEntries: function() {
                this.$router.push({ name: 'game', params: { id: new Date() } });
            },
            goRanking: function() {
                this.$router.push({ name: 'analysisindividual' });
            },
            goMember: function() {
                if (this.admin) {
                    this.$router.push(`/member`);
                } else {                  
                    this.$router.push(`/member?active=1`);
                }
            },
            goMaintenance: function() {
                this.$router.push({ name: 'maintenance' })
            },
            goMyPage: function() {
                this.$router.push({ name: 'mypage' })
            }
        }
    }
</script>

<style scoped>
    .dropdown-link-color {
        color: #212529;
    }
    .dropdown-link-color:hover{
        text-decoration: none;
    }
    .link-color {
        color: rgba(255,255,255,.5);
    }
    .link-color:hover{
        text-decoration: none;
        color: rgba(255,255,255,.8);
    }
</style>