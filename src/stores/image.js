import { ref } from "vue";
import { defineStore } from "pinia";

export const useImageStore = defineStore("image", () => {
  const chartImage = ref({});
  async function saveImage(base64Image) {
    try {
      chartImage.value = base64Image;
      console.log("Đã lưu");
    } catch (error) {
      console.log(error);
    }
  }

  return {
    chartImage,
    saveImage,
  };
});
