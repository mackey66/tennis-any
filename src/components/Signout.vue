<template>
  <div>
    <h1>SING OUT</h1>
<<<<<<< HEAD
    <button @click="signout">Sing out Now!!</button>
=======
    <button @click="singout">Sing out Now!!</button>
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
  </div>
</template>

<script>
import firebase from "../firebase.js";
export default {
  name: "signout",
  methods: {
<<<<<<< HEAD
    signout() {
=======
    singout() {
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
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