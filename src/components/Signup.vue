<template>
  <div>
    <h1>SING UP</h1>
    <div>
      <h3>E-mail</h3>
      <input type="text" placeholder="E-mail" v-model="email" />
    </div>
    <div>
      <h3>Password</h3>
      <input type="password" placeholder="Password" v-model="password" />
    </div>
    <button @click="createUserAccount">Sing UP!!</button>
  </div>
</template>

<script>
import firebase from "../firebase.js";
export default {
  name: "signup",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    createUserAccount() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert("Create Account");
        })
        .catch(error => {
          alert("Error!", error.message);
          console.error("Account Regeister Error", error.message);
        });
    }
  }
};
</script>