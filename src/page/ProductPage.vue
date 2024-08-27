<template>
  <div class="product-page">
    <h1>{{ name }}</h1>
    <p>Цена: {{price}} ₽</p>
    <p>Описание?</p>
    <router-link to="/catalog" class="button">Назад к каталогу</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: null,
      id: this.$route.params.productId,
      name: this.$route.params.productName,
      price: this.$route.params.productPrice,
    };
  },
};
</script>

<style scoped>
.product-page {
  padding: 20px;
}

.product-page h1 {
  font-size: 24px;
}

.product-page .button {
  padding: 10px 15px;
  background-color: black;
  color: white;
  border: 1px solid black;
  text-decoration: none;
  border-radius: 5px;
  display: inline-block;
  transition: all .4s;
}
.product-page .button:hover {
  background-color: white;
  color: black;
}
</style>
