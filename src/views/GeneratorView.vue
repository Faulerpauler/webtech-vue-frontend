<template>
  <div>
    <h1>Spotify Playlist Generator</h1>
    <form @submit.prevent="generatePlaylist">
      <div>
        <label for="name">Name:</label>
        <input id="name" type="text" />
      </div>
      <div>
        <label for="link">Link:</label>
        <input id="link" type="text" />
      </div>
      <button type="submit">Generate Playlist</button>
    </form>
    <input id="auth" type="button" value="Authenticate" onClick="getToken()"/>
  </div>
</template>

<script>

export default {
  methods: {
    generatePlaylist() {
        const endpoint = 'http://localhost:8080/playlists'
        const data = {
          name: document.getElementById('name').value,
          link: document.getElementById('link').value
        }
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        };
        fetch(endpoint, requestOptions)
            .then(response => response.json())
            .then(data => {
              console.log('Success', data)
            })
            .catch(error => console.log('Errror', error))
      },
    getToken() {
      const endpoint = 'https://accounts.spotify.com/api/token'
      const requestOptions ={
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic <959fab8dac94489ab0fd8dacbf109998:e60f4397f3a54e489cf7f5a03d11d35b>'
        },
        body: 'grant_type=client_credentials'
      }
      fetch(endpoint, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Succes', data)
          })
          .catch(error => console.log('Error', error))
    }
  }

};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 10px;
}
input {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
}
button {
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
