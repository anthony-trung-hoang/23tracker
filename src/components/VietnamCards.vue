<script setup>
import CardItem from "./items/CardItem.vue";
import { useWorldDataStore } from "../stores/worldData";
import { useI18n } from "vue-i18n";
import { ref, watchEffect } from "vue";
import { computed } from "@vue/reactivity";

const { t } = useI18n();
const store = useWorldDataStore();
const cardTitles = ref("");
const timeStamp = ref("");

const cardContent = computed(() => store.vietNamStatistics);
const worldStats = computed(() => store.worldStatistics);

watchEffect(() => {
  cardTitles.value = [
    { [t("vietnamData.totalCases")]: cardContent.value.cases },
    { [t("vietnamData.newCases")]: cardContent.value.new_cases },
    { [t("vietnamData.totalDeaths")]: cardContent.value.deaths },
    { [t("vietnamData.newDeaths")]: cardContent.value.new_deaths },
    { [t("vietnamData.totalRecovered")]: cardContent.value.total_recovered },
    { [t("vietnamData.activeCases")]: cardContent.value.active_cases },
    { [t("vietnamData.seriousCritical")]: cardContent.value.serious_critical },
    {
      [t("vietnamData.totalCasesPerMillion")]:
        cardContent.value.total_cases_per_1m_population,
    },
    {
      [t("vietnamData.deathsPerMillion")]:
        cardContent.value.deaths_per_1m_population,
    },
  ];
});

watchEffect(() => {
  timeStamp.value = worldStats.value.statistic_taken_at;
});
</script>

<template>
  <div style="padding-top: 20px; padding-bottom: 20px">
    <!-- TITLE OF THE COMPONENT HERE -->
    <h1>{{ t("vietnamData.vietnamData") }}</h1>
    <h3>
      {{ t("vietnamData.lastUpdatedAt") }} <br />
      {{ timeStamp }}
    </h3>

    <!-- DOWNLOAD BUTTON HERE -->
    <a-button type="primary" style="margin-bottom: 15px">
      {{ t("vietnamData.exportReport") }}
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
  color: black;
  font-family: "Roboto", sans-serif;
}
</style>
