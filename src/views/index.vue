<template>
  <el-container class="app-container home">
    <el-header class="header">
      <h1 class="header-title">简码易框架介绍</h1>
    </el-header>

    <el-main class="main-content">
      <el-card class="intro-card" shadow="hover">
        <h2>什么是简码易框架？</h2>
        <p>
          简码易（easyCode）框架是一套基于<a>RuoYi</a>、全部开源的快速开发平台，旨在帮助个人及企业快速构建现代化企业应用系统。框架对外完全免费，涵盖前后端的开发需求。
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
          高效开发，使用代码生成器可以一键生成前后端代码，提供技术栈（Vue3
          Element Plus Vite）版本 RuoYi-Vue3，保持同步更新。
        </p>
      </el-card>

      <el-card class="data-card" shadow="hover">
        <h2>效益数据展示</h2>
        <el-row gutter="{20}">
          <el-col :span="12">
            <el-card class="chart-card">
              <h3>工作效率提升</h3>
              <canvas id="efficiencyChart"></canvas>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="chart-card">
              <h3>人力成本节省</h3>
              <canvas id="costChart"></canvas>
            </el-card>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="features-card" shadow="hover">
        <h2>内置功能</h2>
        <el-collapse>
          <el-collapse-item title="用户管理" name="1">
            <p>用户管理：系统用户配置，操作人员管理。</p>
          </el-collapse-item>
          <el-collapse-item title="部门管理" name="2">
            <p>
              部门管理：配置系统组织机构（公司、部门、小组），支持数据权限。
            </p>
          </el-collapse-item>
          <el-collapse-item title="岗位管理" name="3">
            <p>岗位管理：配置系统用户所属职务。</p>
          </el-collapse-item>
          <el-collapse-item title="菜单管理" name="4">
            <p>菜单管理：配置系统菜单、操作权限、按钮权限标识等。</p>
          </el-collapse-item>
          <el-collapse-item title="角色管理" name="5">
            <p>角色管理：角色菜单权限分配、按机构划分数据范围权限。</p>
          </el-collapse-item>
          <el-collapse-item title="字典管理" name="6">
            <p>字典管理：维护系统中经常使用的固定数据。</p>
          </el-collapse-item>
          <el-collapse-item title="参数管理" name="7">
            <p>参数管理：动态配置常用参数。</p>
          </el-collapse-item>
          <el-collapse-item title="通知公告" name="8">
            <p>通知公告：发布和维护系统通知公告信息。</p>
          </el-collapse-item>
          <el-collapse-item title="操作日志" name="9">
            <p>操作日志：记录和查询系统操作日志，包含异常信息。</p>
          </el-collapse-item>
          <el-collapse-item title="登录日志" name="10">
            <p>登录日志：记录和查询登录日志，包含登录异常。</p>
          </el-collapse-item>
          <el-collapse-item title="在线用户" name="11">
            <p>在线用户：监控当前系统中活跃用户状态。</p>
          </el-collapse-item>
          <el-collapse-item title="定时任务" name="12">
            <p>定时任务：任务调度（添加、修改、删除），包含执行结果日志。</p>
          </el-collapse-item>
          <el-collapse-item title="代码生成" name="13">
            <p>代码生成：自动生成前后端代码，支持 CRUD 下载。</p>
          </el-collapse-item>
          <el-collapse-item title="系统接口" name="14">
            <p>系统接口：自动生成 API 接口文档。</p>
          </el-collapse-item>
          <el-collapse-item title="服务监控" name="15">
            <p>服务监控：监视系统 CPU、内存、磁盘等信息。</p>
          </el-collapse-item>
          <el-collapse-item title="缓存监控" name="16">
            <p>缓存监控：查询系统缓存信息，统计命令等。</p>
          </el-collapse-item>
          <el-collapse-item title="在线构建器" name="17">
            <p>在线构建器：拖动表单元素生成 HTML 代码。</p>
          </el-collapse-item>
          <el-collapse-item title="连接池监视" name="18">
            <p>连接池监视：监视数据库连接池状态，分析 SQL，找出性能瓶颈。</p>
          </el-collapse-item>
        </el-collapse>
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

const efficiencyData = {
  labels: ["GitHub Copilot", "若依框架", "综合效益"],
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

const costData = {
  labels: ["原始情况", "使用 Copilot", "使用 若依框架", "综合效益"],
  datasets: [
    {
      label: "人力成本节省",
      data: [100, 80, 60, 70],
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

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

  const costCtx = document.getElementById("costChart").getContext("2d");
  new Chart(costCtx, {
    type: "bar",
    data: costData,
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
            text: "情况",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "人力成本节省 (%)",
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
.data-card,
.features-card {
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.intro-card h2,
.features-card h2 {
  color: #409eff;
  margin-bottom: 10px;
}

.intro-card p,
.features-card p {
  color: #606266;
  line-height: 1.6;
}

.features-card {
  padding: 20px;
}

.chart-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
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
