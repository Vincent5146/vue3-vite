<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useMainStore } from "../store/main";
import { apiGetProduct } from "../api/index";
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

const mainStore = useMainStore();
const route = useRoute();
const router = useRouter();

const language = computed(() => mainStore.currentLanguage);
const lang = computed(() => mainStore.className[language.value - 1]);

const modules = [FreeMode, Navigation, Thumbs];
const thumbsSwiper = ref(null);
const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

let swiper1 = ref(null);
let currentSlideIndex = ref(0);
const onSwiper = (swiper) => {
  swiper1 = swiper;
};
const handleSlideTo = (index) => {
  swiper1.slideTo(0);
  currentSlideIndex.value = swiper1.activeIndex;
  currentSlideIndex.value = index;
};

let productData = ref(mainStore.productData);
let product = computed(() => productData.value);

let productSize = computed(() => {
  // size_id=12為其他圖片  不須顯示
  if (product.value.productimages) {
    return product.value.productimages.filter((item) => item.size_id !== 12);
  }
  return [];
});

const groupedData = computed(() => {
  const productValue = product.value;
  if (productValue && productValue.productimages) {
    return productValue.productimages.reduce(
      (result, currentItem) => {
        if (currentItem.size_id === 12) {
          result.otherIamges.push(currentItem);
        } else {
          result.sizeImages.push(currentItem);
        }
        return result;
      },
      { otherIamges: [], sizeImages: [] },
    );
  }
  return { otherIamges: [], sizeImages: [] };
});

const otherImages = computed(() => groupedData.value.otherIamges);
const sizeImages = computed(() => groupedData.value.sizeImages);

let contentTop = computed(() => modifiedApiData(productData.value.content_up));
let contentDetails = computed(() => productData.value.productdetails);
let contentDown = computed(() => modifiedApiData(productData.value.content_down));

const swiper2direction = computed(() => {
  if (mainStore.isMobile) {
    return "vertical";
  } else {
    return "horizontal";
  }
});
const swiper2view = computed(() => {
  if (mainStore.isMobile) {
    return 3;
  } else {
    return "auto";
  }
});
const swiper2space = computed(() => {
  if (mainStore.isMobile) {
    return 5;
  } else {
    return 5;
  }
});
const modifiedApiData = (data) => {
  if (data) {
    if (mainStore.isMobile) {
      return data.replace(/<p>&nbsp;<\/p>/g, '<p style="max-height: 15px;">&nbsp;</p>');
    } else {
      return data.replace(/<p>&nbsp;<\/p>/g, '<p style="max-height: 20px;">&nbsp;</p>');
    }
  }
};
const checkLanguage = (id, data) => {
  const productId = id;
  // 从 API 数据中查找与 productId 匹配的对象
  const associatedLanguage = data.associate.find((item) => item.product_id == productId);
  if (associatedLanguage) {
    mainStore.currentLanguage = associatedLanguage.language;
  }
};
const getProductData = async (id) => {
  try {
    const res = await apiGetProduct({
      params: {
        id,
      },
    });
    mainStore.productData = res.data.message;
    await checkLanguage(id, mainStore.productData);
  } catch (err) {
    console.log(err);
  }
};
watch(
  () => mainStore.currentLanguage,
  () => {
    let languageFilteredData = mainStore.productData.associate.find(
      (item) => item.language === mainStore.currentLanguage.toString(),
    );
    router.push({
      name: "productdetail",
      params: { productId: languageFilteredData.product_id },
      query: { lang: lang.value },
    });
    getProductData(languageFilteredData.product_id);
  },
);

