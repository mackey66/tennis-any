<template>
  <div>
    <h1>SING OUT</h1>
    <button @click="signout">Sing out Now!!</button>
  </div>
</template>

<script>
import firebase from "../firebase.js";
export default {
  name: "signout",
  methods: {
    signout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          alert("Logout!");
        })
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>