<script setup>
import { computed } from "vue";
import { useMainStore } from "../store/main";
import Footer from "../components/Footer.vue";
import Navbar from "../components/Navbar.vue";
import Modal from "../components/Modal.vue";

const mainStore = useMainStore();
const showModal = computed(() => mainStore.showModal);
</script>

<template>
  <Navbar />
  <Modal v-if="showModal"></Modal>
  <router-view />
  <Footer />
</template>

<style lang="scss" scoped></style>
