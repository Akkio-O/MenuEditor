<template>
  <nav>
    <ul class="breadcrumbs">
      <li v-if="breadcrumbPath.length > 0">
        <span>{{ breadcrumbLabels }}</span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    breadcrumbPath: {
      type: Array,
      required: true
    }
  },
  computed: {
    breadcrumbLabels() {
      return this.breadcrumbPath.join(' / ');
    }
  }
};
</script>

<style scoped>
nav {
  padding: 10px;
}
ol {
  list-style-type: none;
}
li {
  display: inline;
  margin: 0 5px;
}
</style>
