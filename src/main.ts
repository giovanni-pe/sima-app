// src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import './assets/main.css'; // o './style.css', según tu estructura


createApp(App)
  .use(createPinia()) // 🟢  👉  equivale a <AuthProvider> + otros stores
  .use(router)        // 🟢  👉  equivale a usar <AppRouter />
  .mount('#app');

  ///