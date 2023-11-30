<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useMainStore } from "../store/main";
import { apiGetNewsList } from "../api/index";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Navigation } from "swiper/modules";

const modules = [Navigation];
const mainStore = useMainStore();
const language = computed(() => mainStore.currentLanguage);

let newsCategoryData = computed(() => mainStore.newsCategoryData);
let newsListData = computed(() => mainStore.newsListData);
let title = computed(() => mainStore.navButtons[mainStore.currentLanguage - 1].NEWS);

const currentTab = ref(null);
let currentTabName = ref(null);
const searchText = ref("");
let categories = ref([]);

const currentSlide = ref(null);
const isLastSlide = ref(false);
const handleSlideChange = (swiper) => {
  currentSlide.value = swiper.realIndex;
  console.log(newsCategoryData.value);
  const lastSlideIndex = Object.keys(newsCategoryData.value).length - 3;
  isLastSlide.value = currentSlide.value === lastSlideIndex;
};

const transTabName = (index) => {
  if (index === null) {
    currentTabName.value = "ALL";
  } else {
    currentTabName.value = mainStore.newsCategoryData[index].name;
  }
};
const changeCurrentList = (index, id = "", search = "") => {
  changeDropdown();
  transTabName(index);
  let params = {};
  if (index === null) {
    params = {
      language: language.value,
      search: search,
    };
  } else {
    params = {
      language: language.value,
      news_type_id: id,
      search: search,
    };
  }
  apiGetNewsList({
    params: params,
  })
    .then((res) => {
      currentTab.value = index;
      mainStore.newsListData = res.data.message;
    })
    .catch((err) => {
      console.log(err);
    });
};

const dropdown = ref(false);
const changeDropdown = () => {
  dropdown.value = !dropdown.value;
};

const getNewsDetailLink = (newsId) => {
  const baseUrl = window.location.href;

  const urlParts = baseUrl.split("?");
  const first = urlParts[0];
  const second = urlParts[1];

  // return `${baseUrl}/newsdetail/${newsId}/?language=${language.value}`;
  return `${first}/newsdetail/${newsId}?${second}`;
};

