import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

const lastRoute = localStorage.getItem('lastRoute');
router.beforeEach((to) => {
  localStorage.setItem('lastRoute', to.fullPath);
});
if (lastRoute && router.resolve(lastRoute).matched.length > 0) {
  router.replace(lastRoute);
}
app.use(router);
app.use(store);
app.mount('#app');
