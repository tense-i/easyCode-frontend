<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground,
    }"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :unique-opened="false"
        :active-text-color="theme"
        :collapse-transition="false"
        mode="vertical"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :default-openeds="['/tool', '/dbdog']"
        :background-color="
          sideTheme === 'theme-dark'
            ? variables.menuBackground
            : variables.menuLightBackground
        "
        :text-color="
          sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
      >
        <sidebar-item
          v-for="(route, idx) in sidebarRouters"
          :key="route.path + idx"
          :item="route"
          :base-path="route.path"
          :index="route.path"
        />

        <el-sub-menu
          ref="aiSubMenu"
          index="/ai"
          teleported
          idx="/ai"
          @click="toAIPage"
        >
          <!-- AI Page Title -->
          <template #title>
            <svg-icon :icon-class="f" />
            <span class="menu-title" :title="EasyCode"> EasyCode </span>
          </template>

          <el-menu-item index="/ai/EasyCodeAI">
            <svg-icon icon-class="ocr" />
            <span class="menu-title"> EasyCodeAI </span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.module.scss";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";

const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
const isCollapse = computed(() => !appStore.sidebar.opened);

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});

function toAIPage() {}
</script>
