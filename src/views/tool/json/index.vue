<template>
  <div class="app-container centered-90">
    <el-text class="mx-1" style="font-size: 32px">JSON 在线解析工具</el-text>
    <div style="margin: 20px 0" />
    <el-row :gutter="10">
      <el-col :span="10">
        <el-input
          v-model="jsonDto.rawJson"
          style="width: 100%"
          :rows="8"
          type="textarea"
          placeholder="请输入原始JSON字符串"
        />
      </el-col>
      <el-col :span="4">
        <el-row>
          <el-button
            type="primary"
            text
            style="width: 100%"
            @click="handleJsonParse"
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
          v-model="jsonDto.parsedJson"
          style="width: 100%"
          :rows="8"
          type="textarea"
          placeholder="解析后的JSON对象"
          readonly
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, toRefs } from "vue";

const data = reactive({
  jsonDto: {
    rawJson: "",
    parsedJson: "",
  },
});

const { jsonDto } = toRefs(data);

// 解析JSON字符串
function handleJsonParse() {
  try {
    const parsed = JSON.parse(data.jsonDto.rawJson);
    data.jsonDto.parsedJson = JSON.stringify(parsed, null, 4); // 格式化输出JSON
  } catch (err) {
    data.jsonDto.parsedJson = `解析失败: ${err.message}`;
  }
}

// 清空输入和结果
function handleClear() {
  data.jsonDto.rawJson = "";
  data.jsonDto.parsedJson = "";
}
</script>

<style>
.centered-90 {
  width: 90%;
  margin: 0 auto;
}
</style>
