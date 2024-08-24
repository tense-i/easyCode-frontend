<template>
  <el-form
    :model="column"
    ref="queryRef"
    :inline="inline"
    label-position="left"
    label-width="auto"
  >
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="字段名" prop="columnName">
          <el-input
            style="width: 100%"
            v-model="column.columnName"
            placeholder="请输入字段名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="字段类型" prop="columnType">
          <el-input
            v-model="column.columnType"
            placeholder="请输入字段名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="默认值" prop="defaultValue">
          <el-input
            v-model="column.defaultValue"
            placeholder="要与字段类型匹配"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="字段备注" prop="comment">
          <el-input
            v-model="column.comment"
            placeholder="字段备注"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="" prop="isIncrement">
          <el-space :size="10" spacer="|">
            <el-switch
              v-model="column.isPk"
              active-value="1"
              inactive-value="0"
              class="ml-2"
              size="medium"
              inline-prompt
              active-text="主键"
              inactive-text="非主键"
            />
            <el-switch
              v-model="column.isIncrement"
              active-value="1"
              inactive-value="0"
              class="ml-2"
              size="medium"
              inline-prompt
              active-text="自增"
              inactive-text="非自增"
            />
            <el-switch
              v-model="column.isRequired"
              active-value="1"
              inactive-value="0"
              class="ml-2"
              inline-prompt
              size="medium"
              active-text="必填"
              inactive-text="非必填r"
            />
          </el-space>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="模拟类型" prop="mockType">
          <el-select
            v-model="column.mockType"
            filterable
            placeholder="模拟类型"
          >
            <el-option
              v-for="item in mockTypeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="column.mockType !== '关联'">
        <el-form-item
          v-if="column.mockType === '递增'"
          :label="mockParams[column.mockType].label"
        >
          <el-input-number
            v-model="mockParams[column.mockType].mockParams"
            :placeholder="mockParams[column.mockType].placeholder"
            clearable
          />
        </el-form-item>

        <el-form-item
          v-if="column.mockType === '固定'"
          :label="mockParams[column.mockType].label"
        >
          <el-input
            v-model="mockParams[column.mockType].mockParams"
            :placeholder="mockParams[column.mockType].placeholder"
            clearable
          />
        </el-form-item>

        <el-form-item
          v-if="column.mockType === '随机'"
          :label="mockParams[column.mockType].label"
        >
          <el-select
            v-model="mockParams[column.mockType].mockParams"
            filterable
            :placeholder="mockParams[column.mockType].placeholder"
          >
            <el-option
              v-for="item in MockParamsRandomTypeEnum"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="column.mockType === '规则'"
          :label="mockParams[column.mockType].label"
        >
          <el-input
            v-model="mockParams[column.mockType].mockParams"
            :placeholder="mockParams[column.mockType].placeholder"
            clearable
          />
        </el-form-item>

        <el-form-item
          v-if="column.mockType === '词库'"
          :label="mockParams[column.mockType].label"
        >
          <el-select
            v-model="mockParams[column.mockType].mockParams"
            filterable
            :placeholder="mockParams[column.mockType].placeholder"
          >
            <el-option
              v-for="item in dictList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
            <template #footer>
              <el-pagination
                small
                background
                layout="prev, pager, next"
                :total="50"
                class="mt-4"
              />
            </template>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12" v-if="column.mockType === '关联'">
        <el-form-item
          v-if="column.mockType === '关联'"
          :label="mockParams[column.mockType].label[0]"
        >
          <el-select
            v-model="mockParams[column.mockType].mockParams[0]"
            filterable
            @change="changeGenTableList"
            :placeholder="mockParams[column.mockType].placeholder[0]"
          >
            <el-option
              v-for="item in excludeSelfGenTable()"
              :key="item.tableName"
              :label="item.tableName"
              :value="item.tableName"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="column.mockType === '关联'">
        <el-form-item
          v-if="column.mockType === '关联'"
          :label="mockParams[column.mockType].label[1]"
        >
          <el-select
            v-model="mockParams[column.mockType].mockParams[1]"
            filterable
            :label="mockParams[column.mockType].label[1]"
          >
            <el-option
              v-for="item in selectColumns"
              :key="item.columnName"
              :label="item.columnName"
              :value="item.columnName"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="column.mockType === '关联'">
        <el-form-item
          v-if="column.mockType === '关联'"
          :label="mockParams[column.mockType].label[2]"
        >
          <el-input
            v-model="mockParams[column.mockType].mockParams[2]"
            :placeholder="mockParams[column.mockType].placeholder[2]"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!--        确认-->
    <el-form-item v-if="submit">
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>

  {{ mockParams }}
