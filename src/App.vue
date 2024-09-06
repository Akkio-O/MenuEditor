<template>
  <div class="menuEditor__navWrapper">
    <RouterLink to="/menu"><button>Меню</button></RouterLink>
    <RouterLink v-if="!isAuthenticated" to="/login">
      <button>Авторизация</button>
    </RouterLink>
    <RouterLink v-if="isAuthenticated" to="/home">
      <button @click="logout()">Выйти</button>
    </RouterLink>
  </div>
  <div style="margin-top: 75px;">
    <RouterView />
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router';
import { mapState, mapActions } from 'vuex';
import './css/menu.css';

export default {
  components: {
    RouterLink,
    RouterView,
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
    },
  },
}
</script>