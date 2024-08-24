<template>
  <nav>
    <ol class="breadcrumbs">
      <li v-for="(label, index) in breadcrumbLabels" :key="index">
        <router-link :to="breadcrumbRoutes[index]">{{ label }}</router-link>
        <span v-if="index < breadcrumbLabels.length - 1"> |</span>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      routeMappings: {
        separator: ' | ',
        home: 'Главная',
        catalog: 'Каталог',
        menu: 'Меню',
        login: 'Авторизация',
      },
    };
  },
  computed: {
    breadcrumbPaths() {
      return this.$route.path.split('/').filter(path => path);
    },
    breadcrumbLabels() {
      const labels = [];
      
      this.breadcrumbPaths.forEach((path, index) => {
        if (this.routeMappings[path]) {
          labels.push(this.routeMappings[path]);
        }
        if  (index === 1 && this.$route.params.productName) {
          labels.push(this.$route.params.productName);
        }
      });
      return labels;
    },
    breadcrumbRoutes() {
      const routes = [];
      let accumulatedPath = '';

      this.breadcrumbPaths.forEach((path, index) => {
        accumulatedPath += `/${path}`;

        if (path === 'catalog') {
          routes.push('/catalog');
        } else if (index === 1 && this.$route.params.productName) {
          routes.push(`/catalog/${this.$route.params.productName}`);
        } else {
          routes.push(accumulatedPath);
        }
      });
      return routes;
    },
  },
};
</script>


<style scoped>
nav {
  padding: 10px;
}

ol {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline;
  margin: 0 5px;
}
</style>
