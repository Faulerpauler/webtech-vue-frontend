
<template>
  <div class="container">
    <h1>Spotify Playlist Generator</h1>
    <form @submit.prevent="getRecommendations">
      <div class="form-group">
        <label for="name">Name:</label>
        <input id="name" type="text" placeholder="Give your playlist a name" class="input-field" />
      </div>
      <div class="form-group">
        <label for="size">Size:</label>
        <input id="size" type="text" placeholder="Amount of tracks" class="input-field" />
      </div>
        <div class="form-group">
          <label for="genre">Genre:</label>
          <input id="genre" type="text" placeholder="Pick a genre" class="input-field" />
        </div>
      <div class="form-group">
        <label for="danceability">How danceable do you want the tracks to be?</label>
        <div class="slider-container">
          <VueSlider v-model="danceability" :min="0" :max="10" :step="0.01" class="slider" />
        </div>
      </div>
      <button type="submit" class="generate-button">Generate Playlist</button>
    </form>
    <div>
      <button id="redirectToSpotifyLogin" class="spotify-login-button">Login with Spotify</button>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import store from "@/store";
import router from "@/router";
//Redirect to Spotify Login when User presses the "Login with Spotify" Button
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('redirectToSpotifyLogin').addEventListener('click', function () {
    let client_id = process.env.VUE_APP_CLIENT_ID;
    let redirect_uri = 'http://localhost:3000/redirect';
    let scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public';
    let url = 'https://accounts.spotify.com/authorize';
    let state = generateRandomString(16);

    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    window.location = url
  });
});

