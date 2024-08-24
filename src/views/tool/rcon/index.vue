<template>
  <div class="app-container centered-90">
    <el-text class="mx-1" style="font-size: 32px">Cron表达式解析工具</el-text>
    <div style="margin: 20px 0" />
    <el-row :gutter="10">
      <el-col :span="10">
        <el-input
          v-model="cronDto.cronExpression"
          style="width: 100%"
          :rows="3"
          type="textarea"
          placeholder="请输入Cron表达式"
        />
      </el-col>
      <el-col :span="4">
        <el-row>
          <el-button
            type="primary"
            text
            style="width: 100%"
            @click="handleParseCron"
          >
            <el-icon>
              <DArrowRight />
            </el-icon>
            <el-icon>
              <DArrowRight />
            </el-icon>
            <el-icon>
              <DArrowRight />
            </el-icon>
            <el-icon>
              <Search />
            </el-icon>
          </el-button>
        </el-row>
        <div style="margin: 20px 0" />
        <el-row>
          <el-button
            type="primary"
            text
            style="width: 100%"
            @click="handleClear"
          >
            <el-icon>
              <Close />
            </el-icon>
          </el-button>
        </el-row>
      </el-col>
      <el-col :span="10">
        <el-input
          v-model="cronDto.parsedResult"
          style="width: 100%"
          :rows="8"
          type="textarea"
          placeholder="解析结果"
          readonly
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, toRefs } from "vue";
import parser from "cron-parser";

const data = reactive({
  cronDto: {
    cronExpression: "",
    parsedResult: "",
  },
});

const { cronDto } = toRefs(data);

// 解析Cron表达式
function handleParseCron() {
  try {
    // 使用 cron-parser 解析Cron表达式
    const interval = parser.parseExpression(data.cronDto.cronExpression);
    const nextDates = [];

    // 获取前5次执行时间
    for (let i = 0; i < 5; i++) {
      nextDates.push(interval.next().toString());
    }

    data.cronDto.parsedResult = `接下来的执行时间:\n${nextDates.join("\n")}`;
  } catch (err) {
    data.cronDto.parsedResult = `解析失败: ${err.message}`;
  }
}

// 清空输入和结果
function handleClear() {
  data.cronDto.cronExpression = "";
  data.cronDto.parsedResult = "";
}
</script>

<style>
.centered-90 {
  width: 90%;
  margin: 0 auto;
}
</style>
