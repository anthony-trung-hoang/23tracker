import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import { createI18n } from "vue-i18n";
import en from "./lang/en.json";
import vi from "./lang/vi.json";

import "ant-design-vue/dist/antd.css";
import "./assets/main.css";

const messages = {
  en,
  vi,
};

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "vi",
  messages,
});

const app = createApp(App);

app.use(Antd);
app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
