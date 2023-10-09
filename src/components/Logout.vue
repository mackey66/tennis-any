<template>
  <div>
    <button @click="accountDelete()">アカウント削除</button>
    <button @click="logout()">ログアウト</button>
  </div>
</template>

<script>
var firebase = require("firebase");

export default {
  name: "Logout",
  props: ["isLogin", "loginUser"],
  methods: {
    // ログアウト
    logout() {
      var vm = this;
      if (!firebase.auth().currentUser) {
        alert("ログインしてください。");
        return;
      }
      firebase
        .auth()
        .signOut()
        .then(function(res) {
          console.log("signOut", res);
          alert("ログアウトしました。");
          vm.$router.go();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    accountDelete() {
      var vm = this;
      // アカウント削除
      if (!firebase.auth().currentUser) {
        alert("ログインしてください。");
        return;
      }
      firebase
        .auth()
        .currentUser.delete()
        .then(function(res) {
          console.log("currentUser.delete", res);
          alert("アカウントを削除しました。");
          vm.$router.go();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>