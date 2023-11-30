<script setup>
import { ref, onMounted, defineEmits, watch, computed } from "vue";
import { useMainStore } from "../store/main";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import anchorImage from "../assets/images/anchor.png";

const mainStore = useMainStore();

let markets = computed(() => mainStore.marketsData);
const mapCanvas = ref(null);
const mapContext = ref(null);
const loaded = ref(false);
const markers = ref([]);
let prevPopup;

const emit = defineEmits(["mapHover", "mapLeave", "mapClick"]);
const showTitle = ref(true);
const showSearch = ref(true);
// 標題是否顯示
const handleMapHover = () => {
  showTitle.value = false;
  emit("mapHover", showTitle.value);
};
// const handleMapLeave = () => {
//   showTitle.value = true;
//   emit("mapLeave", showTitle.value);
// };

// 搜尋欄是否顯示
const handleMapClick = () => {
  emit("mapClick", showSearch.value);
};

// zooin指定位置
const zoomToCoordinates = () => {
  mapContext.value.flyTo({
    center: mainStore.flyto,
    zoom: 3,
  });
  const coordinates = mainStore.flyto;
  const description = mainStore.marketsData.find((item) => item.country === mainStore.flytocountry);
  // let content = generateDescription(description);
  createPopup(coordinates, description.content);
};

// 動態生成 marker
function generateMarkers() {
  markers.value = markets.value.map((item) => {
    let location = [item.lng, item.lat];
    // 使用 <img> 元素作為自訂標記圖示
    const markerIcon = document.createElement("div");
    const imgElement = document.createElement("img");
    imgElement.src = anchorImage;
    imgElement.alt = "Marker";
    imgElement.style.width = "25px";
    markerIcon.appendChild(imgElement);
    markerIcon.className = "custom-marker"; // 自定義 CSS 樣式
    const marker = new mapboxgl.Marker({ element: markerIcon })
      .setLngLat(location)
      .addTo(mapContext.value);
    return marker;
  });
}

// 動態生成 description
const createDescription = (e) => {
  mapContext.value.getCanvas().style.cursor = "pointer";
  const coordinates = e.features[0].geometry.coordinates.slice();
  const description = e.features[0].properties.description;

  createPopup(coordinates, description);
};

// 動態生成 popup
const createPopup = (coordinates, description) => {
  // 創建 Popup 並設定位置和內容
  const popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true,
    maxWidth: "auto",
  });
  // 太靠近邊界需修改座標
  if (coordinates[0] > 150) {
    if (mainStore.isMobile) {
      popup.setLngLat([coordinates[0] - 15, coordinates[1]]);
    } else {
      popup.setLngLat([coordinates[0] - 30, coordinates[1]]);
    }
  } else {
    popup.setLngLat(coordinates);
  }
  popup
    .setHTML(description) // 內容
    .addTo(mapContext.value); // 地圖

  // 移除之前的 Popup
  if (prevPopup) {
    prevPopup.remove();
  }
  // 更新 prevPopup 以便下次移除
  prevPopup = popup;

  // 重置 markerClicked 變數，表示標記已經被點擊過
  mainStore.markerClicked = true;

  // 監聽 Popup 的關閉按鈕點擊事件
  popup.on("close", () => {
    // 如果標記已被點擊過，則執行縮小操作
    if (mainStore.markerClicked) {
      mapContext.value.flyTo({
        center: [-97.817581, 39.450261],
        zoom: 1.3, // 恢復地圖縮放級別
      });
      // 重置 mainStore.markerClicked 變數
      mainStore.markerClicked = false;
    }
  });
};
// const generateDescription = (item) => {
//   let html = `<h1>${item.country}</h1>\n<ul>\n`;
//   item.marketdetails.forEach((i) => {
//     html += `\t<li>\n\t\t<div class="top">${i.name}</div>\n`;
//     if (i.link) {
//       if (i.image) {
//         html += `\t\t<div class="bottom"><a href="${i.link}" target="_blank">${i.link_name}&nbsp;<img alt="" src="${i.image}" /></a></div>\n`;
//       } else {
//         html += `\t\t<div class="bottom"><a href="${i.link}" target="_blank">${i.link_name}&nbsp;</a></div>\n`;
//       }
//     } else {
//       html += `\t\t<div class="bottom">${i.link_name}</div>\n`;
//     }
//     html += "\t</li>\n";
//   });

//   html += "</ul>";
//   return html;
// };

