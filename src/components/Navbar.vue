<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useMainStore } from "../store/main";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();

const language = computed(() => mainStore.currentLanguage);
const lang = computed(() => mainStore.className[language.value - 1]);

const active = ref("");
const menuOpen = ref(false);

const checkRoute = () => {
  active.value = route.name;
};

let currentNav = computed(() => mainStore.navButtons[mainStore.currentLanguage - 1]);
let currentFind = computed(() => {
  if (mainStore.isMobile) {
    return mainStore.nevFind[mainStore.currentLanguage - 1].mobile.name;
  } else {
    return mainStore.nevFind[mainStore.currentLanguage - 1].pc.name;
  }
});
const changeShowModal = () => {
  mainStore.showModal = !mainStore.showModal;
};

// 手機板下拉選單
let visible = ref(false);

const option = ref("ENGLISH");
const languages = computed(() => mainStore.languagesData);

const toggle = () => {
  visible.value = !visible.value;
};
const select = (item) => {
  if (route.name === "newsdetail") {
    router.push({ name: "news" });
  } else {
    option.value = item.name;
    mainStore.currentLanguage = item.language_id;
    router.push({ path: route.name, query: { lang: lang.value } });
  }
};
const checkLanguage = () => {
  const foundLanguage = languages.value.find(
    (item) => item.language_id == mainStore.currentLanguage,
  );
  option.value = foundLanguage.name;
};

// 全域點擊事件監聽器
const handleClickOutside = (event) => {
  const isClickInside = event.target.closest(".aselect");
  if (!isClickInside) {
    visible.value = false;
  }
};

