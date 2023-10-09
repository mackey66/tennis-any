<template>
  <div>
    <h1>SING IN</h1>
    <div>
      <h3>E-mail</h3>
      <input type="text" placeholder="E-mail" v-model="email" />
    </div>
    <div>
      <h3>Password</h3>
      <input type="password" placeholder="Password" v-model="password" />
    </div>
    <button @click="userSingIn">Sing in Now!!</button>
  </div>
</template>

<script>
import firebase from "../firebase.js";
export default {
  name: "Signin",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    userSingIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert("ログイン成功!");
          this.$router.push("/mypage");
        });
    }
  }
};
</script>