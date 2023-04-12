<script setup>
import { computed } from "@vue/reactivity";
import { useWorldDataStore } from "../stores/worldData";
import WorldData from "../components/WorldData.vue";

const dataStore = useWorldDataStore();

const worldData = dataStore.worldStatistics;
</script>

<template>
  <WorldData> </WorldData>
</template>
