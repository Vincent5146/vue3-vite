<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useMainStore } from "../store/main";
import { useRoute } from "vue-router";

const route = useRoute();
const mainStore = useMainStore();

const language = computed(() => mainStore.currentLanguage);
const lang = computed(() => mainStore.className[language.value - 1]);

const active = ref("");

const checkRoute = () => {
  if (route.path === "/") {
    active.value = "home";
  } else if (route.path === "/contact") {
    active.value = "contact";
  } else if (route.path === "/company") {
    active.value = "company";
  } else {
    active.value = "normal";
  }
};
let currentNav = computed(() => mainStore.navButtons[mainStore.currentLanguage - 1]);
let currentFind = computed(() => mainStore.nevFind[mainStore.currentLanguage - 1].name);
// let currentShare = computed(() => mainStore.shareButton[mainStore.currentLanguage - 1]);
let currentShare = computed(() => {
  const { fb, ig, x, weibo } = mainStore.languagesData[mainStore.currentLanguage - 1];
  return { fb, ig, x, weibo };
});
const changeShowModal = () => {
  mainStore.showModal = !mainStore.showModal;
};

const option = ref("ENGLISH");
const languages = computed(() => mainStore.languagesData);

const checkLanguage = () => {
  const foundLanguage = languages.value.find(
    (item) => item.language_id == mainStore.currentLanguage,
  );
  option.value = foundLanguage.name;
};

watch(
  () => route.path,
  () => {
    checkRoute();
  },
);
onMounted(() => {
  checkLanguage();
  checkRoute();
});
</script>

<template>
  <div class="footer" :class="[active]">
    <div class="top">
      <router-link class="home" :to="{ name: 'home' }">
        <img src="../assets/images/footer_logo.png" alt="" />
      </router-link>
      <div class="box">
        <div class="buttons">
          <router-link
            class="button"
            v-for="(value, key) in currentNav"
            :key="key"
            :to="{ name: key.toLowerCase(), query: { lang: lang } }"
          >
            {{ value }}
          </router-link>
        </div>
        <div class="media">
          <a
            v-for="(item, key) in currentShare"
            :key="key"
            :href="item"
            target="_blank"
            class="icon"
            :class="key"
          >
            <img
              v-if="item !== null && item !== '' && item !== undefined && key === 'fb'"
              src="../assets/images/fb.png"
              alt=""
            />
            <img
              v-if="item !== null && item !== '' && item !== undefined && key === 'ig'"
              src="../assets/images/ig.png"
              alt=""
            />
            <img
              v-if="item !== null && item !== '' && item !== undefined && key === 'x'"
              src="../assets/images/twitter.png"
              alt=""
            />
            <img
              v-if="item !== null && item !== '' && item !== undefined && key === 'weibo'"
              src="../assets/images/weibo.png"
              alt=""
            />
          </a>
        </div>
      </div>
    </div>
    <div class="subtitle">
      <p>Copyright © 2023 SpinFit Trading Limited. All rights reserved.</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .top {
    padding: 50px 0;
    width: 100%;
    background-color: #636363;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .home {
      width: 8%;
    }
    .box {
      padding-left: 20%;
      border-left: 1px solid var(--border-color-2);
      width: 10%;
      .buttons {
        .button {
          margin-bottom: 10%;
          // font-family: "NotoSansCJKtc";
          font-weight: 500;
          font-size: 15px;
          line-height: 0.78;
          letter-spacing: 0.9px;
          text-align: left;
          text-decoration: none;
          color: var(--text-color-2);
          display: block;
        }
      }
      .media {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .icon {
          margin-top: 5%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fb {
          margin-right: 15px;
          width: 10%;
        }
        .ig {
          margin-right: 15px;
          width: 18%;
        }
        .x {
          margin-right: 15px;
          width: 18%;
        }
        .weibo {
          width: 18%;
        }
      }
    }
  }
  .subtitle {
    padding: 30px 0;
    text-align: center;
    text-decoration: none;
  }
}
@media (max-width: 1440px) {
  .footer {
    .top {
      .box {
        width: 12%;
      }
    }
  }
}
@media (max-width: 1280px) {
  .footer {
    .top {
      .box {
        width: 15%;
      }
    }
  }
}
@media (max-width: 768px) {
  .footer {
    .top {
      display: flex;
      align-items: center;
      justify-content: center;
      .home {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 50%;
        }
      }
      .box {
        border-left: 1px solid var(--border-color-2);
        padding-left: 0%;
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: normal;
        justify-content: center;
        .buttons {
          width: 75%;
          margin-left: auto;
          .button {
            font-size: 2.1vw;
          }
        }
        .media {
          width: 75%;
          margin-left: auto;
          justify-content: flex-start;
          .icon {
            margin-top: 0%;
          }
          .fb {
            margin-right: 5.5%;
            width: 6%;
          }
          .ig {
            margin-right: 5%;
            width: 11%;
          }
          .x {
            margin-right: 5.5%;
            width: 11%;
          }
          .weibo {
            width: 11%;
          }
        }
      }
    }
    .bottom {
      font-size: 21px;
    }
  }
}
</style>
