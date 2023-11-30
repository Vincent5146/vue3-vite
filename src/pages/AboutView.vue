<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useMainStore } from "../store/main";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

const mainStore = useMainStore();
let aboutData = ref(mainStore.aboutData);
let section_1 = computed(() => aboutData.value.section_1);
let section_2 = computed(() => aboutData.value.section_2);
let section_3 = computed(() => aboutData.value.section_3);
let section_4_1 = computed(() => aboutData.value.section_4_1);
let section_4_2 = computed(() => aboutData.value.section_4_2);
let section_5 = computed(() => aboutData.value.section_5);
let section_6 = computed(() => aboutData.value.section_6);
let section_7 = computed(() => aboutData.value.section_7);
let section_8 = computed(() => aboutData.value.section_8);
let section_9 = computed(() => aboutData.value.section_9);
let section_10 = computed(() => aboutData.value.section_10);

const showModal = computed(() => mainStore.showModal);
const changeShowModal = () => {
  mainStore.showModal = !mainStore.showModal;
};

// section6仿輪播功能
let intervalId = null;
const startAutoSwitch = () => {
  if (section_6.value[0].pagedetails) {
    intervalId = setInterval(() => {
      // 根據目前的 active index 切換到下一個 index
      section6ActivePoint((section6activeIndex.value + 1) % section_6.value[0].pagedetails.length);
    }, 3000); // 3秒的間隔
  }
};
const stopAutoSwitch = () => {
  clearInterval(intervalId);
};

const section6activeIndex = ref(0);
const section6ActivePoint = (index) => {
  section6activeIndex.value = index;
};
const section8activeIndex = ref(0);
const section8ActivePoint = (index) => {
  if (
    (index === -1 && section8activeIndex.value > 0) ||
    (index === +1 && section8activeIndex.value < 2)
  ) {
    section8activeIndex.value += index;
  } else if (index === 0) {
    section8activeIndex.value = index;
  }
};

let xDown = null;
const onTouchStart = (event) => {
  const firstTouch = event.touches[0];
  xDown = firstTouch.clientX;
};
const onTouchMove = (event) => {
  if (!xDown) {
    return;
  }
  const xUp = event.touches[0].clientX;
  const xDiff = xDown - xUp;

  if (xDiff > 0) {
    // 向左滑动
    section8ActivePoint(1);
  } else {
    // 向右滑动
    section8ActivePoint(-1);
  }
  // 重置 xDown 以便下一次滑动
  xDown = null;
};

