<template>
  <el-container class="app-container home">
    <el-header class="header">
      <h1 class="header-title">简码易框架介绍</h1>
    </el-header>

    <el-main class="main-content">
      <!-- 简码易框架介绍部分 -->
      <el-card class="intro-card" shadow="hover">
        <h2>什么是简码易框架？</h2>
        <p>
          简码易（easyCode）框架是一套基于
          RuoYi，全部开源的快速开发平台，旨在帮助个人及企业快速构建现代化企业应用系统。
          简码易框架通过高度集成前后端技术栈，减少了开发中的繁琐配置与重复性代码编写，为开发者节省了大量时间。
        </p>
        <p>
          <strong>核心价值：</strong>
          简化开发过程，降低项目交付成本，并提供可扩展的企业级解决方案。
        </p>
        <p><strong>前端技术栈：</strong> Vue.js、Element Plus</p>
        <p>
          <strong>后端技术栈：</strong> Spring Boot、Spring Security、Redis &
          Jwt
        </p>
        <p>
          <strong>权限认证：</strong> 使用
          Jwt，支持多终端认证系统，支持动态权限菜单加载，灵活的权限控制方式。
        </p>
        <p>
          <strong>开发效率：</strong>
          使用代码生成器可以一键生成前后端代码，极大提高开发效率。
        </p>
        <p>
          <strong>应用场景：</strong>
          适用于各类企业级应用开发，如管理系统、数据报表系统、ERP、CRM等。
        </p>
      </el-card>

      <!-- 效益数据展示部分 -->
      <el-card class="data-card" shadow="hover">
        <h2>效益数据展示</h2>
        <p>通过实际项目使用数据展示简码易框架带来的效益。</p>

        <!-- 开发效率提升图表 -->
        <el-row>
          <el-col :span="24">
            <el-card class="chart-card">
              <h3>开发效率提升</h3>
              <canvas id="efficiencyChart"></canvas>
              <p class="chart-description">
                通过对比传统开发模式与使用简码易框架后的开发效率，可以发现使用该框架能够显著减少开发时间，平均提升效率约
                50%。
              </p>
            </el-card>
          </el-col>
        </el-row>

        <!-- 项目交付时间缩短图表 -->
        <el-row style="margin-top: 20px">
          <el-col :span="24">
            <el-card class="chart-card">
              <h3>项目交付时间缩短</h3>
              <canvas id="deliveryChart"></canvas>
              <p class="chart-description">
                简码易框架帮助团队更快地完成项目交付，尤其是在多人协作开发中，代码生成和规范化的架构设计起到了关键作用。
              </p>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </el-main>

    <el-footer class="footer">
      <p class="footer-text">Copyright © 2024. All Rights Reserved.</p>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

// 开发效率提升数据
const efficiencyData = {
  labels: ["EasyCodeAI", "简码易", "综合效益"],
  datasets: [
    {
      label: "工作效率提升",
      data: [30, 50, 70],
      backgroundColor: [
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
      ],
      borderColor: [
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// 项目交付时间缩短数据
const deliveryData = {
  labels: ["原始时间", "使用 EasyCodeAI", "使用 简码易框架"],
  datasets: [
    {
      label: "项目交付时间缩短",
      data: [100, 80, 60, 50],
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(75, 192, 192, 0.6)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// 挂载图表
onMounted(() => {
  const efficiencyCtx = document
    .getElementById("efficiencyChart")
    .getContext("2d");
  new Chart(efficiencyCtx, {
    type: "bar",
    data: efficiencyData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.raw + "%";
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "工具/框架",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "效率提升 (%)",
          },
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
    },
  });

  const deliveryCtx = document.getElementById("deliveryChart").getContext("2d");
  new Chart(deliveryCtx, {
    type: "bar",
    data: deliveryData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.raw + "%";
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "项目交付情况",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "交付时间缩短 (%)",
          },
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
    },
  });
});
</script>

<style scoped>
.app-container {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  background-color: #409eff;
  padding: 20px;
  border-bottom: 1px solid #dcdfe6;
}

.header-title {
  color: #fff;
  margin: 0;
  font-size: 28px;
  text-align: center;
  font-weight: 700;
}

.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.intro-card,
.data-card {
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.intro-card h2 {
  color: #409eff;
  margin-bottom: 10px;
}

.intro-card p {
  color: #606266;
  line-height: 1.6;
}

.chart-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
}

.chart-description {
  color: #606266;
  margin-top: 10px;
}

.footer {
  background-color: #f5f7fa;
  padding: 10px;
  border-top: 1px solid #dcdfe6;
}

.footer-text {
  text-align: center;
  color: #aaa;
  margin: 0;
}
</style>