watch(
  () => searchText.value,
  () => {
    if (searchText.value !== "") {
      changeCurrentList(null, searchText.value);
    } else {
      changeCurrentList(null);
    }
  },
);
onMounted(() => {
  transTabName(null);
});
</script>
<template>
  <div class="container">
    <div class="title-box">
      <div class="box">
        <p class="title">{{ title }}</p>
        <div class="search">
          <div class="img">
            <img src="../assets/images/navbar_icon.png" alt="" />
          </div>
          <input v-model="searchText" type="text" placeholder="" />
        </div>
      </div>
      <ul class="nav">
        <li class="button-dropdown">
          <div
            class="dropdown-toggle"
            :class="[dropdown ? 'toggle' : '']"
            @click="changeDropdown()"
          >
            {{ currentTabName }} <span>▼</span>
          </div>
          <ul class="dropdown-menu" :class="[dropdown ? 'open' : '']">
            <li @click="changeCurrentList(null)">
              <div class="tab" :class="[currentTab === null ? 'active' : '']">ALL</div>
            </li>
            <li
              v-for="(item, index) in newsCategoryData"
              :key="item"
              @click="changeCurrentList(index, item.news_type_id)"
            >
              <div class="tab" :class="[currentTab === index ? 'active' : '']">{{ item.name }}</div>
            </li>
          </ul>
        </li>
      </ul>
      <swiper
        :slidesPerView="'auto'"
        :spaceBetween="0"
        :navigation="{ nextEl: '.nextArrow', prevEl: '.prevArrow' }"
        :modules="modules"
        class="tabs"
        :style="{
          right: currentTab !== null && currentSlide === 1 ? '0px' : '1px',
        }"
        @slideChange="handleSlideChange"
      >
        <div class="prevArrow" v-show="currentSlide > 0">
          <img src="../assets/images/news_arrow.png" alt="" />
        </div>
        <div class="nextArrow" v-show="!isLastSlide">
          <img src="../assets/images/news_arrow.png" alt="" />
        </div>
        <swiper-slide
          @click="changeCurrentList(null)"
          :class="[currentTab === null ? 'active' : '']"
        >
          <div class="tab">ALL</div>
        </swiper-slide>
        <swiper-slide
          v-for="(item, index) in newsCategoryData"
          :key="item"
          @click="changeCurrentList(index, item.news_type_id)"
          :class="[currentTab === index ? 'active' : '']"
        >
          <div class="tab">{{ item.name }}</div>
        </swiper-slide>
        <swiper-slide>
          <div class="tab none"></div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="section-box">
      <swiper
        :slidesPerView="'auto'"
        :spaceBetween="0"
        :navigation="{ nextEl: '.nextArrow', prevEl: '.prevArrow' }"
        :modules="modules"
        class="news"
      >
        <div class="arrow-box">
          <div class="prevArrow">
            <img src="../assets/images/arrow_left.png" alt="" />
          </div>
          <div class="nextArrow">
            <img src="../assets/images/arrow_right.png" alt="" />
          </div>
        </div>
        <swiper-slide v-for="(item, index) in newsListData" :key="index">
          <a :href="getNewsDetailLink(item.news_id)" target="_blank" class="item">
            <div class="top">
              <span>{{ `${item.news_date.split("-")[1]}-${item.news_date.split("-")[2]}` }}</span>
              <p>{{ item.title }}</p>
            </div>
            <div class="pic">
              <img :src="item.banner" alt="" />
            </div>
            <div class="bottom">
              <p v-html="item.content"></p>
              <img src="../assets/images/home_section_2_arrow.png" alt="" class="arrow" />
            </div>
          </a>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  background-color: var(--background-color-2);
  position: relative;
  z-index: 0;
  .title-box {
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    z-index: 2;
    .box {
      padding: 6% 0;
      width: calc(80%);
      border-left: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      .title {
        margin-right: 1%;
        margin-left: 3%;
      }
      .search {
        width: 8%;
        min-width: 160px;
        padding: 0.3% 0.5%;
        border: 3px solid #6f6f6f;
        border-radius: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .img {
          margin-right: 2%;
          width: 11.5%;
        }
        input {
          border: none;
          outline: none;
          width: 80%;
          // font-family: "NotoSansCJKtc-Thin";
          font-weight: 300;
          font-size: 0.8vw;
          color: var(--text-color-1);
        }
      }
    }
    .tabs {
      position: absolute;
      bottom: 0;
      right: 0px;
      width: 80%;
      z-index: 1;
      .prevArrow {
        position: absolute;
        bottom: 50%;
        left: 2%;
        z-index: 2;
        transform: rotate(180deg) translateY(-50%);
        width: 5%;
        display: flex;
        transition-duration: 0.3s;
        img {
          width: 20%;
        }
        &:hover {
          margin-left: 10px;
        }
      }
      .nextArrow {
        position: absolute;
        bottom: 50%;
        right: 2%;
        z-index: 2;
        transform: translateY(50%);
        width: 5%;
        display: flex;
        transition-duration: 0.3s;
        img {
          width: 20%;
        }
        &:hover {
          margin-right: 10px;
        }
      }
      .swiper-slide {
        width: calc(23% - 1px);
        border-top: 1px solid transparent;
        border-right: 1px solid transparent;
        .tab {
          cursor: pointer;
          padding: 3% 15%;
          // font-family: "NotoSansCJKtc";
          font-weight: 500;
          font-size: 1.15vw;
          line-height: 1.2;
          letter-spacing: 1px;
          color: var(--text-color-1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .active {
        border-top: 1px solid var(--border-color);
        border-left: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
        background-color: var(--background-color-1);
      }
    }
    .nav {
      display: none;
    }
  }
  .section-box {
    margin-left: auto;
    padding-bottom: 10%;
    border-left: 1px solid var(--border-color);
    width: calc(80%);
    position: relative;
    z-index: 0;
    .news {
      background-color: var(--background-color-1);
      border-bottom: 1px solid var(--border-color);
      overflow-y: visible;
      position: relative;
      z-index: 1;
      .arrow-box {
        position: absolute;
        bottom: -13%;
        right: 6%;
        z-index: 0;
        margin-left: auto;
        margin-right: 3%;
        width: 10%;
        display: flex;
        justify-content: space-between;
        .prevArrow {
          width: 30%;
          transition-duration: 0.3s;
          &:hover {
            margin-left: 10px;
          }
        }
        .nextArrow {
          width: 30%;
          transition-duration: 0.3s;
          &:hover {
            margin-right: 10px;
          }
        }
      }
      .swiper-slide {
        width: 23%;
        .item {
          padding-bottom: 1%;
          border-right: 1px solid var(--border-color);
          display: block;
          .top {
            margin: 0 auto;
            margin-left: 10%;
            padding: 8% 0;
            width: 70%;
            min-height: 3.5vw;
            // font-family: "NotoSansCJKtc-Bold";
            font-weight: bold;
            line-height: 1.2;
            font-size: 1.05vw;
            color: var(--text-color-1);
            display: flex;
            flex-direction: column;
            span {
              margin-bottom: 3%;
              // font-family: "NotoSansCJKtc-Thin";
              font-weight: 300;
              font-size: 1vw;
            }
            p {
              min-height: 3.8vw;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 3; /* 顯示的行數 */
              -webkit-box-orient: vertical;
            }
          }
          .pic {
            width: 100%;
            min-height: 10.25vw;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .bottom {
            margin: 8% auto;
            padding-bottom: 25%;
            width: 78%;
            border-bottom: 1px solid var(--border-color);
            position: relative;
            :deep() p {
              font-size: 0.9vw;
              color: var(--text-color-1);
              // font-family: "NotoSansCJKtc-Thin";
              font-weight: 300;
              line-height: 1.2;
              letter-spacing: 1.1px;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 3; /* 顯示的行數 */
              -webkit-box-orient: vertical;
            }
            .arrow {
              position: absolute;
              bottom: 10%;
              right: 0;
              width: 10%;
            }
          }
        }
      }
    }
  }
}
@media (max-width: 1280px) {
  .container {
    .section-box {
      .news {
        .swiper-slide {
          .item {
            .top {
              p {
                min-height: 4vw;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .container {
    .section-box {
      .news {
        .swiper-slide {
          .item {
            .top {
              p {
                min-height: 4.3vw;
              }
            }
          }
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .container {
    .title-box {
      border-top: none;
      .box {
        padding: 10% 0;
        width: calc(85% - 1px);
        .search {
          margin-top: 0.5%;
          min-width: 120px;
          .img {
            width: 14.5%;
          }
          input {
            width: 74%;
            font-size: 2.8vw;
          }
        }
        p {
          font-size: 5vw;
        }
      }
      .tabs {
        // 手機板改為下拉式選單
        display: none;
      }
      .nav {
        display: block;
        position: absolute;
        bottom: 0;
        left: 15%;
        z-index: 0;
        width: 40.9%;
        background-color: var(--background-color-1);
        .button-dropdown {
          width: 100%;
          display: block;
          transition: all 0.3s ease-in;
          position: relative;
          .dropdown-toggle {
            cursor: pointer;
            padding: 3% 15%;
            border-top: 1px solid var(--border-color);
            border-left: 1px solid var(--border-color);
            border-right: 1px solid var(--border-color);
            // font-family: "NotoSansCJKtc";
            font-size: 2.6vw;
            font-weight: bold;
            color: var(--text-color-1);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            span {
              position: absolute;
              top: 50%;
              right: 5%;
              transform: translateY(-50%);
            }
          }
          .dropdown-menu {
            display: none;
            list-style: none;
            position: absolute;
            top: 95%;
            left: 0;
            padding: 0;
            margin: 0;
            margin-top: 3px;
            text-align: left;
            width: 100%;
            transition: all 0.3s ease-in;
            .tab {
              padding: 3% 15%;
              border-bottom: 1px solid var(--border-color);
              border-left: 1px solid var(--border-color);
              border-right: 1px solid var(--border-color);
              background-color: var(--background-color-2);
              // font-family: "NotoSansCJKtc";
              font-weight: 500;
              font-size: 2.6vw;
              color: var(--text-color-1);
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          .toggle {
            span {
              transform: rotateX(180deg) translateY(50%);
            }
          }
          .open {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
    .section-box {
      width: calc(85% - 1px);
      .news {
        background-color: var(--background-color-1);
        border-bottom: 1px solid var(--border-color);
        overflow-y: visible;
        position: relative;
        z-index: 1;
        .arrow-box {
          bottom: -11%;
          right: 6%;
          width: 20%;
        }
        .swiper-slide {
          width: 48%;
          .item {
            .top {
              margin: 0 auto;
              padding: 4% 0;
              width: 85%;
              font-size: 2.7vw;
              span {
                font-size: 2.6vw;
              }
              p {
                min-height: 9.7vw;
              }
            }
            .pic {
              min-height: 23.25vw;
            }
            .bottom {
              width: 85%;
              :deep() p {
                font-size: 2.6vw;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 475px) {
  .container {
    .section-box {
      .news {
        .swiper-slide {
          .item {
            .top {
              p {
                min-height: 9.8vw;
              }
            }
          }
        }
      }
    }
  }
}
</style>
