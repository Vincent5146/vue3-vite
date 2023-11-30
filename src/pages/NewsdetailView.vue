<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMainStore } from "../store/main";
import { apiGetProduct, apiGetNews } from "../api/index";

const mainStore = useMainStore();
const route = useRoute();

let newsDetailData = ref(mainStore.newsDetailData);
let newsCategoryData = ref(mainStore.newsCategoryData);

let product = computed(() => newsDetailData.value);
let content = computed(() => newsDetailData.value.content);
let category = computed(() =>
  Object.values(newsCategoryData.value).find(
    (item) => item.news_type_id === newsDetailData.value.news_type_id,
  ),
);
const getNewsDetail = async () => {
  try {
    const res = await apiGetNews({
      params: {
        id: route.params.id,
      },
    });
    mainStore.newsDetailData = res.data.message;
  } catch (err) {
    console.log(err);
  }
};
watch(
  () => mainStore.newsDetailData,
  () => {
    newsDetailData.value = mainStore.newsDetailData;
  },
);
onMounted(async () => {
  // mainStore.currentLanguage = route.query.lang;
  if (route.params.id) {
    await getNewsDetail();
  }
});
</script>
<template>
  <div class="container" v-if="mainStore.newsDetailData">
    <div class="title-box">
      <div class="category subtitle">NEWS | {{ category ? category.name : "" }}</div>
      <div class="title">
        {{ product.title }}
        <span class="subtitle">{{
          product.news_date
            ? `${product.news_date.split("-")[1]}-${product.news_date.split("-")[2]}`
            : ""
        }}</span>
      </div>
    </div>
    <div class="top-box">
      <img :src="product.banner" alt="" />
    </div>
    <div class="bottom-box">
      <div class="left"></div>
      <div class="content-box">
        <div class="up" v-html="content"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  background-color: var(--background-color-1);
  box-sizing: border-box;
  .title-box {
    background-color: var(--background-color-2);
    margin: 0 auto;
    padding: 7% 17.5% 7% 19.5%;
    box-sizing: border-box;
    .title {
      margin-top: 1%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        width: 20%;
      }
    }
  }
  .bottom-box {
    border-top: 1px solid var(--border-color);
    background-color: var(--background-color-2);
    display: flex;
    .left {
      width: 17.5%;
      border-right: 1px solid var(--border-color);
      background-color: var(--background-color-1);
    }
    .content-box {
      margin-bottom: 5%;
      padding-left: 3%;
      width: 60%;
      box-sizing: border-box;
      .up {
        margin-top: 5%;
      }
      :deep(br) {
        content: "";
        display: block;
        margin: 10px 0;
      }
      :deep(h1) {
        margin-bottom: 10px;
        margin-bottom: 2%;
        letter-spacing: 1.3px;
        font-size: 1.4vw;
        font-weight: 500;
        color: var(--text-color-1);
        span {
          display: block;
        }
      }
      :deep(h2) {
        margin-bottom: 10px;
        line-height: 1.2;
        font-size: 1.2vw;
        letter-spacing: 1.3px;
        font-weight: 500;
        color: var(--text-color-1);
        span {
          display: block;
        }
      }
      :deep(em) {
        font-style: italic;
      }
      :deep(strong) {
        font-weight: bold;
      }
      :deep(p) {
        margin-bottom: 10px;
        line-height: 1.2;
        font-size: 1.05vw;
        letter-spacing: 1.1px;
        font-weight: 300;
        color: var(--text-color-1);
        span {
          display: block;
        }
      }
      :deep(ul) {
        margin-left: 4%;
        li {
          margin-bottom: 10px;
          line-height: 1.2;
          font-size: 1.05vw;
          letter-spacing: 1.1px;
          font-weight: 300;
          color: var(--text-color-1);
          p {
            display: block;
          }
          span {
            display: block;
          }
        }
      }
      :deep(ol) {
        margin-left: 4%;
        li {
          margin-bottom: 10px;
          font-size: 1.2vw;
          line-height: 1.2;
          letter-spacing: 1.3px;
          font-weight: 300;
          color: var(--text-color-1);
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .container {
    .bottom-box {
      .left {
        width: 15%;
      }
      .content-box {
        margin-bottom: 5%;
        padding-left: 5%;
        width: 80%;
        box-sizing: border-box;
        .up {
          margin-top: 10%;
        }
        :deep(br) {
          content: "";
          display: block;
          margin: 15px 0;
        }
        :deep(h1) {
          margin-bottom: 10px;
          font-size: 3.2vw;
          letter-spacing: 1.1px;
        }
        :deep(h2) {
          margin-bottom: 10px;
          font-size: 2.8vw;
          letter-spacing: 1.1px;
        }
        :deep(p) {
          margin-bottom: 10px;
          font-size: 2.8vw;
          letter-spacing: 1.1px;
        }
        :deep(ul) {
          li {
            margin-bottom: 10px;
            font-size: 2.8vw;
            letter-spacing: 1.1px;
          }
        }
        :deep(ol) {
          li {
            margin-bottom: 10px;
            font-size: 2.8vw;
            letter-spacing: 1.1px;
          }
        }
      }
    }
  }
}
</style>
