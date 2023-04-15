<template>
  <Bar
    style="background-color: white"
    :id="chartId"
    :options="chartOptions"
    :data="chartData"
  />
  <button @click="downloadChartImage">Tải xuống</button>
</template>

<script setup>
import { Bar } from "vue-chartjs";
import html2canvas from "html2canvas";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { ref } from "vue";
import { useImageStore } from "../../stores/image";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  chartData: Object,
  chartId: String,
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  layout: {
    padding: 20,
  },
});

const downloadChartImage = () => {
  const chartElement = document.getElementById(props.chartId);
  html2canvas(chartElement).then(function (canvas) {
    const imageDataURL = canvas.toDataURL();
    const imageStore = useImageStore();
    imageStore.saveImage(imageDataURL);
  });
};
</script>