watch(
  () => mainStore.aboutData,
  () => {
    aboutData.value = mainStore.aboutData;
  },
);
onMounted(() => {
  section6ActivePoint(0);
  section8ActivePoint(0);
  // 開始自動切換
  startAutoSwitch();
});
</script>
<template>
  <div class="container" v-if="!mainStore.isLoading">
    <section class="section-1">
      <picture>
        <source :srcset="section_1[0].image" media="(min-width: 769px)" />
        <source :srcset="section_1[0].image_m" />
        <img :src="section_1[0].image" alt="" class="bg" />
      </picture>
      <div class="section-box">
        <div class="right">
          <div class="logo"><img src="../assets/images/about_section_1_logo.png" alt="" /></div>
          <div class="title">{{ section_1[0].title }}</div>
          <div class="subtitle">
            {{ section_1[0].sub_title }}
          </div>
        </div>
      </div>
    </section>
    <section class="section-2">
      <div class="section-box">
        <div class="left"></div>
        <div class="right">
          <div class="title">{{ section_2[0].title }}</div>
          <div class="subtitle">
            {{ section_2[0].sub_title }}
          </div>
        </div>
      </div>
    </section>
    <section class="section-3">
      <div class="section-box">
        <div class="point" v-for="item in section_3[0].pagedetails" :key="item">
          <div class="title">{{ item.title }}</div>
          <div class="subtitle">{{ item.sub_title }}</div>
        </div>
      </div>
    </section>
    <section class="section-4">
      <div class="top-box">
        <div class="title">{{ section_4_1[0].title }}</div>
        <div class="subtitle">
          {{ section_4_1[0].sub_title }}
        </div>
      </div>
      <div class="bottom-box">
        <picture>
          <source :srcset="section_4_2[0].image" media="(min-width: 769px)" />
          <source :srcset="section_4_2[0].image_m" />
          <img :src="section_4_2[0].image" alt="" class="bg" />
        </picture>
        <div class="text-box">
          <div class="title">{{ section_4_2[0].title }}</div>
          <div class="subtitle" v-html="section_4_2[0].content"></div>
        </div>
      </div>
    </section>
    <section class="section-5">
      <div class="section-box">
        <div class="product">
          <img :src="section_5[0].image" alt="" />
        </div>
        <div class="text-box">
          <div class="title">{{ section_5[0].title }}</div>
          <div class="subtitle" v-html="section_5[0].sub_title"></div>
        </div>
      </div>
    </section>
    <section class="section-6">
      <picture>
        <source :srcset="section_6[0].image" media="(min-width: 769px)" />
        <source :srcset="section_6[0].image_m" />
        <img :src="section_6[0].image" alt="" class="bg" />
      </picture>
      <div class="text-box">
        <div
          v-for="(item, index) in section_6[0].pagedetails"
          :key="index"
          class="point"
          :class="{ active: index === section6activeIndex }"
          @mouseover="section6ActivePoint(index)"
        >
          <div class="title">{{ item.title }}</div>
          <div class="subtitle">{{ item.sub_title }}</div>
        </div>
      </div>
    </section>
    <section class="section-7">
      <div class="left"></div>
      <div class="section-box">
        <div class="title">{{ section_7[0].title }}</div>
        <div class="subtitle" v-html="section_7[0].sub_title"></div>
        <div class="text-box" v-if="!mainStore.isMobile">
          <div v-for="(item, index) in section_7[0].pagedetails" :key="index" class="point">
            <div class="number">
              <img src="../assets/images/about_section_7.png" alt="" class="circle" />
              <p>0{{ index + 1 }}</p>
            </div>
            <div class="subtitle bold">{{ item.title }}</div>
            <div class="subtitle" v-html="item.content"></div>
          </div>
        </div>
        <div class="text-box" v-else>
          <div v-for="(item, index) in section_7[0].pagedetails" :key="index" class="point">
            <div class="number">
              <div class="circle">
                <img src="../assets/images/about_section_7.png" alt="" />
                <p>0{{ index + 1 }}</p>
              </div>
              <div class="subtitle bold">{{ item.title }}</div>
            </div>
            <div class="subtitle content" v-html="item.content"></div>
          </div>
        </div>
      </div>
    </section>
    <section class="section-8">
      <div class="cards">
        <div
          v-if="!mainStore.isMobile"
          class="card"
          :class="{ active: index === section8activeIndex }"
          v-for="(item, index) in section_8[0].pagedetails"
          :key="index"
        >
          <div class="item">
            <div class="subtitle bold" v-html="item.title"></div>
            <div class="subtitle" v-html="item.content"></div>
          </div>
        </div>
        <div class="item" @touchstart="onTouchStart" @touchmove="onTouchMove" v-else>
          <div
            class="subtitle bold"
            v-html="section_8[0].pagedetails[section8activeIndex].title"
          ></div>
          <div
            class="subtitle"
            v-html="section_8[0].pagedetails[section8activeIndex].content"
          ></div>
        </div>
      </div>
      <div class="arrow-box">
        <div class="prevArrow" @click="section8ActivePoint(-1)">
          <img src="../assets/images/arrow_left.png" alt="" />
        </div>
        <div class="nextArrow" @click="section8ActivePoint(+1)">
          <img src="../assets/images/arrow_right.png" alt="" />
        </div>
      </div>
      <div class="product">
        <div class="pic" :class="[section8activeIndex === 2 ? 'pic3' : '']">
          <img
            v-if="!mainStore.isMobile"
            :src="section_8[0].pagedetails[section8activeIndex].banner"
            alt=""
          />
          <img v-else :src="section_8[0].pagedetails[section8activeIndex].banner_m" alt="" />
        </div>
      </div>
    </section>
    <section class="section-9">
      <div class="left"></div>
      <div class="section-box">
        <div class="point" v-for="item in section_9[0].pagedetails" :key="item">
          <div class="number">
            <img :src="item.banner" alt="" />
          </div>
          <div class="subtitle">{{ item.title }}</div>
          <div class="content" v-html="item.content"></div>
        </div>
      </div>
    </section>
    <section class="section-10">
      <div class="section-box" @click="changeShowModal()">
        <div class="text-box">
          <div class="title">
            {{ section_10[0].title }}
            <img src="../assets/images/home_section_2_arrow.png" alt="" class="arrow" />
          </div>
          <div class="subtitle">{{ section_10[0].sub_title }}</div>
        </div>
      </div>
    </section>
  </div>
