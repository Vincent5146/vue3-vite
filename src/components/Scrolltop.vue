<script setup>
import { ref, defineEmits, watch, onMounted } from "vue";

const screenTimer = ref(0);
const screenY = ref(0);

const handleScroll = () => {
  if (screenTimer.value) return;
  screenTimer.value = setTimeout(() => {
    screenY.value = window.scrollY;
    clearTimeout(screenTimer.value);
    screenTimer.value = 0;
  }, 100);
};
const toTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
</script>
<template>
  <div id="pagetop" class="button" v-show="screenY > 600" @click="toTop">
    <img src="../assets/images/scroll_top.png" alt="" />
  </div>
</template>
<style lang="scss" scoped>
.button {
  position: fixed;
  bottom: 50px;
  right: 40px;
  width: 60px;
  cursor: pointer;
}
</style>
