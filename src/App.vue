<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from "@/store/modules/settings";
import { handleThemeStyle } from "@/utils/theme";

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme);
  });
});

// 悬浮AI客服
window.ChatoBotConfig = {
  baseURL: "https://api.chato.cn",
  wwwBaseURL: "https://chato.cn",
  token: "10d8n7j9d365oyj6",
  id: 23869,
};
var st = document.createElement("script");
st.type = "module";
st.async = true;
st.src = "https://chato.cn/assets/iframe.min.js";
var header = document.getElementsByTagName("head")[0];
header.appendChild(st);
</script>
