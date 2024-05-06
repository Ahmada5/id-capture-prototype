<template>
    <div>
        <form @submit.prevent="submitForm">
            <input type="file" ref="fileInput">
            <button type="submit">Upload</button>
        </form>
        <div>
            <button @click="getData">Get Data</button>
            <p>{{ responseData }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            responseData: ''
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
        async getData() {
            try {
                const response = await axios.get('http://localhost:3000/files');
                this.responseData = response.data;
            } catch (error) {
                console.error('Error fetching data', error);
            }
        }
    }
};
</script>
