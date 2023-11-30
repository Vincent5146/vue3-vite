<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useMainStore } from "../store/main";
import axios from "axios";
import { apiGetMarkets } from "../api/index";
import Map from "../components/Map.vue";

const mainStore = useMainStore();

const language = computed(() => mainStore.currentLanguage);
let markets = computed(() => mainStore.marketsData);
let searchMarkets = computed(() => mainStore.searchMarketsData);
let showMarkets = ref([]);

// Map放大至該國家
const selectedCountry = ref(null);

function handleClickCountry(country) {
  selectedCountry.value = country.country;
  const selectedCountryData = markets.value.find((item) => item.country === country.country);
  mainStore.flyto = [selectedCountryData.lng, selectedCountryData.lat];
  mainStore.flytocountry = selectedCountry.value;
  // 重置 mainStore.markerClicked 變數
  mainStore.markerClicked = false;
}

// 標題是否顯示
const showTitle = ref(true);
const showSearch = ref(true);
const handleMapHover = (emitData) => {
  showTitle.value = emitData;
};
// const handleMapLeave = (emitData) => {
//   showTitle.value = emitData;
// };
const handleMapClick = (emitData) => {
  showSearch.value = emitData;
};

// 手機板下拉選單
let visible = ref(false);
const option = ref("SEARCH");

const toggle = (index) => {
  if (index === 1) {
    visible.value = false;
  } else {
    visible.value = !visible.value;
  }
};
const select = (item) => {
  option.value = item;
  searchText.value = "";
};

// 搜尋欄
const searchText = ref("");
const searchCountry = (string) => {
  apiGetMarkets({
    params: {
      language: language.value,
      search: string,
    },
  })
    .then((res) => {
      mainStore.searchMarketsData = res.data.message;
      showMarkets.value = mainStore.searchMarketsData;
    })
    .catch((err) => {
      console.log(err);
    });
};

