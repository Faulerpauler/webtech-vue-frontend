<template>
  <div class="archive">
    <h1>These playlists have been generated so far</h1>
    <div class="table-container">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      playlists: []
    };
  },
  created() {
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

<style scoped>
.archive {
  text-align: center;
}

.table-container {
  display: inline-block;
  text-align: left;
  margin: 0 auto;
}
</style>