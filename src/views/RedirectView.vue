<template>
  <div>
    <h1>Login succesful!</h1>
  </div>
  <div>
    <button id="back">Go back to the Generator</button>
  </div>
</template>

<script>
import store from "@/store";
import router from "@/router";

let urlFragment = window.location.hash.substring(1);
let params = new URLSearchParams(urlFragment);
let accessToken = params.get('access_token');
store.dispatch('updateAuthToken', accessToken);

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('back').addEventListener('click', function () {
    router.push('/');
  });
});
export default {
  computed: {
    authToken() {
      return this.$store.getters.getAuthToken;
    },
  },
  methods: {
    updateAuthToken() {
      this.$store.dispatch('updateAuthToken', accessToken);
    },
  },
};
</script>