</template>
<style lang="scss" scoped>
.container {
  background-color: var(--background-color-1);
  .section-1 {
    height: auto;
    position: relative;
    .section-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      .right {
        margin-left: 15%;
        padding-top: 11%;
        padding-left: 3%;
        border-left: 1px solid var(--border-color);
        width: 34%;
        .logo {
          width: 35%;
        }
        .title {
          margin-top: 3%;
        }
        .subtitle {
          margin-top: 3%;
        }
      }
    }
  }
  .section-2 {
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    position: relative;
    .section-box {
      display: flex;
      .left {
        width: 15%;
        background-color: var(--background-color-2);
        border-right: 1px solid var(--border-color);
      }
      .right {
        padding: 13% 3%;
        width: 57%;
        background-color: var(--background-color-2);
        border-right: 1px solid var(--border-color);
        .subtitle {
          margin-top: 3%;
        }
      }
    }
  }
  .section-3 {
    background-color: var(--background-color-2);
    .section-box {
      margin: 0 auto;
      padding: 10% 0;
      width: 83%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      .point {
        width: 33%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .subtitle {
          margin-top: 3%;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
        }
        &:nth-child(1) {
          .subtitle {
            padding: 0 17%;
          }
        }
        &:nth-child(2) {
          .subtitle {
            padding: 0 18%;
          }
        }
        &:nth-child(3) {
          .subtitle {
            padding: 0 6%;
          }
        }
        &:nth-child(4) {
          margin-top: 8%;
          .subtitle {
            padding: 0 6%;
          }
        }
        &:nth-child(5) {
          margin-top: 8%;
          .subtitle {
            padding: 0 8%;
          }
        }
      }
    }
  }
  .section-4 {
    .top-box {
      padding: 7%;
      background-color: #d3b889;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .title {
        color: var(--text-color-2);
      }
      .subtitle {
        margin-top: 1%;
        color: var(--text-color-2);
      }
    }
    .bottom-box {
      position: relative;
      .bg {
        width: 100%;
        height: auto;
        display: block;
      }
      .text-box {
        padding: 7% 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .subtitle {
          margin-top: 1.5%;
          :deep() p {
            margin-bottom: 1.5%;
            line-height: 1.2;
          }
        }
      }
    }
  }
  .section-5 {
    // 遮住圖片底線
    margin-top: -1px;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    position: relative;
    .section-box {
      padding: 12% 5% 12% 10%;
      width: 74%;
      border-right: 1px solid var(--border-color);
      background-color: var(--background-color-2);
      display: flex;
      align-items: center;
      justify-content: center;
      .product {
        width: 30%;
      }

      .text-box {
        width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .subtitle {
          margin-top: 3%;
        }
      }
    }
  }
  .section-6 {
    position: relative;
    .bg {
      width: 100%;
      height: auto;
      display: block;
    }
    .text-box {
      position: absolute;
      top: 50%;
      left: 15%;
      transform: translateY(-50%);
      width: 35%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      .point {
        padding-bottom: 3%;
        border-bottom: 1px solid var(--border-color-2);
        opacity: 0.3;
        .title {
          color: var(--text-color-2);
        }
        .subtitle {
          margin-top: 3%;
          color: var(--text-color-2);
        }
        &:not(:last-child) {
          margin-bottom: 5%;
        }
      }
      .active {
        opacity: 1;
      }
    }
  }
  .section-7 {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    .left {
      width: 20%;
      border-right: 1px solid var(--border-color);
      background-color: var(--background-color-1);
    }
    .section-box {
      padding: 7% 0;
      width: 80%;
      background-color: var(--background-color-2);
      .title {
        padding-left: 5%;
      }
      .subtitle {
        margin-top: 3%;
        margin-bottom: 5%;
        padding-left: 5%;
        width: 65%;
      }
      .text-box {
        border-top: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        .point {
          display: flex;
          align-items: center;
          .number {
            margin-right: 2%;
            margin-left: 4%;
            position: relative;
            .circle {
              width: 100%;
              height: auto;
              display: block;
            }
            p {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              // font-family: "NotoSansCJKtc";
              font-size: 1.8vw;
              font-weight: bold;
              color: var(--text-color-1);
            }
          }
          .subtitle {
            margin: 0%;
            padding-left: 0%;
            width: 52%;
          }
          .bold {
            margin: 0%;
            padding-left: 0%;
            width: 13%;
            // font-family: "NotoSansCJKtc";
            font-weight: bold;
          }
          &:nth-child(2) {
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
          }
        }
      }
    }
  }
  .section-8 {
    padding-top: 5%;
    background-color: var(--background-color-2);
    .cards {
      margin: 0 auto;
      width: 70%;
      display: flex;
      position: relative;
      z-index: 1;
      .card {
        width: 30%;
        opacity: 0.3;
        transition-duration: 0.3s;
        .item {
          .subtitle {
            margin-top: 5%;
          }
          .bold {
            margin-top: 0%;
            // font-family: "NotoSansCJKtc";
            font-weight: 500;
          }
        }
        &:nth-child(2) {
          margin: 0 3%;
        }
      }
      .active {
        opacity: 1;
      }
    }
    .arrow-box {
      margin: 1.5% auto 0;
      width: 70%;
      display: flex;
      justify-content: flex-end;
      position: relative;
      z-index: 1;
      .prevArrow {
        margin-right: 3%;
        transition-duration: 0.3s;
        width: 3%;
        &:hover {
          margin-right: 2.5%;
        }
      }
      .nextArrow {
        transition-duration: 0.3s;
        width: 3%;
        &:hover {
          margin-right: 0.5%;
        }
      }
    }
    .product {
      pointer-events: none;
      margin: 0 auto;
      padding-bottom: 2%;
      width: 70%;
      transition-duration: 0.3s;
      position: relative;
      z-index: 0;
    }
  }
  .section-9 {
    border-top: 1px solid var(--border-color);
    display: flex;
    .left {
      width: 20%;
      border-right: 1px solid var(--border-color);
      background-color: var(--background-color-1);
    }
    .section-box {
      width: 80%;
      background-color: var(--background-color-2);
      .point {
        padding: 2% 0;
        display: flex;
        align-items: center;
        .number {
          margin-left: 4%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .subtitle {
          margin-left: 2%;
          width: 14%;
          // font-family: "NotoSansCJKtc";
          font-weight: bold;
        }
        .content {
          margin-left: 5%;
          width: 50%;
          // font-family: "NotoSansCJKtc-Thin";
          font-weight: 300;
          line-height: 1.2;
          font-size: 1.05vw;
          letter-spacing: 1.1px;
          color: var(--text-color-1);
          :deep()p {
            margin-top: 1%;
            strong {
              // font-family: "NotoSansCJKtc";
              font-weight: bold;
            }
          }
        }
        &:nth-child(2) {
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }
      }
    }
  }
  .section-10 {
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    position: relative;
    .section-box {
      padding: 5% 5% 5% 10%;
      width: 74%;
      border-right: 1px solid var(--border-color);
      background-color: var(--background-color-2);
      display: flex;
      align-items: center;
      justify-content: center;

      .text-box {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title {
          position: relative;
          .arrow {
            position: absolute;
            top: 50%;
            right: -8%;
            transform: translateY(-50%);
            width: 4%;
          }
        }
        .subtitle {
          margin-top: 3%;
        }
      }
    }
  }
}
@media (max-width: 1280px) {
  .container {
    .section-3 {
      .section-box {
        .point {
          &:nth-child(4) {
            margin-right: 5%;
            .subtitle {
              padding: 0 0%;
            }
          }
          &:nth-child(5) {
            .subtitle {
              padding: 0 0%;
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
        .right {
          margin-top: 0%;
          padding-left: 3%;
          box-sizing: border-box;
          width: 65%;
          .title {
            padding-right: 21%;
          }
        }
      }
    }
    .section-2 {
      .section-box {
        .right {
          box-sizing: border-box;
          width: 75%;
          padding: 13% 10% 13% 4%;
        }
      }
    }
    .section-3 {
      .section-box {
        padding: 10% 0 20%;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        .point {
          margin-top: 10%;
          width: 80%;
          &:nth-child(1) {
            .subtitle {
              padding: 0 15%;
            }
          }
          &:nth-child(2) {
            .subtitle {
              padding: 0;
            }
          }
          &:nth-child(4) {
            margin-top: 10%;
            .subtitle {
              padding: 0;
            }
          }
          &:nth-child(5) {
            margin-top: 10%;
            .subtitle {
              padding: 0;
            }
          }
        }
      }
    }
    .section-4 {
      .top-box {
        padding: 7% 15%;
        .subtitle {
          margin-top: 5%;
          text-align: center;
        }
      }
      .bottom-box {
        .text-box {
          .subtitle {
            margin-top: 3%;
            :deep() p {
              margin-bottom: 3%;
            }
          }
        }
      }
    }
    .section-5 {
      .section-box {
        padding: 8% 10%;
        width: 70%;
        flex-direction: column-reverse;
        .product {
          margin-top: 8%;
          margin-right: auto;
          width: 50%;
        }

        .text-box {
          width: 85%;
          .title {
            padding-right: 25%;
            line-height: 1.1;
          }
        }
      }
    }
    .section-6 {
      .text-box {
        top: 45%;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        .point {
          &:not(:last-child) {
            margin-bottom: 8%;
          }
        }
      }
    }
    .section-7 {
      .left {
        width: 15%;
      }
      .section-box {
        padding: 15% 0 10% 0;
        width: 85%;
        .title {
          padding-left: 5%;
        }
        .subtitle {
          margin-top: 3%;
          margin-bottom: 5%;
          padding-left: 5%;
          width: 65%;
        }
        .text-box {
          .point {
            flex-direction: column;
            align-items: normal;
            .number {
              margin: 0;
              padding-left: 4%;
              border-bottom: 1px solid var(--border-color);
              display: flex;
              align-items: center;
              .circle {
                margin-right: 3%;
                width: 15%;
                position: relative;
                p {
                  font-size: 4.3vw;
                }
              }
            }
            .subtitle {
              width: 13%;
            }
            .content {
              padding: 4%;
              width: 73%;
            }
          }
        }
      }
    }
    .section-8 {
      padding: 10% 0;
      position: relative;
      .cards {
        width: 62%;
        .item {
          .subtitle {
            margin-top: 5%;
            :deep(p) {
              min-height: 31vw;
            }
          }
          .bold {
            margin-top: 0%;
            // font-family: "NotoSansCJKtc";
          }
        }
        &:nth-child(2) {
          margin: 0 3%;
        }
      }
      .arrow-box {
        position: absolute;
        bottom: 5%;
        width: 80%;
        .prevArrow {
          margin-right: 8%;
          width: 7%;
          &:hover {
            margin-right: 7.5%;
          }
        }
        .nextArrow {
          width: 7%;
          &:hover {
            margin-right: 0.5%;
          }
        }
      }
      .product {
        margin-top: 1%;
        width: 62%;
      }
    }
    .section-9 {
      .left {
        width: 15%;
      }
      .section-box {
        width: 85%;
        .point {
          padding: 3% 0;
          .number {
            width: 10%;
          }
          .subtitle {
            width: 18%;
          }
          .content {
            font-size: 2.8vw;
            letter-spacing: 1px;
            width: 58%;
            :deep() p {
              margin-top: 2%;
            }
          }
        }
      }
    }
    .section-10 {
      .section-box {
        padding: 20% 5% 20% 10%;
        box-sizing: border-box;
        text-align: center;
        width: 90%;
        .text-box {
          .title {
            .arrow {
              top: 263%;
              right: 0%;
              width: 5%;
            }
          }
        }
      }
    }
  }
}
@media (max-width: 475px) {
  .container {
    .section-1 {
      .section-box {
        .right {
          .title {
            padding-right: 12%;
          }
        }
      }
    }
    .section-3 {
      .section-box {
        .point {
          &:nth-child(1) {
            .subtitle {
              padding: 0 10%;
            }
          }
        }
      }
    }

    .section-7 {
      .section-box {
        .text-box {
          .point {
            .subtitle {
              width: 15%;
            }
            .content {
              width: 73%;
            }
          }
        }
      }
    }
  }
}
</style>
