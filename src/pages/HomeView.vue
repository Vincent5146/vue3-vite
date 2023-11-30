<script setup>
import { ref, watch, computed } from "vue";
import { useMainStore } from "../store/main";
import { apiGetProduct } from "../api/index";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Navigation } from "swiper/modules";

const mainStore = useMainStore();

const modules = [Navigation];
let homeData = ref(mainStore.homeData);
let homeShowProductListData = ref(mainStore.homeShowProductListData);

let productList = computed(() => {
  if (homeData.value.section_2[0].pagedetails.length > 0) {
    homeData.value.section_2[0].pagedetails.sort((a, b) => {
      return a.order - b.order;
    });
    return homeData.value.section_2[0].pagedetails;
  } else {
    return [];
  }
});
let section_1 = computed(() => {
  if (homeData.value.section_1 && homeData.value.section_1.length > 0) {
    homeData.value.section_1[0].pagedetails.sort((a, b) => {
      return a.order - b.order;
    });
    return homeData.value.section_1;
  } else {
    return [];
  }
});
let section_2 = computed(() => homeData.value.section_2);
let section_3 = computed(() => homeData.value.section_3);
let section_4_1 = computed(() => homeData.value.section_4_1);
let section_4_2 = computed(() => homeData.value.section_4_2);
let section_5 = computed(() => homeData.value.section_5);
let section_6 = computed(() => homeData.value.section_6);
const changeShowModal = (item) => {
  mainStore.showModal = !mainStore.showModal;
  mainStore.currentBrand = item.title;
};
// const getProductDetailLink = (productId) => {
//   console.log(productId);
//   const baseUrl = window.location.href;
//   return `${baseUrl}product/productdetail/${productId}`;
// };
const checkLink = (link) => {
  const test = link.split("/");
  console.log(test);
  return test[5];
};
watch(
  () => mainStore.homeData,
  () => {
    homeData.value = mainStore.homeData;
  },
);
watch(
  () => mainStore.homeShowProductListData,
  () => {
    homeShowProductListData.value = mainStore.homeShowProductListData;
  },
);
</script>
<template>
  <div class="container" v-if="!mainStore.isLoading">
    <section class="section-1">
      <div class="left"></div>
      <swiper
        :slidesPerView="1"
        :spaceBetween="0"
        :loop="true"
        :navigation="{ nextEl: '.nextArrow', prevEl: '.prevArrow' }"
        :modules="modules"
        class="section-box"
      >
        <div class="arrow-box">
          <div class="prevArrow">
            <img src="../assets/images/arrow_left.png" alt="" />
          </div>
          <div class="nextArrow">
            <img src="../assets/images/arrow_right.png" alt="" />
          </div>
        </div>
        <swiper-slide v-for="(item, index) in section_1[0].pagedetails" :key="index">
          <div v-if="item.banner_link === ''">
            <!-- <div class="line"></div> -->
            <picture>
              <source :srcset="encodeURI(item.banner)" media="(min-width: 769px)" />
              <source :srcset="encodeURI(item.banner_m)" />
              <img :src="encodeURI(item.banner)" alt="banner" class="bg" />
            </picture>
          </div>
          <!-- <router-link
            v-else-if="item.banner_link.startsWith('https://front.design-edg.com')"
            :to="{ name: checkLink(item.banner_link) }"
          >
            {{ item.banner_link }}
            <picture>
              <source :srcset="encodeURI(item.banner)" media="(min-width: 769px)" />
              <source :srcset="encodeURI(item.banner_m)" />
              <img :src="encodeURI(item.banner)" alt="banner" class="bg" />
            </picture>
          </router-link> -->
          <a v-else :href="item.banner_link" target="_blank">
            <!-- <div class="line"></div> -->
            <picture>
              <source :srcset="encodeURI(item.banner)" media="(min-width: 769px)" />
              <source :srcset="encodeURI(item.banner_m)" />
              <img :src="encodeURI(item.banner)" alt="banner" class="bg" />
            </picture>
          </a>
        </swiper-slide>
      </swiper>
    </section>
    <section class="section-2">
      <div class="top-box">
        <div class="right">
          <div class="title">{{ section_2[0].title }}</div>
          <div class="subtitle">
            {{ section_2[0].sub_title }}
          </div>
        </div>
      </div>
      <div class="bottom-box">
        <swiper
          :slidesPerView="'auto'"
          :spaceBetween="0"
          :navigation="{ nextEl: '.nextArrow', prevEl: '.prevArrow' }"
          :modules="modules"
          class="section-2-swiper"
        >
          <div class="arrow-box">
            <div class="prevArrow">
              <img src="../assets/images/arrow_left.png" alt="" />
            </div>
            <div class="nextArrow">
              <img src="../assets/images/arrow_right.png" alt="" />
            </div>
          </div>
          <swiper-slide></swiper-slide>
          <swiper-slide v-for="item in productList" :key="item.title">
            <a :href="item.banner_link" target="_blank" class="item">
              <div class="pic">
                <img :src="item.banner" alt="" />
              </div>
              <div class="name">
                {{ item.title }} <br />
                {{ item.sub_title }}
                <div class="arrow">
                  <img src="../assets/images/home_section_2_arrow.png" alt="" />
                </div>
              </div>
            </a>
            <!-- <router-link
              :to="{ name: 'productdetail', params: { productId: item.product_id } }"
              class="item"
            >
              <div class="pic">
                <img :src="item.banner" alt="" />
              </div>
              <div class="name">
                {{ item.title }}
                <div class="arrow">
                  <img src="../assets/images/home_section_2_arrow.png" alt="" />
                </div>
              </div>
            </router-link> -->
          </swiper-slide>
          <swiper-slide></swiper-slide>
        </swiper>
      </div>
    </section>
    <section class="section-3">
      <video autoplay loop muted playsinline controls preload="auto">
        <source v-if="!mainStore.isMobile" :src="section_3[0].video" />
        <source v-else :src="section_3[0].video_m" />
      </video>
      <!-- <img :src="section_3[0].video" alt="" /> -->
    </section>
    <section class="section-4">
      <div class="top-box">
        <div class="title">{{ section_4_1[0].title }}</div>
        <div class="subtitle">
          {{ section_4_1[0].sub_title }}
        </div>
      </div>
      <div class="bottom-box">
        <div class="left-box">
          <div class="title">{{ section_4_2[0].title }}</div>
          <div class="subtitle">
            {{ section_4_2[0].sub_title }}
          </div>
        </div>
        <div class="right-box">
          <div
            class="link"
            v-for="item in section_4_2[0].pagedetails"
            :key="item"
            @click="changeShowModal(item)"
          >
            <div class="logo">
              <img :src="item.banner" alt="" />
            </div>
            <div class="tips">
              <p>Tips for {{ item.title }}</p>
              <div class="go">
                <img src="../assets/images/home_section_4_icon.png" alt="" />
              </div>
            </div>
          </div>
          <div class="disclaim" v-html="section_4_2[0].content"></div>
        </div>
      </div>
    </section>
    <section class="section-5">
      <picture>
        <source :srcset="section_5[0].image" media="(min-width: 769px)" />
        <source :srcset="section_5[0].image_m" />
        <img :src="section_5[0].image" alt="" class="bg" />
      </picture>
      <div class="text-box">
        <div class="title">{{ section_5[0].title }}</div>
        <div class="subtitle">
          {{ section_5[0].sub_title }}
        </div>
      </div>
    </section>
    <section class="section-6">
      <div class="left"></div>
      <div class="section-box">
        <div class="title">{{ section_6[0].title }}</div>
        <swiper
          :slidesPerView="'auto'"
          :spaceBetween="20"
          :navigation="{ nextEl: '.nextArrow', prevEl: '.prevArrow' }"
          :modules="modules"
          class="section-6-swiper"
        >
          <div class="arrow-box">
            <div class="prevArrow">
              <img src="../assets/images/arrow_left.png" alt="" />
            </div>
            <div class="nextArrow">
              <img src="../assets/images/arrow_right.png" alt="" />
            </div>
          </div>
          <swiper-slide v-for="(item, index) in section_6[0].pagedetails" :key="index">
            <div class="item">
              <div class="content" v-html="item.content"></div>
              <div class="from">
                {{ item.title }}
                <div class="stars">
                  <span class="star" v-for="number in parseInt(item.sub_title)" :key="number">
                    <img src="../assets/images/home_section_6_icon.png" alt="" />
                  </span>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </section>
  </div>