//Generate Random String for Authentication request parameter "state"
function generateRandomString(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
export default {
  methods: {
    //Get the User ID of current User logged in for creating playlists on that account
    async getUser() {
      try {
        const token = this.authToken
        const response = await fetch('http://localhost:8080/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Received data from Spotify:', data);
          const user = data.id;
          await store.dispatch('updateUserId', user);
        } else
          console.error('Error fetching data from Spotify:', response.statusText);
      } catch (error) {
        console.error('Error fetching data from Spotify:', error);
      }
    },
    //Get a List of Tracks based on the users input
    async getRecommendations() {
      try {
        const token = this.authToken
        const limit = document.getElementById('size').value
        const genre = document.getElementById('genre').value
        const danceability = (this.danceability / 10)

        const response = await fetch(`http://localhost:8080/recommendations?seed_genres=${genre}&limit=${limit}&target_danceability=${danceability}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          await this.getUser()
          await this.createPlaylist()
          const data = await response.json();
          const trackIds = data.tracks.map(track => track.id);
          const jsonPayload = JSON.stringify({uris: trackIds.map(id => `spotify:track:${id}`)});
          const id = this.playlistId;
          const addResponse = await fetch(`http://localhost:8080/add?id=${id}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: jsonPayload,
          })
          if (addResponse.ok) {
            const addData = await addResponse.json();
            console.log(addData);
            this.savePlaylist();
          }

          console.log(jsonPayload);

          const tracks = data.tracks;
          for (const track of tracks) {
            const trackName = track.name;
            const artists = track.artists.map(artist => artist.name);
            console.log('Artist:', artists);
            console.log('Track:', trackName);
          }
        } else {
          console.error('Error fetching data from Spotify:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data from Spotify:', error);
      }
    },
    //Create a Playlist on the Users Account and add the songs provided by getRecommendations
    async createPlaylist() {
      try {
        const token = this.authToken
        const user = this.userId
        const name = document.getElementById('name').value
        const response = await fetch(`http://localhost:8080/create/playlist?name=${name}&user=${user}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const data = await response.json();
          const playlist = data.id;
          const link = data.external_urls.spotify;
          await store.dispatch('updatePlaylistId', playlist);
          await store.dispatch('updatePlaylistLink', link);

        } else {
          console.error('Error fetching data from Spotify:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data from Spotify:', error);
      }
    },
    //Save the playlist and the link to the playlist in the database
    savePlaylist() {
      const endpoint = 'http://localhost:8080/playlists'
      const data = {
        name: document.getElementById('name').value,
        link: this.playlistLink
      }
      const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      };
      fetch(endpoint, requestOptions)
          .then(saveResponse => saveResponse.json())
          .then(data => {
            console.log('Success', data)
            router.push('/success');
          })
          .catch(error => console.log('Errror', error))
    },
  },
  //Update Store Variables
  updateAuthToken() {
    this.$store.dispatch('updateAuthToken', 'New Value');
  },
  updateUserId(){
    this.$store.dispatch('updateUserId', 'New Value')
  },
  updatePlaylistId(){
    this.$store.dispatch('updatePlaylistId', 'NewValue')
  },
  updatePlaylistLink(){
    this.$store.dispatch('updatePlaylistLink', 'NewValue')
  },

  computed: {
    //Return Store Variables
    authToken() {
      return this.$store.getters.getAuthToken();
    },
    userId(){
      return this.$store.getters.getUserId();
    },
    playlistId(){
      return this.$store.getters.getPlaylistId();
    },
    playlistLink(){
      return this.$store.getters.getPlaylistLink();
    }
  },
  data() {
    return {
      danceability: 5,
      popularity: 5,
    };
  },
  components: {
    VueSlider
  },
}
</script>


<style scoped>
@import 'vue-slider-component/theme/default.css';

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
}
.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.generate-button,
.spotify-login-button {
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
}

.slider-container {
  margin-top: 10px;
  width: 100%;
}

.vue-slider-rail {
  background-color: whitesmoke;
  border-radius: 15px;
  transition: background-color 0.3s;
}

.vue-slider-process {
  background-color: #9cd5ff;
  border-radius: 15px;
  transition: background-color 0.3s;
}

.vue-slider-dot-handle {
  cursor: pointer;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #9cd5ff;
  transition: box-shadow 0.3s, border-color 0.3s;
}

.vue-slider-dot-handle:focus {
  border-color: #36abff;
  box-shadow: 0 0 0 5px rgba(54, 171, 255, 0.2);
}

.vue-slider-dot-handle:hover {
  border-color: #36abff;
}

.vue-slider-dot-tooltip {
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.vue-slider-dot-tooltip-inner {
  font-size: 14px;
  white-space: nowrap;
  padding: 6px 8px;
  color: #fff;
  border-radius: 5px;
  border-color: rgba(0, 0, 0, 0.75);
  background-color: rgba(0, 0, 0, 0.75);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: scale(0.9);
  transition: transform 0.3s;
}

.vue-slider-dot-tooltip-inner::after {
  content: "";
  position: absolute;
}

.vue-slider-dot-tooltip-inner-top::after {
  top: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  height: 0;
  width: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px;
  border-top-color: inherit;
}

.vue-slider-dot-tooltip-inner-bottom::after {
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  height: 0;
  width: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px;
  border-bottom-color: inherit;
}

.vue-slider-dot-tooltip-inner-left::after {
  left: 100%;
  top: 50%;
  transform: translate(0, -50%);
  height: 0;
  width: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px;
  border-left-color: inherit;
}

.vue-slider-dot-tooltip-inner-right::after {
  right: 100%;
  top: 50%;
  transform: translate(0, -50%);
  height: 0;
  width: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px;
  border-right-color: inherit;
}

.vue-slider-dot-tooltip-inner-top {
  transform-origin: 50% 100%;
}

.vue-slider-dot-tooltip-inner-bottom {
  transform-origin: 50% 0;
}

.vue-slider-dot-tooltip-inner-left {
  transform-origin: 100% 50%;
}

.vue-slider-dot-tooltip-inner-right {
  transform-origin: 0% 50%;
}

.vue-slider-dot:hover .vue-slider-dot-tooltip,
.vue-slider-dot-tooltip-show {
  opacity: 1;
  visibility: visible;
}

.vue-slider-dot:hover .vue-slider-dot-tooltip .vue-slider-dot-tooltip-inner,
.vue-slider-dot-tooltip-show .vue-slider-dot-tooltip-inner {
  transform: scale(1);
}
</style>