watch(
  () => mainStore.productData,
  () => {
    productData.value = mainStore.productData;
  },
);
onMounted(async () => {
  mainStore.productData = [];
  if (route.params.productId) {
    await getProductData(route.params.productId);
  }
});
</script>
<template>
  <div class="container">
    <div class="top-box">
      <div class="title">{{ product.title }}</div>
      <div class="content-box">
        <div class="left">
          <div class="size">
            <p class="subtitle">SIZE</p>
            <div class="icons">
              <div
                v-for="(item, index) in productSize"
                :key="index"
                class="icon"
                :class="[index === currentSlideIndex ? 'active' : '']"
                @click="handleSlideTo(index)"
              >
                <p class="subtitle">{{ item.size }}</p>
                <img
                  v-show="index === currentSlideIndex"
                  src="../assets/images/size_circle_active.png"
                  alt=""
                  class="circle"
                />
                <img
                  v-show="index !== currentSlideIndex"
                  src="../assets/images/size_circle.png"
                  alt=""
                  class="circle"
                />
              </div>
            </div>
          </div>
          <div class="feature">
            <p class="subtitle">FEATURE</p>
            <ol v-html="product.content_feature"></ol>
          </div>
          <!-- <div class="submit_button">WHERE TO BUY</div> -->
          <router-link class="submit_button" :to="{ name: 'wheretobuy', query: { lang: lang } }"
            >WHERE TO BUY
          </router-link>
        </div>
        <div class="right">
          <swiper
            @swiper="onSwiper"
            :direction="swiper2direction"
            :slidesPerView="1"
            :spaceBetween="0"
            :navigation="{ nextEl: '.nextArrow', prevEl: '.prevArrow' }"
            :thumbs="{ swiper: thumbsSwiper }"
            :modules="modules"
            class="swiper-1"
          >
            <div class="arrow-box">
              <div class="prevArrow">
                <img src="../assets/images/arrow_left.png" alt="" />
              </div>
              <div class="nextArrow">
                <img src="../assets/images/arrow_right.png" alt="" />
              </div>
            </div>
            <swiper-slide>
              <img
                v-if="sizeImages[currentSlideIndex]"
                :src="sizeImages[currentSlideIndex].image"
                alt=""
              />
            </swiper-slide>
            <swiper-slide v-for="(item, index) in otherImages" :key="index">
              <img :src="item.image" alt="" />
            </swiper-slide>
          </swiper>
          <swiper
            @swiper="setThumbsSwiper"
            :direction="swiper2direction"
            :slidesPerView="swiper2view"
            :spaceBetween="swiper2space"
            :freeMode="true"
            :modules="modules"
            class="swiper-2"
          >
            <swiper-slide>
              <img
                v-if="sizeImages[currentSlideIndex]"
                :src="sizeImages[currentSlideIndex].image"
                alt=""
              />
            </swiper-slide>
            <swiper-slide v-for="(item, index) in otherImages" :key="index">
              <img :src="item.image" alt="" />
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <div class="subtitle note">
        *All images shown are for display purposes. The actual product might vary in color.
      </div>
    </div>
    <div class="bottom-box">
      <div class="left"></div>
      <div class="content-box">
        <div class="up" v-if="contentTop !== ''" v-html="contentTop"></div>
        <div class="details">
          <div
            class="detail"
            v-for="item in contentDetails"
            v-if="contentDetails && contentDetails.length > 0"
          >
            <div class="pic">
              <img :src="item.image" alt="" />
            </div>
            <div class="title">{{ item.title }}</div>
            <div class="content" v-html="item.content"></div>
          </div>
        </div>
        <div class="bottom" v-if="contentDown !== ''" v-html="contentDown"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  background-color: var(--background-color-1);
  box-sizing: border-box;
  .top-box {
    padding-top: 8%;
    background-color: var(--background-color-2);
    border-right: 1px solid var(--border-color);
    width: 82.5%;
    box-sizing: border-box;
    .title {
      margin-left: auto;
      width: 78%;
      padding-right: 36%;
      box-sizing: border-box;
    }
    .content-box {
      margin-left: auto;
      width: 78%;
      display: flex;
      .left {
        width: 50%;
        .name {
          font-size: 2.4vw;
          font-weight: bold;
          color: var(--text-color-1);
        }
        .size {
          margin-top: 5%;
          .subtitle {
            font-weight: bold;
          }
          .icons {
            margin-top: 2%;
            display: flex;
            align-items: center;
            .icon {
              margin: 0 1%;
              width: 11%;
              display: flex;
              position: relative;
              p {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
            .active {
              .subtitle {
                color: var(--text-color-2);
              }
            }
          }
        }
        .feature {
          margin-top: 5%;
          .subtitle {
            font-weight: bold;
          }
          :deep(ol) {
            li {
              margin: 2% 0;
              list-style: disc;
              font-weight: 300;
              line-height: 1.2;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-1);
            }
          }
          :deep(ul) {
            margin-top: 2%;
            margin-left: 4%;
            li {
              margin: 2% 0;
              list-style: disc;
              font-weight: 300;
              line-height: 1.2;
              font-size: 1.05vw;
              letter-spacing: 1.1px;
              color: var(--text-color-1);
            }
          }
          :deep(p) {
            margin-bottom: 0.5%;
            font-weight: 300;
            line-height: 1.2;
            font-size: 1.05vw;
            letter-spacing: 1.1px;
            color: var(--text-color-1);
            strong {
              font-weight: bold;
            }
          }
        }
        .submit_button {
          margin-top: 9%;
          padding: 1.5% 2%;
          width: 21%;
          min-width: 110px;
          &:hover {
            transform: scale(1.1); /* 放大模態內容 */
            transition: transform 0.3s;
          }
        }
      }
      .right {
        margin-top: -6%;
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .swiper-1 {
          margin: 0 auto;
          width: 75%;
          overflow-y: visible;
          position: relative;
          z-index: 2;
          .arrow-box {
            position: absolute;
            bottom: -17%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
            width: 100%;
            display: flex;
            justify-content: space-between;
            .prevArrow {
              cursor: pointer;
              width: 10%;
              transition-duration: 0.3s;
              &:hover {
                margin-left: 5px;
              }
            }
            .nextArrow {
              cursor: pointer;
              width: 10%;
              transition-duration: 0.3s;
              &:hover {
                margin-right: 5px;
              }
            }
          }
          .swiper-slide {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .swiper-slide-active {
            opacity: 1;
          }
        }
        .swiper-2 {
          cursor: pointer;
          margin: 0 auto;
          padding: 1% 0;
          width: 55%;
          position: relative;
          z-index: 2;
          .swiper-slide {
            width: 31.5%;
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
    .note {
      margin-top: 5%;
      padding-bottom: 2%;
      margin-left: 22.5%;
      font-size: 0.95vw;
      color: var(--border-color);
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
      .details {
        margin-top: 7.5%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        .detail {
          width: 23%;
        }
        .title {
          margin: 5% 0 2%;
          font-size: 1.2vw;
          font-weight: bold;
          color: var(--text-color-1);
          letter-spacing: 1.1px;
        }
      }
      .bottom {
        margin-top: 10%;
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
        margin-bottom: 0.5%;
        font-weight: 300;
        line-height: 1.2;
        font-size: 1.05vw;
        letter-spacing: 1.1px;
        color: var(--text-color-1);
        img {
          margin: 0 auto;
        }
      }
      :deep(ol) {
        margin-bottom: 0.5%;
        margin-left: 3%;
        font-weight: 300;
        line-height: 1.2;
        font-size: 1.05vw;
        letter-spacing: 1.1px;
        color: var(--text-color-1);
      }
      :deep(ul) {
        margin-bottom: 0.5%;
        margin-left: 3%;
        font-weight: 300;
        line-height: 1.2;
        font-size: 1.05vw;
        letter-spacing: 1.1px;
        color: var(--text-color-1);
      }
    }
  }
}
@media (max-width: 768px) {
  .container {
    .top-box {
      padding-top: 8%;
      width: 85%;
      .title {
        margin-left: auto;
        width: 78%;
        display: flex;
        flex-direction: column;
        span {
          margin-top: 2%;
        }
      }
      .content-box {
        margin-left: auto;
        width: 80%;
        display: flex;
        flex-direction: column-reverse;
        .left {
          width: 80%;
          .name {
            font-size: 2.8vw;
          }
          .size {
            .icons {
              .icon {
                width: 20%;
              }
            }
          }
          .feature {
            :deep(p) {
              font-size: 2.8vw;
              letter-spacing: 1.1px;
              display: block;
              word-wrap: break-word;
              strong {
                font-size: 2.8vw;
                letter-spacing: 1.1px;
              }
            }
            :deep(ol) {
              li {
                font-size: 2.8vw;
                letter-spacing: 1.1px;
                strong {
                  font-size: 2.8vw;
                  letter-spacing: 1.1px;
                }
              }
            }
            :deep(ul) {
              margin-left: 6%;
              li {
                font-size: 2.8vw;
                letter-spacing: 1.1px;
                strong {
                  font-size: 2.8vw;
                  letter-spacing: 1.1px;
                }
              }
            }
          }
          .submit_button {
            padding: 3.5%;
            width: 45%;
          }
        }
        .right {
          margin-top: 3%;
          width: 100%;
          flex-direction: row;
          .swiper-1 {
            margin: 0 auto;
            width: 75%;
            height: 3rem;
            overflow-y: hidden;
            position: relative;
            z-index: 2;
            .swiper-wrapper {
              width: 100%;
              height: 100%;
              .swiper-slide {
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
            .arrow-box {
              display: none;
            }
          }
          .swiper-2 {
            cursor: pointer;
            margin: 0 auto;
            padding-left: 5%;
            box-sizing: border-box;
            width: 55%;
            height: 2.4rem;
            position: relative;
            z-index: 2;
            .swiper-wrapper {
              width: 100%;
              height: 100%;
              .swiper-slide {
                width: 33%;
                border: 1px solid var(--border-color);
                display: flex;
                align-items: center;
                justify-content: center;
                &:not(:last-child) {
                  margin-bottom: 5px;
                  margin-right: 0;
                }
              }
            }
          }
        }
      }
      .note {
        margin-top: 2%;
        padding-bottom: 10%;
        margin-right: 5%;
        font-size: 2.4vw;
      }
    }
    .bottom-box {
      .left {
        width: 15%;
      }
      .content-box {
        margin-bottom: 5%;
        padding-left: 5%;
        width: 70%;
        box-sizing: border-box;
        .up {
          margin-top: 10%;
        }
        .details {
          margin-top: 4.5%;
          flex-wrap: wrap;
          .detail {
            margin-top: 3%;
            width: 45%;
          }
          .title {
            margin: 5% 0 2%;
            // font-family: "NotoSansCJKtc";
            font-weight: 500;
            font-size: 2.8vw;
            letter-spacing: 1.1px;
          }
        }
        .bottom {
          margin-top: 20%;
        }
        :deep(h1) {
          margin-bottom: 2%;
          font-size: 3.2vw;
          letter-spacing: 1.1px;
        }
        :deep(h2) {
          margin-bottom: 2%;
          font-size: 2.8vw;
          letter-spacing: 1.1px;
        }
        :deep(h6) {
          margin-bottom: 2%;
          strong {
            font-size: 2.8vw;
            letter-spacing: 1.1px;
          }
        }
        :deep(p) {
          margin-bottom: 2%;
          font-size: 2.8vw;
          letter-spacing: 1.1px;
          display: block;
          word-wrap: break-word;
          strong {
            font-size: 2.8vw;
            letter-spacing: 1.1px;
          }
        }
        :deep(ol) {
          margin-bottom: 2%;
          margin-left: 6%;
          font-size: 2.8vw;
          letter-spacing: 1.1px;
          strong {
            font-size: 2.8vw;
            letter-spacing: 1.1px;
          }
        }
        :deep(ul) {
          margin-bottom: 2%;
          margin-left: 6%;
          font-size: 2.8vw;
          letter-spacing: 1.1px;
          strong {
            font-size: 2.8vw;
            letter-spacing: 1.1px;
          }
        }
      }
    }
  }
}
@media (max-width: 600px) {
  .container {
    .top-box {
      .content-box {
        .right {
          .swiper-1 {
            height: 2.7rem;
          }
          .swiper-2 {
            height: 2.1rem;
          }
        }
      }
    }
  }
}
@media (max-width: 475px) {
  .container {
    .top-box {
      .content-box {
        .right {
          .swiper-1 {
            height: 2rem;
          }
          .swiper-2 {
            height: 1.6rem;
          }
        }
      }
    }
    .bottom-box {
      .content-box {
        .details {
          .detail {
            .content {
              min-height: 0.6rem;
            }
          }
        }
      }
    }
  }
}
@media (max-width: 425px) {
  .container {
    .top-box {
      .content-box {
        .right {
          .swiper-1 {
            height: 1.8rem;
          }
          .swiper-2 {
            height: 1.45rem;
          }
        }
      }
    }
  }
}
</style>
