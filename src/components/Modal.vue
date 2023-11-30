<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useMainStore } from "../store/main";
import Products from "../components/Products.vue";
const mainStore = useMainStore();

let title = computed(() => mainStore.modal[mainStore.currentLanguage - 1]);
const showModal = computed(() => mainStore.showModal);
const changeShowModal = () => {
  mainStore.showModal = !mainStore.showModal;
};
</script>
<template>
  <div class="modal">
    <div class="modal-box">
      <div class="subtitle">
        <p>{{ title.title }}</p>
        <div class="close" @click="changeShowModal">
          <img src="../assets/images/close.png" alt="" />
        </div>
      </div>
      <div class="content-box">
        <Products></Products>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明的黑色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  .modal-box {
    padding: 20px 0;
    background-color: var(--background-color-2);
    border-radius: 10px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    width: 70%;
    .subtitle {
      padding-bottom: 20px;
      // font-family: "NotoSansCJKtc";
      font-weight: 500;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        margin-left: 30px;
      }
      .close {
        cursor: pointer;
        margin-right: 20px;
        &:hover {
          transform: scale(1.1); /* 放大模態內容 */
          transition: transform 0.3s;
        }
      }
    }
    .content-box {
      padding: 0 10%;
      // max-height: calc(90vh - 100px); /* 视窗高度减去标题栏高度 */
      height: 500px;
      overflow-y: auto;
    }
  }
  /* 自定义滚动条样式 */
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #b3b3b3;
  }
  ::-webkit-scrollbar-track {
    background-color: var(--background-color-2);
  }
}
@media (max-width: 768px) {
  .modal {
    .modal-box {
      .subtitle {
      }
    }
  }
}
</style>
