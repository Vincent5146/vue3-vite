<script setup>
import { ref, computed, onMounted } from "vue";
import { useMainStore } from "../store/main";
import Products from "../components/Products.vue";
const mainStore = useMainStore();

let title = computed(() => mainStore.navButtons[mainStore.currentLanguage - 1].PRODUCT);
let subtitle = computed(() => mainStore.product[mainStore.currentLanguage - 1].subtitle);
</script>
<template>
  <div class="container">
    <div class="products-box">
      <div class="title-box">
        <div class="title">{{ title }}</div>
        <div class="subtitle">{{ subtitle }}</div>
      </div>
      <Products></Products>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  background-color: var(--background-color-1);
  .products-box {
    padding: 7% 2% 0 15%;
    box-sizing: border-box;
    border-right: 1px solid var(--border-color);
    background-color: var(--background-color-2);
    width: 85%;
    .title-box {
      display: flex;
      align-items: center;
      .title {
        margin-right: 1%;
      }
    }
  }
}
@media (max-width: 768px) {
  .container {
    .products-box {
      padding: 7% 10% 0 18%;
    }
  }
}
</style>
