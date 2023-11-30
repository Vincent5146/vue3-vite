<script setup>
import { ref, watch, computed, watchEffect, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useMainStore } from "./store/main";
import { useRoute, useRouter } from "vue-router";
import { useMeta } from "vue-meta";
import axios from "axios";
import {
  apiGetLanguages,
  apiGetHome,
  apiGetAbout,
  apiGetNewsTypes,
  apiGetNewsList,
  apiGetFAQ,
  apiGetService,
  apiGetMarkets,
  apiGetProductBrands,
  apiGetProductList,
} from "./api/index";
import Loading from "./components/Loading.vue";
import Scrolltop from "./components/Scrolltop.vue";

const mainStore = useMainStore();
const route = useRoute();
const router = useRouter();

const fontReady = ref(false);
const language = computed(() => mainStore.currentLanguage);

const checkRouteLang = () => {
  if (route.query.lang === "en") {
    mainStore.currentLanguage = 1;
  } else if (route.query.lang === "zh") {
    mainStore.currentLanguage = 2;
  } else if (route.query.lang === "sc") {
    mainStore.currentLanguage = 3;
  } else if (route.query.lang === "jp") {
    mainStore.currentLanguage = 4;
  }
};

const lang = computed(() => mainStore.className[language.value - 1]);
// const description = ["en", "zh", "sc", "jp"];

// useMeta({
//   description: description[language.value - 1],
//   htmlAttrs: { lang: lang.value },
// });

const handleResize = () => {
  mainStore.windowWidth = window.innerWidth;
};

const handleMobileCheck = () => {
  mainStore.isMobile = window.matchMedia("(max-width: 768px)").matches;
};

const isLoading = computed(() => mainStore.isLoading);
watchEffect(() => {
  window.addEventListener("resize", handleResize);
  handleMobileCheck();
  window.addEventListener("resize", handleMobileCheck);
  // 在 watchEffect 返回一个清理函数，用于在组件卸载时清除事件监听
  return () => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("resize", handleMobileCheck);
  };
});

const getLanguagesData = () => {
  apiGetLanguages()
    .then((res) => {
      mainStore.languagesData = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getHomeData = () => {
  apiGetHome({
    params: {
      language: language.value,
    },
  })
    .then((res) => {
      mainStore.homeData = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getAboutData = () => {
  apiGetAbout({
    params: {
      language: language.value,
    },
  })
    .then((res) => {
      mainStore.aboutData = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getNewsTypesData = () => {
  apiGetNewsTypes({
    params: {
      language: language.value,
    },
  })
    .then((res) => {
      mainStore.newsCategoryData = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getNewsListData = () => {
  apiGetNewsList({
    params: {
      language: language.value,
      news_type_id: null,
    },
  })
    .then((res) => {
      mainStore.newsListData = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getFAQData = () => {
  apiGetFAQ({
    params: {
      language: language.value,
    },
  })
    .then((res) => {
      mainStore.faqData = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getServiceData = () => {
  apiGetService({
    params: {
      language: language.value,
    },
  })
    .then((res) => {
      mainStore.serviceData = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getMarketsData = () => {
  apiGetMarkets({
    params: {
      language: language.value,
    },
  })
    .then((res) => {
      mainStore.marketsData = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
};
const getProductBrandsData = () => {
  apiGetProductBrands()
    .then((res) => {
      mainStore.productBrandsData = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
};
// const getProductListData = () => {
//   apiGetProductList({
//     params: {
//       language: language.value,
//     },
//   })
//     .then((res) => {
//       mainStore.productListData = res.data.message;
//       console.log("change");
//       console.log(mainStore.productListData);
//       // mainStore.showProductListData = res.data.message;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
const getHomeProductListData = () => {
  apiGetProductList({
    params: {
      language: language.value,
      home: "1",
    },
  })
    .then((res) => {
      mainStore.homeShowProductListData = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
};
watch(
  () => route.query.lang,
  () => {
    checkRouteLang();
  },
);
watch(
  () => mainStore.currentLanguage,
  () => {
    getLanguagesData();
    getHomeData();
    getAboutData();
    getNewsTypesData();
    getNewsListData();
    getFAQData();
    getServiceData();
    getMarketsData();
    getProductBrandsData();
    // getProductListData();
    getHomeProductListData();
    nextTick(() => {
      window.reload;
    });
  },
);
onMounted(() => {
  checkRouteLang();
  mainStore.isLoading = true;
  document.fonts.ready.then(() => {
    fontReady.value = true;
  });
  getLanguagesData();
  getHomeData();
  getAboutData();
  getNewsTypesData();
  getNewsListData();
  getFAQData();
  getServiceData();
  getMarketsData();
  getProductBrandsData();
  // getProductListData();
  getHomeProductListData();
  setTimeout(() => {
    mainStore.isLoading = false;
  }, 1000);
  window.addEventListener("resize", handleResize);
  handleMobileCheck();
  window.addEventListener("resize", handleMobileCheck);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("resize", handleMobileCheck);
});
</script>

<template>
  <div>
    <metainfo>
      <template v-slot:description="{ content }">{{ content }}</template>
    </metainfo>
    <Loading v-if="isLoading" />
    <div :class="lang" v-else>
      <router-view v-if="fontReady" />
      <Scrolltop />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
