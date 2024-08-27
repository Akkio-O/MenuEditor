<template>
  <nav>
    <RouterLink to="/home"><button>Главная</button></RouterLink>
    <RouterLink to="/catalog"><button>Каталог</button></RouterLink>
    <RouterLink to="/menu"><button>Меню</button></RouterLink>
    <RouterLink v-if="!isAuthenticated" to="/login">
      <button>Авторизация</button>
    </RouterLink>
    <RouterLink v-if="isAuthenticated" to="/home">
      <button @click="logout()">Выйти</button>
    </RouterLink>
  </nav>
  <nav>
    <BreadcrumbsComponent />
  </nav>
  <RouterView />
</template>

<script>
import BreadcrumbsComponent from './components/menu/BreadcrumbsComponent.vue';
import { RouterLink, RouterView } from 'vue-router';
import { mapState, mapActions } from 'vuex';
import './css/menu.css';

export default {
  components: {
    RouterLink,
    RouterView,
    BreadcrumbsComponent,
  },
  computed: {
    ...mapState(['isAuthenticated', 'role']),
  },
  methods: {
    ...mapActions(['setAuthenticated', 'setRole']),
    logout() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch('http://localhost:3000/logout', requestOptions)
        .then(response => {
          if (response.headers.get('Content-Type')?.includes('application/json')) {
            return response.json();
          } else {
            return response.text();
          }
        })
        .then(() => {
          this.setAuthenticated(false);
          this.setRole(null);
          this.$router.push('/MenuEditor');
        })
    }
  },
  watch: {
    isAuthenticated(newValue) {
      console.log('Состояние isAuthenticated изменилось:', newValue);
    },
  },
}
</script>