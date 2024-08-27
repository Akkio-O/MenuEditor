<template>
  <div class="catalog">
    <h2>Каталог товаров</h2>
    <div class="products">
      <div v-for="product in products" :key="product.id" class="product">
        <h3>{{ product.name }}</h3>
        <p>Цена: {{ product.price }}₽</p>
        <router-link :to="productLink(product)" class="button">Посмотреть</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      separator: '/',
      products: [
        { id: 1, name: 'Товар 1', price: 100 },
        { id: 2, name: 'Товар 2', price: 200 },
        { id: 3, name: 'Товар 3', price: 300 },
        { id: 4, name: 'Товар 4', price: 400 },
      ]
    };
  },
  computed: {
    currentPath() {
      return this.$route.path;
    },
    breadcrumbPaths() {
      return this.currentPath.split('/').filter(path => path);
    }
  },
  methods: {
    productLink(product) {
      return `${this.currentPath}/${product.name}/${product.price}/id=${product.id}`;
    }
  },
  mounted() {
    if (this.$route.path !== '/MenuEditor') {
      this.$router.push('/MenuEditor');
    }
  }
};
</script>

<style scoped>
.catalog {
  padding: 20px;
}

.products {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.product {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin: 10px;
  text-align: center;
}

.button {
  padding: 10px 15px;
  background-color: black;
  border: 1px solid black;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: all .4s;
}

.button:hover {
  background-color: white;
  color: black;
}

@media (max-width: 420px) {
  .product {
    width: 100%;
  }
}
</style>