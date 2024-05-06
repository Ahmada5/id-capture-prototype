<template>
  <div>
    <div class="d-flex">
      <form @submit.prevent="submitForm">
        <input type="file" ref="fileInput">
        <button type="submit">Upload</button>
      </form>
    </div>
    <div>
      <button @click="getFiles">Get Files</button>
      <ul v-if="files.length">
        <li v-for="(file, index) in files" :key="index">
          {{ file }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      files: []
    };
  },
  methods: {
    async submitForm() {
      const formData = new FormData();
      formData.append('file', this.$refs.fileInput.files[0]);

      try {
        await axios.post('http://localhost:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file', error);
      }
    },
    async getFiles() {
      try {
        const response = await axios.get('http://localhost:3000/files');
        this.files = response.data;
      } catch (error) {
        console.error('Error fetching files', error);
      }
    }
  }
};
</script>
