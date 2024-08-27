<template>
    <div class="home">
      <header>
        <h1>Добро пожаловать на наш сайт!</h1>
        <p>Здесь вы можете найти лучшие товары по выгодным ценам.</p>
        <router-link to="/catalog" class="button">Перейти в каталог</router-link>
      </header>
    </div>
  </template>
  
  <script>
  export default {
    mounted() {
    if (this.$route.path !== '/MenuEditor') {
      this.$router.push('/MenuEditor');
    }
  }
  };
  </script>
  
  <style scoped>
  .home {
    text-align: center;
    padding: 20px;
  }
  
  .button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }
  </style>
  