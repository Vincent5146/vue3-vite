<script setup>
import { ref, reactive, watch, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useMainStore } from "../store/main";
import { useRoute } from "vue-router";
import { apiGetProductBrands, apiGetProductList, apiGetProduct } from "../api/index";

const route = useRoute();
const mainStore = useMainStore();
const language = computed(() => mainStore.currentLanguage);

let productBrandsData = computed(() => mainStore.productBrandsData);
let productListData = computed(() => mainStore.productListData);
let showProductList = computed(() => mainStore.showProductListData);
let productText = computed(() => mainStore.product[mainStore.currentLanguage - 1]);

let noMatch = computed(() => mainStore.product[mainStore.currentLanguage - 1].noMatch);

const changeShowModal = () => {
  mainStore.showModal = false;
};

const searchBrandText = ref("");
let visible1 = ref(false);
const brand = computed(() => mainStore.currentBrand);
const brandList = computed(() => Object.keys(productBrandsData.value));
//搜尋功能
const filteredBrandList = computed(() => {
  const filteredBrands = brandList.value.filter((brand) =>
    brand.toLowerCase().includes(searchBrandText.value.toLowerCase()),
  );
  return filteredBrands;
});

const searchModelText = ref("");
let visible2 = ref(false);
const option2 = ref("MODEL");
const list2 = computed(() => {
  if (brand.value !== "BRAND") {
    return productBrandsData.value[brand.value];
  } else {
    const combinedData = [];
    for (const brandName in productBrandsData.value) {
      const brandData = productBrandsData.value[brandName];
      combinedData.push(...brandData);
    }
    return combinedData;
  }
});

const filteredModelList = computed(() => {
  const filteredModels = list2.value.filter((model) =>
    model.name.toLowerCase().includes(searchModelText.value.toLowerCase()),
  );
  return filteredModels;
});

const toggle = (index) => {
  if (index === 1) {
    if (Object.keys(showProductList.value).length < 11) {
      // brand.value = "BRAND";
      // option2.value = "MODEL";
      mainStore.showProductListData = mainStore.productListData;
    }
    option2.value = "MODEL";
    visible1.value = !visible1.value;
    visible2.value = false;
  } else if (index === 2 && brand.value !== "BRAND") {
    visible2.value = !visible2.value;
    visible1.value = false;
  }
  focusInput(index);
};
const select = (index, option) => {
  // if (brand.value !== "BRAND" && option2.value !== "MODEL") {
  //   mainStore.currentBrand = "BRAND";
  //   option2.value = "MODEL";
  // }
  if (index === 1) {
    mainStore.currentBrand = option;
    // alertText = "MODEL";
    searchBrandText.value = "";
    // showAlert.value = true;
  } else if (index === 2 && brand.value !== "BRAND") {
    option2.value = option;
    searchModelText.value = "";
    searchProducts();
    // showAlert.value = false;
  } else {
    // alertText = "BRAND FIRST";
    // showAlert.value = true;
  }
};
const input1 = ref(null);
const input2 = ref(null);
const focusInput = (index) => {
  nextTick(() => {
    if (index === 1) {
      if (input1.value) {
        input1.value.focus();
      }
    } else if (index === 2) {
      if (input2.value) {
        input2.value.focus();
      }
    }
  });
};
// 全域點擊事件監聽器
const handleClickOutside = (event) => {
  const isClickInside = event.target.closest(".aselect");
  if (!isClickInside) {
    visible1.value = false;
    visible2.value = false;
  }
};

// 搜尋欄
// const searchText = ref("");

const searchProducts = () => {
  if (Object.keys(productListData.value).length > 0) {
    const filteredProducts = Object.values(productListData.value).filter((product) => {
      const text1 = product.brand_datas.some((brandData) => brandData.name === brand.value);
      const text2 = product.brand_model_datas.some(
        (modelData) => modelData.name === option2.value.name,
      );
      return text1 && text2;
    });
    mainStore.showProductListData = [...filteredProducts];
  }
};

const getProductDetailLink = (productId) => {
  const baseUrl = window.location.origin;
  const langUrl = window.location.href;
  const urlParts = langUrl.split("?");
  const lang = urlParts[1];
  if (window.location.hostname === "spinfit-eartip.com") {
    return `${baseUrl}/#/product/productdetail/${productId}?${lang}`;
  } else {
    return `${baseUrl}/spinfit/#/product/productdetail/${productId}?${lang}`;
  }
};
const reset = () => {
  mainStore.currentBrand = "BRAND";
  option2.value = "MODEL";
  mainStore.showProductListData = mainStore.productListData;
};
const getProductListData = async () => {
  try {
    const res = await apiGetProductList({
      params: {
        language: language.value,
      },
    });
    mainStore.productListData = res.data.message;
    mainStore.showProductListData = mainStore.productListData;
  } catch (err) {
    console.log(err);
  }
};

