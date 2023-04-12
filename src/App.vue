<template>
  <a-layout class="layout">
    <!-- HEADER -->
    <a-layout-header style="height: 48px" class="header-wrapper">
      <!-- NAVBAR MENU -->
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '48px', justifyContent: 'center' }"
        class="menu-bar"
      >
        <a-menu-item key="1">
          <RouterLink to="/">{{ $t("navTitle.home") }}</RouterLink>
        </a-menu-item>
        <a-menu-item key="2">
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
        class="dropdown-wrapper me-xs-1 me-sm-4 me-md-5 me-lg-5"
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
    <a-layout-content class="bg-wrapper px-0 px-sm-4 px-md-5 py-5">
      <div
        :style="{
          background: '#fff',
          padding: '12px 24px',
          minHeight: '300px',
        }"
      >
        <RouterView></RouterView>
      </div>
    </a-layout-content>

    <!-- FOOTER -->
    <a-layout-footer style="text-align: center" class="footer-wrapper">
      <span>Ant Design ©2018 Created by Ant UED</span>
    </a-layout-footer>
  </a-layout>
</template>
<script setup>
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const selectedKeys = ref(["1"]);

const currentLanguage = computed(() => {
  return locale.value;
});

function onClick({ key }) {
  console.log(`Click on item ${key}`);
  if (currentLanguage.value === "en" && key === "2") {
    changeLanguage();
  } else if (currentLanguage.value === "vi" && key === "1") {
    changeLanguage();
  }

  console.log("locale luc nay la", locale.value);
  console.log("current luc nay la", currentLanguage.value);
}
function changeLanguage() {
  if (locale.value === "en") {
    locale.value = "vi";
  } else {
    locale.value = "en";
  }
}
</script>
<style>
* {
  font-family: "Poppins", sans-serif;
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
  background: url("https://images.unsplash.com/photo-1531694402898-042bd3957f41?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80")
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