const showMList = () => {
  if (mainStore.isMobile) {
    menuOpen.value = false;
  }
};
watch(
  () => route.path,
  () => {
    checkRoute();
  },
);
watch(
  () => mainStore.currentLanguage,
  () => {
    checkLanguage();
  },
);
onMounted(() => {
  checkLanguage();
  checkRoute();
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <div class="navbar">
    <input type="checkbox" id="nav-check" />
    <router-link
      class="home"
      :class="[menuOpen ? 'opacity' : '']"
      :to="{ name: 'home', query: { lang: lang } }"
    >
      <img src="../assets/images/logo.png" alt="" />
    </router-link>
    <div class="right-box">
      <div class="buttons" :class="[menuOpen ? 'active' : '']">
        <router-link
          class="link"
          :class="[active === key.toLowerCase() ? 'at' : '']"
          v-for="(value, key) in currentNav"
          :key="key"
          :to="{ name: key.toLowerCase(), query: { lang: lang } }"
          @click="showMList()"
        >
          {{ value }}
        </router-link>
      </div>
      <div class="search" @click="changeShowModal()" v-if="!menuOpen">
        <div class="img">
          <img src="../assets/images/navbar_icon.png" alt="" />
        </div>
        <div class="title small">{{ currentFind }}</div>
      </div>
      <div class="aselect">
        <div class="selector" @click="toggle()">
          <div class="icon">
            <img src="../assets/images/language_icon.png" alt="" />
          </div>
          <div class="label">
            <span>{{ option }}</span>
          </div>
          <div class="arrow" :class="{ expanded: visible }">
            <img src="../assets/images/qa_close.png" alt="" />
          </div>
          <div :class="{ hidden: !visible, visible }">
            <ul>
              <li
                class="subtitle"
                :class="{ current: item === option }"
                v-for="item in languages"
                @click="select(item)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-btn" @click="menuOpen = !menuOpen">
      <label for="nav-check" :class="[menuOpen ? 'active' : '']">
        <span class="top"></span>
        <span class="mid"></span>
        <span class="bottom"></span>
      </label>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.navbar {
  padding: 1.5% 4%;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--background-color-1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5;
  .home {
    width: 10%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .right-box {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    .buttons {
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .link {
        margin-right: 4%;
        // font-family: "NotoSansCJKtc";
        font-weight: 500;
        font-size: 0.8vw;
        line-height: 0.78;
        letter-spacing: 0.9px;
        text-align: center;
        text-decoration: none;
        color: var(--text-color-1);
      }
    }
    .search {
      margin-right: 1%;
      padding: 0.3% 1%;
      width: 12.5%;
      min-width: 220px;
      border: 2px solid var(--border-color-3);
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .img {
        margin-right: 1%;
        width: 9.5%;
      }
      .small {
        border: none;
        outline: none;
        background-color: var(--background-color-1);
        width: 100%;
        font-size: 13px;
        letter-spacing: 0.7px;
        // font-family: "NotoSansCJKtc-Thin";
        font-weight: 300;
        font-weight: normal;
      }
    }
    .aselect {
      width: 10%;
      .selector {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
        .icon {
          position: absolute;
          left: 8%;
          top: 50%;
          transform: translateY(-50%);
          width: 15%;
        }
        .arrow {
          position: absolute;
          right: 8%;
          top: 40%;
          width: 10%;
          transform: rotateZ(0deg) translateY(0px);
          transition-duration: 0.3s;
          transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
        }
        .expanded {
          transform: rotateZ(180deg) translateY(2px);
        }
        .label {
          padding: 5% 9%;
          cursor: pointer;
          /* Reset Select */
          appearance: none;
          outline: 0;
          border: 0;
          box-shadow: none;
          background-color: #f6f6f6;
          border: 2px solid var(--border-color-3);
          border-radius: 50px;
          // font-family: "NotoSansCJKtc-Thin";
          font-weight: 300;
          font-size: 13px;
          color: var(--text-color-1);
          text-align: center;
        }
      }
      ul {
        width: 120%;
        list-style-type: none;
        padding: 0;
        margin: 0;
        // font-family: "NotoSansCJKtc-Thin";
        font-weight: 300;
        line-height: 1.2;
        font-size: 13px;
        letter-spacing: 1.1px;
        color: var(--text-color-1);
        border-radius: 10px;
        border: 1px solid var(--border-color);
        position: absolute;
        top: 105%;
        z-index: 4;
        background: var(--background-color-1);
      }
      li {
        padding: 5% 9%;
        color: var(--text-color-1);
        &:hover {
          color: var(--text-color-2);
          background: #d6bd92;
        }
        &:first-child {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
        &:last-child {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        &:not(:first-child) {
          border-top: 1px solid var(--border-color);
        }
      }
      .current {
        background: #eaeaea;
      }
      .hidden {
        visibility: hidden;
      }
      .visible {
        visibility: visible;
      }
    }
  }
  #nav-check {
    display: none;
  }
}
@media (max-width: 1280px) {
  .navbar {
    .right-box {
      width: 90%;
      .aselect {
        width: 13%;
      }
    }
  }
}
@media (max-width: 768px) {
  .navbar {
    border-top: 1px solid var(--border-color);
    padding: 4% 4%;
    padding-left: 15%;
    justify-content: space-around;
    .home {
      width: 20%;
    }
    .opacity {
      opacity: 0;
    }
    .right-box {
      width: 65%;
      justify-content: flex-end;
      .buttons {
        position: absolute;
        top: 99%;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 0;
        transition: all 0.3s ease-in;
        background-color: transparent;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        overflow: hidden;
        .link {
          width: 100%;
          margin: 4% 0;
          // margin-top: 15px;
          // margin-right: 0px;
          font-size: 4.3vw;
        }
      }
      .search {
        margin-right: 1.5%;
        padding: 0;
        width: 10%;
        border: none;
        min-width: auto;
        .img {
          width: 60%;
          margin-right: 1%;
        }
        .small {
          display: none;
        }
      }
      .active {
        padding-top: 10%;
        height: calc(100vh - 50px);
        border-top: 1px solid #b3b3b3;
        background-color: var(--background-color-1);
        span {
          &:nth-child(2) {
            opacity: 0;
          }
          &:first-child {
            top: 6px;
            transform: rotate(45deg);
          }
          &:last-child {
            top: 6px;
            transform: rotate(45deg);
          }
        }
      }
      .aselect {
        width: 10%;
        .selector {
          min-height: 10px;
          .icon {
            position: absolute;
            left: 8%;
            width: 60%;
          }
          ul {
            width: 380%;
            top: 210%;
            right: -50%;
          }
          .label {
            display: none;
          }
          .arrow {
            display: none;
          }
        }
      }
    }
    .nav-btn {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 15%;
      border-right: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      label {
        display: inline-block;
        width: 100%;
        height: 100%;
        // width: 25px;
        // height: 25px;
        // padding: 13px;
        span {
          display: block;
          width: 20px;
          height: 2px;
          margin: auto;
          background: #636363;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          transition: all 0.4s ease;

          &.top {
            transform: translateY(-8px);
          }

          &.bottom {
            transform: translateY(8px);
          }
        }
        &.active {
          .top {
            transform: rotate(-45deg);
          }
          .mid {
            transform: translateX(-20px) rotate(360deg);
            opacity: 0;
          }
          .bottom {
            transform: rotate(45deg);
          }
        }
      }
    }
  }
}
@media (max-width: 475px) {
  .navbar {
    padding: 4% 4% 4% 17%;
    .right-box {
      width: 75%;
      .search {
        margin-right: 3%;
        // width: 7%;
        .img {
          width: 75%;
        }
        .small {
          margin: 3% 0;
          width: 100%;
        }
      }
      .aselect {
        // width: 35%;
        .selector {
          .icon {
            width: 75%;
          }
        }
      }
    }
  }
}
@media (max-width: 425px) {
  .navbar {
    .right-box {
      .aselect {
        // width: 45%;
      }
    }
  }
}
</style>
