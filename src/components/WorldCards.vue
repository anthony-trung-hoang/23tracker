<script setup>
import CardItem from "./items/CardItem.vue";
import { useWorldDataStore } from "../stores/worldData";
import { useI18n } from "vue-i18n";
import { ref, watchEffect } from "vue";
import { computed } from "@vue/reactivity";
import { exportExcel } from "../services/exportExcelService";

const { t } = useI18n();
const store = useWorldDataStore();
const cardTitles = ref("");
const timeStamp = ref("");

const cardContent = computed(() => store.worldStatistics);

watchEffect(() => {
  cardTitles.value = [
    { [t("worldData.totalCases")]: cardContent.value.total_cases },
    { [t("worldData.newCases")]: cardContent.value.new_cases },
    { [t("worldData.totalDeaths")]: cardContent.value.total_deaths },
    { [t("worldData.newDeaths")]: cardContent.value.new_deaths },
    { [t("worldData.totalRecovered")]: cardContent.value.total_recovered },
    { [t("worldData.activeCases")]: cardContent.value.active_cases },
    { [t("worldData.seriousCritical")]: cardContent.value.serious_critical },
    {
      [t("worldData.totalCasesPerMillion")]:
        cardContent.value.total_cases_per_1m_population,
    },
    {
      [t("worldData.deathsPerMillion")]:
        cardContent.value.deaths_per_1m_population,
    },
  ];
});

watchEffect(() => {
  timeStamp.value = cardContent.value.statistic_taken_at;
});

function exportFile() {
  exportExcel();
}
</script>

<template>
  <div style="padding-top: 20px; padding-bottom: 20px">
    <!-- TITLE OF THE COMPONENT HERE -->
    <h1>{{ t("worldData.worldData") }}</h1>
    <h3>
      {{ t("worldData.lastUpdatedAt") }} <br />
      {{ timeStamp }}
    </h3>

    <!-- DOWNLOAD BUTTON HERE -->
    <a-button @click="exportFile" type="primary" style="margin-bottom: 15px">
      {{ t("worldData.exportReport") }}
    </a-button>

    <!-- CARD DISPLAY HERE -->
    <a-row :gutter="10">
      <CardItem
        v-for="(title, index) in cardTitles"
        :key="index"
        :title="Object.keys(title)[0]"
        :content="Object.values(title)[0]"
      />
    </a-row>
  </div>
</template>

<style scoped>
h1,
h3 {
  color: rgb(255, 255, 255);
  font-family: "Roboto";
}
</style>
