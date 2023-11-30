import { createApp } from "vue";
import App from "./App.vue";
import { createMetaManager } from "vue-meta";
import router from "./router";

import { LoadingPlugin } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

import "./assets/css/reset.css";
// import "./assets/fonts/font.css";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);

app.use(createMetaManager()).use(router).use(pinia).use(LoadingPlugin).mount("#app");