</template>

<script setup>
import { defineProps, watch, ref } from "vue";

const {
  column,
  submit,
  inline,
  genTableList,
  selfGenTable,
  historyMockParams,
} = defineProps({
  column: Array,
  genTableList: Array,
  selfGenTable: Object,
  submit: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
  historyMockParams: {
    type: String,
    default: null,
  },
});

watch(
  () => column,
  (newValue) => {
    emit("update:column", newValue);
  }
);

watch(
  () => submit,
  (newValue) => {
    if (submit()) {
      emit("update:submit", newValue);
    }
  }
);

const mockTypeOptions = [
  "不模拟",
  "递增",
  "固定",
  "随机",
  "规则",
  "词库",
  "关联",
];

const mockParams = ref({
  不模拟: { mockParams: "", placeholder: "不模拟", label: "不模拟" },
  递增: { mockParams: "", placeholder: "请输入起始值", label: "起始值" },
  固定: { mockParams: "", placeholder: "请输入固定值", label: "固定值" },
  随机: { mockParams: "", placeholder: "请选择随机规则", label: "随机" },
  规则: { mockParams: "", placeholder: "请输入正则表达式", label: "规则" },
  词库: { mockParams: "", placeholder: "请选择词库", label: "词库" },
  关联: {
    mockParams: ["", "", ""],
    placeholder: ["请选择关联表", "请选择关联字段", "数量关系"],
    label: ["关联表", "关联字段", "关联数量"],
  },
});

const MockParamsRandomTypeEnum = [
  "字符串",
  "人名",
  "城市",
  "网址",
  "邮箱",
  "IP",
  "整数",
  "小数",
  "大学",
  "日期",
  "时间戳",
  "手机号",
];

const selectColumns = ref([]);

const dictList = ref([]);

// 排除字段本身所在表
function excludeSelfGenTable() {
  return genTableList.filter((item) => item.tableId !== selfGenTable.tableId);
}

// 选择表改变
function changeGenTableList() {
  // debgger
  let genTableName = mockParams.value[column.mockType].mockParams[0];
  // 使用 find 方法找到元素
  const genTable = genTableList.find(
    (element) => element.tableName === genTableName
  );

  selectColumns.value = genTable.columns;
  mockParams.value[column.mockType].mockParams[1] = "";
}

column.mockParams = computed(() => {
  let res;
  if (column.mockType === "关联") {
    let tableName = mockParams.value[column.mockType].mockParams[0];
    let columnName = mockParams.value[column.mockType].mockParams[1];
    let n = mockParams.value[column.mockType].mockParams[2];
    res = tableName + "." + columnName + "(" + n + ")";
  } else {
    res = mockParams.value[column.mockType].mockParams;
  }
  return res;
});

(() => {
  if (historyMockParams !== null) {
    if (column.mockType === "关联") {
      let str = historyMockParams;
      const regex = /(\w+)\.(\w+)\((\w+)\)/;
      const matches = str.match(regex);
      for (let i = 0; i < matches.length; i++) {
        mockParams.value[column.mockType].mockParams[i] = matches[i];
      }
    } else {
      mockParams.value[column.mockType].mockParams = historyMockParams;
    }
  }
})();

// ---------------------------function------------------------------
function onSubmit() {
  emit("update:submit", newValue);
}
</script>

<style>
</style>
