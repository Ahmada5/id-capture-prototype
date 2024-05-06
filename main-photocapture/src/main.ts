import { createApp } from 'vue';
import App from './App.vue';
import router from '../src/routers/Indexrouter'; // Import your router instance
import Vuetify from './plugins/Vuetify';
import './style.css';

createApp(App)
  .use(router)
  .use(Vuetify) // Use Vuetify
  .mount('#app');