watch(
  () => searchText.value,
  () => {
    if (searchText.value === "") {
      showMarkets.value = markets.value;
    } else {
      searchCountry(searchText.value);
      if (visible.value === false) {
        toggle();
      }
    }
  },
);
onMounted(() => {
  showMarkets.value = markets.value;
});
</script>
<template>
  <div id="app">
    <div class="title-box">
      <div class="title" v-show="showTitle">WHERE TO BUY</div>
      <div class="subtitle" v-show="showTitle">
        Premium soft silicone with the Patented ergonomic design provides outstanding and lasting
        comfort
      </div>
      <div class="chooses" v-show="showSearch">
        <!-- <div class="search">
          <div class="img" @click="toggle()">
            <img src="../assets/images/navbar_icon.png" alt="" />
          </div>
          <input type="text" placeholder="SEARCH" v-model="searchText" @click="toggle(1)" />
        </div> -->
        <div class="aselect" :data-option="option" :data-showMarkets="showMarkets">
          <div class="selector" @click="toggle()">
            <input class="label input" type="text" v-model="searchText" :placeholder="option" />
            <div class="label">
              <span v-if="searchText.length !== 0">{{ searchText }}</span>
              <span v-else>{{ option }}</span>
            </div>
            <div class="arrow" :class="{ expanded: visible }"></div>
            <div :class="{ hidden: !visible, visible }">
              <ul>
                <li
                  :class="{ current: item === option }"
                  v-for="item in showMarkets"
                  @click="
                    select(item.country);
                    handleClickCountry(item);
                    handleMapHover(false);
                  "
                >
                  {{ item.country }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sidebar">
      <div class="search">
        <div class="img" @click="searchCountry(searchText)">
          <img src="../assets/images/navbar_icon.png" alt="" />
        </div>
        <input type="text" placeholder="SEARCH" v-model="searchText" />
      </div>
      <ul class="countries" @mouseover="handleMapHover(false)">
        <li
          class="country"
          v-for="item in showMarkets"
          :key="item"
          @click="handleClickCountry(item)"
          :class="{ active: item === selectedCountry }"
        >
          {{ item.country }}
        </li>
      </ul>
    </div>
    <Map @mapClick="handleMapClick" @mapHover="handleMapHover"></Map>
  </div>
</template>
<style lang="scss" scoped>
#app {
  width: 100%;
  display: flex;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  .title-box {
    position: absolute;
    top: 10%;
    right: 20%;
    z-index: 1;
    width: 32%;
    .title {
      pointer-events: none;
    }
    .subtitle {
      pointer-events: none;
      margin-top: 3%;
    }
    .chooses {
      display: none;
    }
  }
  .sidebar {
    margin-left: auto;
    padding-top: 7%;
    // padding-bottom: 5%;
    width: calc(35% - 1px);
    background-color: #f2f2f4;
    border-right: 1px solid var(--border-color);
    .search {
      cursor: pointer;
      margin-left: 5%;
      margin-bottom: 5%;
      padding: 0.5% 1%;
      width: 10%;
      min-width: 200px;
      border: 2px solid var(--border-color-3);
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .img {
        width: 11%;
      }
      input {
        margin-left: 5px;
        border: none;
        outline: none;
        width: 80%;
        background-color: #f6f6f6;
        font-size: 13px;
      }
    }
    .countries {
      height: 570px;
      overflow-y: auto; /* 設置垂直滾動 */
      border-top: 1px solid var(--border-color);
      .country {
        cursor: pointer;
        padding: 2% 0 2% 5%;
        border-right: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        // font-family: "NotoSansCJKtc-Thin";
        font-weight: 300;
        line-height: 1.2;
        font-size: 1.2vw;
        letter-spacing: 1.3px;
        color: var(--text-color-1);
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
#map {
  flex: 2; /* 佔用可用空間的比例 */
  position: relative;
  // z-index: 0;
}

@media (max-width: 768px) {
  #map {
    width: 100%;
    height: 70vh;
  }
  #app {
    .title-box {
      width: 70%;
      top: 5%;
      right: 50%;
      transform: translateX(50%);
      .chooses {
        margin-top: 3%;
        display: flex;
        position: relative;
        z-index: 0;
        .search {
          margin-right: 1.5%;
          padding: 0.5% 4%;
          width: 32%;
          background-color: #f6f6f6;
          border: 2px solid var(--border-color-3);
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          .icon {
            position: absolute;
            top: 50%;
            left: 0%;
            transform: translateX(-50%);
          }
          input {
            margin-left: 5px;
            border: none;
            outline: none;
            width: 100%;
            background-color: #f6f6f6;
            font-weight: bold;
            font-size: 2vw;
          }
        }
        .aselect {
          width: 65%;
          display: flex;
          align-items: center;
          justify-content: center;
          .selector {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 1;
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
            .expanded {
              transform: rotateZ(180deg) translateY(2px);
            }
            .label {
              padding: 5% 9%;
              cursor: pointer;
              height: 100%;
              /* Reset Select */
              appearance: none;
              outline: 0;
              border: 0;
              box-shadow: none;
              background-color: #f6f6f6;
              border: 2px solid var(--border-color-3);
              border-radius: 50px;
              // font-family: "NotoSansCJKtc";
              font-weight: bold;
              font-size: 2vw;
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
            // font-family: "NotoSansCJKtc-Thin";
            font-weight: 300;
            line-height: 1.2;
            font-size: 2.8vw;
            letter-spacing: 1px;
            color: var(--text-color-1);
            overflow-y: auto;
            max-height: 250px;
            border-radius: 15px;
            position: absolute;
            top: 105%;
            z-index: 4;
            background: var(--background-color-1);
          }
          li {
            padding: 5% 9%;
            color: var(--text-color-1);
            &:hover {
              color: var(--text-color-1);
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
    }
    .sidebar {
      display: none;
    }
  }
}
</style>
