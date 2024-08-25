<template>
  <div class="app-container centered-90">
    <!-- Jasypt 在线加解密工具 -->
    <el-text class="mx-1" style="font-size: 32px">
      Jasypt 在线加解密工具
    </el-text>
    <div style="margin: 20px 0" />
    <el-row :gutter="10">
      <el-col :span="10">
        <el-input
          v-model="encDto.encryptMessage"
          style="width: 100%"
          :rows="8"
          type="textarea"
          placeholder="原文"
        />
      </el-col>
      <el-col :span="4">
        <el-row>
          <el-input
            v-model="encDto.password"
            style="width: 100%"
            :rows="2"
            type="textarea"
            placeholder="加密密码"
          />
        </el-row>
        <div style="margin: 20px 0" />
        <el-row>
          <el-button
            type="primary"
            text
            style="width: 100%"
            @click="handleJasyptEncrypt"
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
              <Lock />
            </el-icon>
          </el-button>
        </el-row>
        <div style="margin: 20px 0" />
        <el-row>
          <el-button
            type="primary"
            text
            style="width: 100%"
            @click="handleJasyptDecrypt"
          >
            <el-icon>
              <Unlock />
            </el-icon>
            <el-icon>
              <DArrowLeft />
            </el-icon>
            <el-icon>
              <DArrowLeft />
            </el-icon>
            <el-icon>
              <DArrowLeft />
            </el-icon>
          </el-button>
        </el-row>
      </el-col>
      <el-col :span="10">
        <el-input
          v-model="encDto.decryptMessage"
          style="width: 100%"
          :rows="8"
          type="textarea"
          placeholder="密文"
        />
      </el-col>
    </el-row>

    <!-- Cron表达式解析工具 -->
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
import { jasyptDecrypt, jasyptEncrypt } from "@/api/tool/encryption.js";
import parser from "cron-parser";
import {
  DArrowRight,
  Search,
  Close,
  Lock,
  Unlock,
} from "@element-plus/icons-vue";

const data = reactive({
  encDto: {
    encryptMessage: "",
    password: "",
    decryptMessage: "",
  },
  cronDto: {
    cronExpression: "",
    parsedResult: "",
  },
});

const { encDto, cronDto } = toRefs(data);

// Jasypt 加解密函数
function handleJasyptEncrypt() {
  let queryData = {
    password: data.encDto.password,
    message: data.encDto.encryptMessage,
  };
  jasyptEncrypt(queryData).then((res) => {
    if (res.code === 200) {
      data.encDto.decryptMessage = res.data;
    }
  });
}

function handleJasyptDecrypt() {
  let queryData = {
    password: data.encDto.password,
    message: data.encDto.decryptMessage,
  };
  jasyptDecrypt(queryData).then((res) => {
    if (res.code === 200) {
      data.encDto.encryptMessage = res.data;
    }
  });
}

// Cron解析函数
function handleParseCron() {
  try {
    const interval = parser.parseExpression(data.cronDto.cronExpression);
    const nextDates = [];
    for (let i = 0; i < 5; i++) {
      nextDates.push(interval.next().toString());
    }
    data.cronDto.parsedResult = `接下来的执行时间:\n${nextDates.join("\n")}`;
  } catch (err) {
    data.cronDto.parsedResult = `解析失败: ${err.message}`;
  }
}

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
