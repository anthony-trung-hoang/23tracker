<template>
  <div id="app">
    <a-layout class="layout">
      <!-- HEADER -->
      <a-layout-header style="height: 48px">
        <!-- NAVBAR MENU -->
        <a-menu
          v-model:selectedKeys="currentSelectedKeys"
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '48px', justifyContent: 'center' }"
        >
          <a-menu-item key="1">
            <RouterLink to="/">{{ $t("navTitle.home") }}</RouterLink>
          </a-menu-item>
          <a-menu-item key="2">
            <RouterLink to="/vietnam">{{ $t("navTitle.vietnam") }}</RouterLink>
          </a-menu-item>
          <a-menu-item key="3">
            <RouterLink to="/about">{{ $t("navTitle.about") }}</RouterLink>
          </a-menu-item>
        </a-menu>

        <!-- NAVBAR LOGO -->
        <div
          class="logo px-xs-0 px-sm-3 px-md-5 px-lg-5 px-xl-6"
          style="position: absolute; top: -8px; left: 20px"
        >
          <img
            src="https://rastarecords.com/wp-content/uploads/2018/11/mainheadlogo.png"
            style="width: 30px"
            alt=""
          />
        </div>

        <div
          class="dropdown-wrapper me-2 me-sm-4 me-md-5 me-lg-5"
          style="position: absolute; top: -10px; right: 10px"
        >
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              <div>
                <img
                  style="width: 45px"
                  v-if="currentLanguage === 'en'"
                  src="./assets/usa-flag.png"
                />
                <img
                  style="width: 45px"
                  v-else="currentLanguage === 'vi'"
                  src="./assets/vietnam-flag.png"
                />
              </div>
            </a>
            <template #overlay>
              <a-menu @click="onClick">
                <a-menu-item key="1">
                  <img style="width: 45px" src="./assets/usa-flag.png" />
                </a-menu-item>
                <a-menu-item key="2">
                  <img style="width: 45px" src="./assets/vietnam-flag.png" />
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- CONTENT -->
      <a-layout-content class="bg-wrapper px-0 px-sm-4 px-md-5 py-0">
        <div
          :style="{
            padding: '12px 24px',
            minHeight: '300px',
          }"
        >
          <RouterView></RouterView>
        </div>
      </a-layout-content>

      <!-- FOOTER -->
      <a-layout-footer style="text-align: center" class="footer-wrapper">
        <span>Special thanks to myself</span>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script setup>
import { computed } from "@vue/reactivity";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useWorldDataStore } from "./stores/worldData";
import { useRoute } from "vue-router";

const { locale } = useI18n();
const route = useRoute();
const dataStore = useWorldDataStore();

const currentLanguage = computed(() => {
  return locale.value;
});

const currentRoute = computed(() => {
  return route.path;
});

const currentSelectedKeys = ref(["1"]);

watch(currentRoute, () => {
  if (currentRoute.value === "/") {
    currentSelectedKeys.value = ["1"];
  } else if (currentRoute.value === "/vietnam") {
    currentSelectedKeys.value = ["2"];
  } else if (currentRoute.value === "/about") {
    currentSelectedKeys.value = ["3"];
  }
});

function onClick({ key }) {
  if (currentLanguage.value === "en" && key === "2") {
    changeLanguage();
  } else if (currentLanguage.value === "vi" && key === "1") {
    changeLanguage();
  }
}
function changeLanguage() {
  if (locale.value === "en") {
    locale.value = "vi";
  } else {
    locale.value = "en";
  }
}

onMounted(async () => {
  await dataStore.fetchWorldStatistics();
});
</script>
<style>
#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}

[data-theme="dark"] .site-layout-content {
  background: #141414;
}

.bg-wrapper {
  background: url("https://images.unsplash.com/photo-1673024697368-947323b88951?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")
    no-repeat;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
}
.footer-wrapper {
  background: url("https://tuyensinh.ttu.edu.vn/wp-content/uploads/2022/03/Footer-Background-Image.png")
    no-repeat !important;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  color: white !important;
}
</style>