</template>
<style lang="scss" scoped>
.container {
  background-color: var(--background-color-1);
  position: relative;
  z-index: 0;
  .section-1 {
    .section-box {
      position: relative;
      .arrow-box {
        position: absolute;
        top: 75%;
        left: 20%;
        z-index: 2;
        min-width: 120px;
        width: 8%;
        max-width: 200px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .prevArrow {
          width: 28%;
          margin-right: 15px;
          margin-left: 15px;
          transition-duration: 0.3s;
          &:hover {
            margin-left: 20px;
          }
        }
        .nextArrow {
          width: 28%;
          margin-left: 15px;
          margin-right: 15px;
          transition-duration: 0.3s;
          &:hover {
            margin-right: 20px;
          }
        }
      }
      .swiper-slide {
        position: relative; /* Add this line */
        .bg {
          width: 100%;
          height: auto;
          display: block;
        }
        .line {
          position: absolute;
          top: 0;
          left: 17.5%; /* You can adjust this value */
          width: 1px;
          height: 100%;
          background-color: #b3b3b3;
        }
      }
    }
  }
  .section-2 {
    border-top: 1px solid var(--border-color);
    background-color: var(--background-color-2);
    position: relative;
    z-index: 0;
    .top-box {
      display: flex;
      .right {
        margin-left: 17.5%;
        border-left: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
        padding: 5% 3%;
        width: calc(40% - 2px);
        .subtitle {
          margin-top: 3%;
          padding-right: 15%;
        }
      }
    }
    .bottom-box {
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      .section-2-swiper {
        width: 100%;
        height: 100%;
        background-color: var(--background-color-1);
        overflow-x: hidden;
        position: relative;
        .arrow-box {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .prevArrow {
            margin-left: 2%;
            transition-duration: 0.3s;
            &:hover {
              margin-left: 2.5%;
            }
          }
          .nextArrow {
            margin-right: 2%;
            transition-duration: 0.3s;
            &:hover {
              margin-right: 2.5%;
            }
          }
        }
        .swiper-slide {
          width: calc(23%);
          background-color: var(--background-color-2);
          .item {
            padding-bottom: 10%;
            border-right: 1px solid var(--border-color);
            background-color: var(--background-color-2);
            display: block;
            .pic {
              margin: 0 auto;
              height: calc(5rem + 0.5rem);
              display: flex;
              // align-items: flex-start;
              align-items: center;
              justify-content: center;
            }
            .name {
              margin: 0 auto;
              padding-bottom: 13px;
              width: 90%;
              min-height: 0.55rem;
              // font-family: "NotoSansCJKtc-Bold";
              font-weight: bold;
              line-height: 1.2;
              font-size: 1.2vw;
              letter-spacing: 1.1px;
              color: var(--text-color-1);
              border-bottom: 1px solid var(--border-color);
              display: flex;
              align-items: center;
              position: relative;
              .arrow {
                display: none;
              }
            }
          }
          &:first-child {
            padding-bottom: 0%;
            pointer-events: none;
            width: calc(17.5%);
          }
          &:last-child {
            padding-bottom: 0%;
            pointer-events: none;
            width: calc(13.5%);
          }
          &:nth-child(2) {
            width: calc(23% - 1px);
            border-left: 1px solid var(--border-color);
          }
          &:nth-child(4) {
            width: calc(23% - 1px);
          }
          &:hover {
            width: calc(46% - 1px);
            .item {
              padding-bottom: 5%;
              .pic {
                align-items: center;
                // transform: scale(1.3); /* 在鼠标悬停时放大 1.1 倍 */
                // transition: transform 0.3s ease; /* 添加过渡效果 */
                img {
                  width: 70%;
                }
              }
              .name {
                .arrow {
                  position: absolute;
                  bottom: 15%;
                  right: 0;
                  width: 4%;
                  display: block;
                }
              }
            }
          }
        }
      }
    }
  }
  .section-3 {
    video {
      width: 100%;
    }
  }
  .section-4 {
    .top-box {
      padding: 5% 5% 5% 25%;
      border-right: 1px solid var(--border-color);
      background-color: var(--background-color-2);
      width: 55%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .subtitle {
        margin-top: 3%;
        padding-right: 3%;
      }
    }
    .bottom-box {
      padding: 7% 0;
      background-color: #d3b889;
      display: flex;
      align-items: center;
      justify-content: center;
      .left-box {
        margin-right: 8%;
        .title {
          color: var(--text-color-2);
        }
        .subtitle {
          margin-top: 3%;
          color: var(--text-color-2);
        }
      }

      .right-box {
        width: 27%;
        position: relative;
        z-index: 1;
        .link {
          cursor: pointer;
          padding-bottom: 2%;
          min-height: 0.3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .tips {
            padding-right: 5%;
            width: 55%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            position: relative;
            p {
              // font-family: "NotoSansCJKtc-Thin";
              font-weight: 300;
              line-height: 1.2;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-2);
            }
            .go {
              position: absolute;
              top: 50%;
              right: 0;
              transform: translateY(-50%);
              width: 6%;
            }
          }
          .logo {
            width: 45%;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              margin-right: auto;
            }
          }

          &:nth-child(1) {
            .logo {
              img {
                width: 20%;
              }
            }
          }
          &:nth-child(2) {
            .logo {
              img {
                width: 85%;
              }
            }
          }
          &:nth-child(3) {
            .logo {
              img {
                width: 60%;
              }
            }
          }
          &:nth-child(4) {
            .logo {
              img {
                width: 75%;
              }
            }
          }
          &:nth-child(5) {
            .logo {
              img {
                width: 100%;
              }
            }
          }
          &:nth-child(6) {
            .logo {
              img {
                width: 50%;
              }
            }
          }
          &:not(:last-child) {
            margin-bottom: 4%;
            border-bottom: 1px solid var(--border-color-2);
          }
        }
        .disclaim {
          position: absolute;
          bottom: -25%;
          left: 0%;
          :deep()p {
            font-weight: 300;
            line-height: 1.2;
            font-size: 0.8vw;
            letter-spacing: 1.1px;
            color: #916822;
          }
        }
      }
    }
  }
  .section-5 {
    position: relative;
    height: auto;
    .bg {
      width: 100%;
      height: auto;
      display: block;
    }
    .text-box {
      position: absolute;
      top: 40%;
      left: 17%;
      width: 50%;
      .subtitle {
        margin-top: 3%;
      }
    }
  }
  .section-6 {
    display: flex;
    .left {
      width: 25%;
      border-right: 1px solid var(--border-color);
    }
    .section-box {
      padding-top: 5%;
      width: 75%;
      background-color: var(--background-color-2);
      .title {
        margin-left: 3%;
      }
      .section-6-swiper {
        margin: 5% 0 10%;
        margin-left: -1px;
        width: 100%;
        position: relative;
        .swiper-slide {
          width: 28.5%;
          .item {
            padding: 12% 10%;
            min-height: 2.5rem;
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .content {
              // height: 1.7rem;
              // font-family: "NotoSansCJKtc-Thin";
              font-weight: 300;
              line-height: 1.2;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-1);
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 7; /* 顯示的行數 */
              -webkit-box-orient: vertical;
            }
            .from {
              margin: 5% 0 3% 0;
              // font-family: "NotoSansCJKtc";
              line-height: 1.2;
              font-weight: bold;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-1);
            }
            .stars {
              width: 40%;
              display: flex;
              align-items: center;
              .star {
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }
        }
        .arrow-box {
          margin-top: 2%;
          margin-left: auto;
          margin-right: 3%;
          width: 10%;
          min-width: 140px;
          display: flex;
          justify-content: space-between;
          .prevArrow {
            transition-duration: 0.3s;
            &:hover {
              margin-left: 10px;
            }
          }
          .nextArrow {
            transition-duration: 0.3s;
            &:hover {
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 1600px) {
  .container {
    .section-2 {
      .bottom-box {
        .section-2-swiper {
          .swiper-slide {
            .item {
              .pic {
                height: calc(4.5rem);
              }
            }
          }
        }
      }
    }
    .section-6 {
      .section-box {
        .section-6-swiper {
          .swiper-slide {
            .item {
              min-height: 2.1rem;
              .content {
                // height: 1.45rem;
              }
            }
          }
        }
      }
    }
  }
}
@media (max-width: 1440px) {
  .container {
    .section-2 {
      .bottom-box {
        .section-2-swiper {
          .swiper-slide {
            .item {
              .pic {
                height: calc(4rem);
              }
            }
          }
        }
      }
    }
    .section-6 {
      .section-box {
        .section-6-swiper {
          .swiper-slide {
            .item {
              min-height: 1.9rem;
              .content {
                // height: 1.3rem;
              }
            }
          }
        }
      }
    }
  }
}
@media (max-width: 1280px) {
  .container {
    .section-2 {
      .bottom-box {
        .section-2-swiper {
          .swiper-slide {
            .item {
              .pic {
                height: calc(3.7rem);
              }
            }
          }
        }
      }
    }
    .section-6 {
      .section-box {
        .section-6-swiper {
          .swiper-slide {
            .item {
              min-height: 1.7rem;
              .content {
                // height: 1.12rem;
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
    .section-2 {
      .bottom-box {
        .section-2-swiper {
          .swiper-slide {
            .item {
              .pic {
                height: calc(3rem);
              }
            }
          }
        }
      }
    }
    .section-6 {
      .section-box {
        .section-6-swiper {
          .swiper-slide {
            .item {
              min-height: 1.5rem;
              .content {
                // height: 1rem;
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
    .section-1 {
      .section-box {
        .arrow-box {
          top: 90%;
          left: 70%;
          min-width: 125px;
          width: 20%;
          max-width: 150px;
          .prevArrow {
            width: 40%;
          }
          .nextArrow {
            width: 40%;
          }
        }
        .swiper-slide {
          .line {
            left: 15%;
          }
        }
      }
    }
    .section-2 {
      .top-box {
        .right {
          margin-left: 15%;
          border-right: none;
          padding: 5% 3%;
          width: 70%;
          .title {
            padding-right: 38%;
          }
          .subtitle {
            padding-right: 5%;
          }
        }
      }
      .bottom-box {
        .section-2-swiper {
          .arrow-box {
            display: none;
          }
          .swiper-slide {
            width: calc(40%);
            background-color: var(--background-color-2);
            .item {
              padding-bottom: 2%;
              border-right: 1px solid var(--border-color);
              background-color: var(--background-color-2);
              .pic {
                height: 3rem;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .name {
                font-size: 3vw;
                .arrow {
                  position: absolute;
                  bottom: 5px;
                  right: 0;
                  width: 9%;
                  display: block;
                }
              }
            }
            &:first-child {
              width: calc(15%);
            }
            &:last-child {
              width: calc(5%);
            }
            &:nth-child(2) {
              width: calc(40%);
            }
            &:nth-child(4) {
              width: calc(40%);
            }
            &:nth-child(5) {
              width: calc(40% - 1px);
            }
            &:hover {
              .item {
                padding-bottom: 2%;
                .pic {
                  transform: none;
                  img {
                    width: 100%;
                  }
                }
                .name {
                  .arrow {
                    bottom: 5px;
                    right: 0;
                    width: 9%;
                  }
                }
              }
              &:first-child {
                width: calc(15%);
              }
              &:last-child {
                width: calc(5%);
              }
              &:nth-child(2) {
                width: calc(40%);
              }
              &:nth-child(3) {
                width: calc(40%);
              }
              &:nth-child(4) {
                width: calc(40%);
              }
              &:nth-child(5) {
                width: calc(40% - 1px);
              }
            }
          }
        }
      }
    }
    .section-4 {
      .top-box {
        padding: 10% 5% 10% 12%;
        width: 90%;
        box-sizing: border-box;
        .title {
          text-align: center;
        }
        .subtitle {
          text-align: center;
          width: 90%;
        }
      }
      .bottom-box {
        padding: 7% 0 12%;
        flex-direction: column;
        .left-box {
          margin: 0 auto;
          .title {
            padding: 0 13%;
            text-align: center;
          }
          .subtitle {
            text-align: center;
          }
        }
        .right-box {
          margin-top: 5%;
          width: 60%;
          .link {
            padding-bottom: 2%;
            min-height: 0.35rem;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            .tips {
              padding-right: 0%;
              p {
                margin-right: 5%;
                font-size: 2.6vw;
                letter-spacing: 1px;
              }
              .go {
                position: static;
                transform: none;
              }
            }
            &:not(:last-child) {
              margin-bottom: 2.5%;
            }
          }
          .disclaim {
            bottom: -20%;
            :deep()p {
              font-size: 1.76vw;
            }
          }
        }
      }
    }
    .section-5 {
      .text-box {
        top: 25%;
        left: 50%;
        transform: translateX(-50%);
        width: 70%;
      }
    }
    .section-6 {
      .left {
        width: 15%;
      }
      .section-box {
        padding: 10% 0;
        width: 85%;
        .title {
          margin-left: 3%;
        }
        .section-6-swiper {
          position: relative;
          .swiper-slide {
            width: 60%;
            .item {
              height: 2.7rem;
              padding: 12% 10%;
              border: 1px solid var(--border-color);
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: space-between;
              .content {
                font-size: 2.8vw;
                letter-spacing: 1px;
                height: auto;
              }
              .from {
                margin: 5% 0 3% 0;
                font-size: 2.8vw;
                letter-spacing: 1px;
              }
              .stars {
                display: flex;
                align-items: center;
                .star {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }
            }
          }
          .arrow-box {
            margin-top: 5%;
            margin-right: 15%;
            width: 20%;
            min-width: 90px;
            .prevArrow {
              width: 30%;
              &:hover {
              }
            }
            .nextArrow {
              width: 30%;
              &:hover {
              }
            }
          }
        }
      }
    }
  }
}
@media (max-width: 620px) {
  .container {
    .section-2 {
      .bottom-box {
        .section-2-swiper {
          .swiper-slide {
            .item {
              .pic {
                height: 2.8rem;
              }
            }
          }
        }
      }
    }
    .section-6 {
      .section-box {
        .section-6-swiper {
          .swiper-slide {
            .item {
              height: 2.2em;
            }
          }
        }
      }
    }
  }
}
@media (max-width: 475px) {
  .container {
    .section-2 {
      .top-box {
        .right {
          .title {
            padding-right: 33%;
          }
        }
      }
      .bottom-box {
        .section-2-swiper {
          .swiper-slide {
            .item {
              .pic {
                height: 2.5rem;
              }
            }
          }
        }
      }
    }
    .section-4 {
      .bottom-box {
        .right-box {
          width: 75%;
          .link {
            min-height: 0.25rem;
          }
          .disclaim {
            bottom: -15%;
          }
        }
      }
    }
    .section-6 {
      .section-box {
        .section-6-swiper {
          .swiper-slide {
            .item {
              height: 1.8em;
            }
          }
        }
      }
    }
  }
}
@media (max-width: 425px) {
  .container {
    .section-2 {
      .bottom-box {
        .section-2-swiper {
          .swiper-slide {
            .item {
              .pic {
                height: 2rem;
              }
            }
          }
        }
      }
    }
    .section-6 {
      .section-box {
        .section-6-swiper {
          .swiper-slide {
            .item {
              height: 1.5em;
            }
          }
        }
      }
    }
  }
}
</style>
