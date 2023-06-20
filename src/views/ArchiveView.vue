<template>
  <div class="archive">
    <h1>These playlists have been generated so far</h1>
    <h1>Playlists</h1>
    <table>
      <thead>
      <tr>
        <th>Playlist Name</th>
        <th>Playlist Link</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="playlist in playlists" :key="playlist.id">
        <td>{{ playlist.name }}</td>
        <td><a :href="playlist.link" target="_blank">{{ playlist.link }}</a></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playlists: [] // Initialize playlists as an empty array
    };
  },
  created() {
    // Perform the GET request to fetch the playlists
    this.fetchPlaylists();
  },
  methods: {
    async fetchPlaylists() {
      try {
        const response = await fetch('http://localhost:8080/playlists');
        this.playlists = await response.json();
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    }
  }
};
</script>