watch(
  () => mainStore.currentLanguage,
  async () => {
    await getProductListData();
    if (mainStore.currentBrand !== "BRAND" && option2.value.name !== "MODEL") {
      await searchProducts();
    }
  },
);
onMounted(async () => {
  await getProductListData();
  if (route.path === "/product") {
    mainStore.currentBrand = "BRAND";
    option2.value = "MODEL";
    await searchProducts();
    mainStore.showProductListData = mainStore.productListData;
  }
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <div class="products">
    <!-- <div class="search">
      <label class="check" for="input">
        <img src="../assets/images/navbar_icon.png" alt=""
      /></label>
      <input id="input" type="text" :placeholder="inputText" v-model="searchText" />
    </div> -->
    <div class="select">
      <div class="aselect">
        <div class="selector">
          <!-- <input
            class="label input"
            type="text"
            v-model="searchBrandText"
            :placeholder="brand"
          /> -->
          <div class="label" @click="toggle(1)">
            <!-- <span v-if="searchBrandText.length !== 0">{{ searchBrandText }}</span>
            <span v-else>{{ brand }}</span> -->
            <span v-if="brand === 'BRAND'">{{ productText.brand }}</span>
            <span v-else>{{ brand }}</span>
          </div>
          <div class="arrow" :class="{ expanded: visible1 }"></div>
          <div :class="{ hidden: !visible1, visible1 }">
            <ul>
              <li class="subtitle">
                <input
                  ref="input1"
                  class="inputBox subtitle"
                  type="text"
                  v-model="searchBrandText"
                  placeholder=""
                />
              </li>
              <li
                class="subtitle"
                :class="{ current: item === brand }"
                v-for="item in filteredBrandList"
                @click="
                  select(1, item);
                  toggle(1);
                "
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="aselect">
        <div class="selector">
          <!-- <input
            class="label input"
            type="text"
            v-model="searchModelText"
            :placeholder="option2.name || `MODEL`"
          /> -->
          <div class="label" @click="toggle(2)">
            <!-- <span v-if="searchModelText.length !== 0">{{ searchModelText }}</span>
            <span v-else>{{ option2.name || "MODEL" }}</span> -->
            <!-- <span>{{ option2.name || "MODEL" }}</span> -->
            <span>{{ option2.name || productText.model }}</span>
          </div>
          <div class="arrow" :class="{ expanded: visible2 }"></div>
          <div :class="{ hidden: !visible2, visible2 }">
            <ul>
              <li class="subtitle">
                <input
                  ref="input2"
                  class="inputBox subtitle"
                  type="text"
                  v-model="searchModelText"
                  placeholder=""
                />
              </li>
              <li
                class="subtitle"
                :class="{ current: item === option2 }"
                v-for="item in filteredModelList"
                @click="
                  select(2, item);
                  toggle(2);
                "
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="refresh" @click="reset">
        <img src="../assets/images/refresh.png" alt="" />
      </div>
    </div>
    <div class="subtitle alert">
      {{ productText.alertText.top }}<br />{{ productText.alertText.bottom }}
    </div>
    <div class="products-box">
      <template v-if="Object.keys(showProductList).length > 0">
        <a
          :href="getProductDetailLink(item.product_id)"
          target="_blank"
          class="product"
          v-for="(item, index) in showProductList"
          @click="changeShowModal"
          :key="item.title"
        >
          <div class="pic">
            <img :src="item.productImage" alt="" />
          </div>
          <div class="name">
            <div class="subtitle">{{ item.title }}</div>
          </div>
        </a>
      </template>
      <template v-else>
        <div class="title" style="margin: 0 auto">{{ noMatch }}</div>
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.products {
  background-color: var(--background-color-2);
  padding-bottom: 5%;
  .search {
    margin-top: 5%;
    width: 98%;
    display: flex;
    position: relative;
    input {
      padding: 1% 3%;
      outline: none;
      border-radius: 0;
      border: 0;
      border-bottom: 1.5px solid rgb(0, 0, 0, 0.4);
      // font-family: "NotoSansCJKtc";
      font-weight: 500;
      font-size: 0.8vw;
      line-height: 1.2;
      letter-spacing: 0.4px;
      color: var(--text-color-1);
      width: 100%;
    }
    .check {
      pointer-events: none;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      transition: all 0.3s ease;
      display: flex;
    }
  }
  .select {
    margin-top: 3%;
    display: flex;
    position: relative;
    z-index: 0;
    .aselect {
      margin-right: 2%;
      width: 20%;
      display: flex;
      .selector {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
        .arrow {
          position: absolute;
          right: 7%;
          top: 40%;
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 10px solid #888;
          transform: rotateZ(0deg) translateY(0px);
          transition-duration: 0.3s;
          transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
        }
        .expanded {
          transform: rotateZ(180deg) translateY(2px);
        }
        .label {
          padding: 5% 5% 5% 10%;
          cursor: pointer;
          height: 100%;
          /* Reset Select */
          appearance: none;
          outline: 0;
          border: 0;
          box-shadow: none;
          border: 2px solid var(--border-color-3);
          border-radius: 50px;
          // font-family: "NotoSansCJKtc";
          font-weight: 500;
          font-size: 0.8vw;
          line-height: 1.2;
          letter-spacing: 0.7px;
          color: var(--text-color-1);
          span {
            vertical-align: middle;
          }
        }
        .input {
          // 為了避免在手機上input字體小於16px會zoomin
          position: absolute;
          top: 0;
          width: 70%;
          height: 50%;
          font-size: 16px;
          opacity: 0;
        }
      }
      ul {
        width: 120%;
        list-style-type: none;
        padding: 0;
        margin: 0;
        border: 1px solid gainsboro;
        border-radius: 15px;
        overflow-y: auto;
        max-height: 200px;
        position: absolute;
        top: 105%;
        z-index: 4;
        background: var(--background-color-1);
      }
      li {
        border-bottom: 1px solid var(--border-color);
        padding: 12px;
        color: var(--text-color-1);
        .inputBox {
          cursor: pointer;
          width: 100%;
          height: 100%;
          /* Reset Select */
          appearance: none;
          outline: 0;
          border: 0;
          box-shadow: none;
          background: transparent;
          span {
            vertical-align: middle;
          }
        }
        &:hover {
          color: var(--text-color-2);
          background: #d6bd92;
        }
        &:first-child {
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
        }
        &:last-child {
          border-bottom: none;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
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
    .refresh {
      width: 3%;
      display: flex;
      align-items: center;
      img {
        filter: grayscale(100%) invert(50%);
      }
    }
  }
  .alert {
    margin-top: 1%;
    font-size: 0.85vw;
  }
  .products-box {
    margin-top: 2%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .product {
      margin: 1% 2% 1% 0;
      width: 23%;
      display: flex;
      flex-direction: column;
      .pic {
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .name {
        margin-top: 4%;
        min-height: 0.5rem;
        .subtitle {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      /* 選擇每排的第一個元素 */
      &:nth-child(4n + 1) {
        margin-left: 0%;
      }
    }
  }

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #b3b3b3;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
}
@media (max-width: 1440px) {
  .products {
    .search {
      input {
        padding-left: 5%;
      }
    }
  }
}
@media (max-width: 1280px) {
  .products {
    .select {
      .aselect {
        width: 25%;
      }
    }
  }
}
@media (max-width: 768px) {
  .products {
    // .search {
    //   width: 100%;
    //   input {
    //     padding: 1% 0 1% 8%;
    //     font-size: 12px;
    //   }
    // }
    .select {
      margin-top: 5%;
      .aselect {
        width: 45%;
        .selector {
          .arrow {
            position: absolute;
            right: 10px;
            top: 40%;
            width: 0;
            height: 0;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-top: 10px solid #888;
            transform: rotateZ(0deg) translateY(0px);
            transition-duration: 0.3s;
            transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
          }
          .label {
            font-size: 2vw;
            span {
              vertical-align: middle;
            }
          }
          .input {
            // 為了避免在手機上input字體小於16px會zoomin
            position: absolute;
            top: 0;
            width: 70%;
            height: 50%;
            font-size: 16px;
            opacity: 0;
          }
        }
        li {
          font-size: 2.8vw;
          letter-spacing: 1px;
          padding: 12px;
          color: var(--text-color-1);
          &:hover {
            color: var(--text-color-2);
            background: #d6bd92;
          }
          &:first-child {
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
          }
          &:last-child {
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
          }
        }
      }
      .refresh {
        width: 8%;
      }
    }

    .alert {
      margin-top: 2%;
      font-size: 2.3vw;
    }
    .products-box {
      margin-top: 5%;
      justify-content: space-between;
      .product {
        margin: 3% 0;
        width: 48%;
        .name {
          .subtitle {
            // min-height: 50px;
          }
        }
      }
    }
  }
}
@media (max-width: 475px) {
  .products {
    .search {
      input {
        padding: 1% 0 1% 13%;
      }
    }
  }
}
</style>