watch(
  () => mainStore.flyto,
  () => {
    zoomToCoordinates();
  },
);
onMounted(() => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic2hvcnRkaXYiLCJhIjoiY2l3OGc5YmE5MDJzZjJ5bWhkdDZieGdzcSJ9.1z-swTWtcCHYI_RawDJCEw";
  // 防止地圖重複顯示
  const bounds = [
    [-180, -85],
    [180, 85],
  ];
  var map = new mapboxgl.Map({
    container: mapCanvas.value, // container id
    style: "mapbox://styles/mapbox/light-v9",
    center: [-97.817581, 39.450261],
    zoom: 0,
    maxBounds: bounds,
  });
  mapContext.value = map;

  generateMarkers();

  map.on("load", () => {
    loaded.value = true;
    const convertedFeatures = markets.value.map((item) => {
      // let description = generateDescription(item);
      return {
        type: "Feature",
        properties: {
          title: item.country, // 标题
          description: item.content || "", // 描述
        },
        geometry: {
          type: "Point",
          coordinates: [parseFloat(item.lng), parseFloat(item.lat)], // 坐标
        },
      };
    });
    map.addSource("places", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: convertedFeatures,
      },
    });
    // Add a circle layer
    map.addLayer({
      id: "places",
      type: "circle",
      source: "places",
      paint: {
        "circle-color": "transparent",
        "circle-radius": 6,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    // Create a popup, but don't add it to the map yet.
    let popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: "auto",
    });

    map.on("click", "places", (e) => {
      map.flyTo({
        center: e.features[0].geometry.coordinates,
        zoom: 3,
      });
      createDescription(e);
      showSearch.value = false;
      handleMapClick();
    });
    // 偵聽座標方式
    // map.on("mousemove", (e) => {
    //   console.log("JSON.stringify(e.point)", JSON.stringify(e.point));
    //   console.log("JSON.stringify(e.lngLat.wrap())", JSON.stringify(e.lngLat.wrap()));
    // });
    map.on("move", () => {
      if (prevPopup) {
        const coordinates = prevPopup.getLngLat();
        prevPopup.setLngLat(coordinates);
      }
    });

    map.on("mouseenter", "places", (e) => {
      // createDescription(e);
    });

    map.on("mouseleave", "places", () => {
      map.getCanvas().style.cursor = "";
      showSearch.value = true;
      handleMapClick();
    });
  });
});
</script>

<template>
  <div id="map" ref="mapCanvas" @mouseover="handleMapHover()">
    <div class="mask"></div>
  </div>
</template>

<style lang="scss" scoped>
#map {
  .mask {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
  }
  :deep(.mapboxgl-popup) {
    min-width: 26%;
    left: 13%;
    top: -3%;
    .mapboxgl-popup-tip {
      display: none;
    }
    .mapboxgl-popup-content {
      padding: 10% 9% 10% 7%;
      border-radius: 10px;
      text-align: left;
      color: var(--text-color-2);
      background: #dec9a6;
      width: 100%;
      h1 {
        // font-family: "NotoSansCJKtc";
        font-family: "Noto Sans TC";
        font-weight: bold;
        font-size: 1.2vw;
        letter-spacing: 1.3px;
      }
      ul {
        margin-top: 2%;
        li {
          margin-top: 2%;
          margin-left: 7%;
          list-style: disc;
          // font-family: "NotoSansCJKtc";
          font-family: "Noto Sans TC";
          font-weight: 500;
          font-size: 0.8vw;
          letter-spacing: 1.3px;
          strong {
            font-weight: bold;
          }
          p {
            // font-family: "NotoSansCJKtc";
            font-family: "Noto Sans TC";
            font-weight: 500;
            font-size: 0.8vw;
            letter-spacing: 1.3px;
            strong {
              font-weight: bold;
            }
            a {
              display: flex;
              img {
                margin-top: 2%;
                width: 40%;
              }
            }
          }
        }
      }
      .mapboxgl-popup-close-button {
        // font-family: "NotoSansCJKtc-Thin";
        font-family: "Noto Sans TC";
        font-weight: 300;
        color: var(--text-color-2);
        font-size: 2vw;
        top: 3%;
      }
    }
  }
}
@media (max-width: 1600px) {
  #map {
    :deep(.mapboxgl-popup) {
      min-width: 30%;
    }
  }
}
@media (max-width: 1280px) {
  #map {
    :deep(.mapboxgl-popup) {
      min-width: 35%;
      width: 300px;
      left: 18%;
      .mapboxgl-popup-content {
        h1 {
          font-size: 20px;
        }
      }
    }
  }
}
@media (max-width: 1024px) {
  #map {
    :deep(.mapboxgl-popup) {
      left: 16%;
    }
  }
}
@media (max-width: 768px) {
  #map {
    :deep(.mapboxgl-popup) {
      min-width: 33%;
      width: 280px;
      left: -2%;
      top: -4%;
      .mapboxgl-popup-content {
        h1 {
          font-size: 3vw;
          letter-spacing: 1px;
          font-weight: bold;
        }

        ul {
          li {
            font-size: 2.4vw;
            letter-spacing: 1px;
            strong {
              font-weight: bold;
            }
            p {
              font-size: 2.4vw;
              letter-spacing: 1px;
              strong {
                font-weight: bold;
              }
              a {
              }
            }
          }
        }
        .mapboxgl-popup-close-button {
          font-size: 3.8vw;
          top: 0%;
        }
      }
    }
  }
}
@media (max-width: 600px) {
  #map {
    :deep(.mapboxgl-popup) {
      // min-width: 40%;
    }
  }
}
@media (max-width: 475px) {
  #map {
    :deep(.mapboxgl-popup) {
      // min-width: 50%;
      left: -3%;
      top: -4%;
      .mapboxgl-popup-content {
        .mapboxgl-popup-close-button {
          font-size: 4.5vw;
        }
      }
    }
  }
}
</style>
