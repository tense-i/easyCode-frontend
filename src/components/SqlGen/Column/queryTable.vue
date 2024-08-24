<template>
  <!--头部卡槽-->
  <slot name="header"></slot>

  <column-table
    ref="columnTableRef"
    :columns="columnsData"
    :show-columns="showColumns"
    :selection="true"
  >
    <template v-slot:header>
      <el-form :model="queryParams" ref="queryRef" :inline="true">
        <el-select
          v-model="queryParams.tableIds"
          multiple
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in tablesInfo"
            :key="item.tableId"
            :label="item.tableName"
            :value="item.tableId"
          >
            <span style="float: left">{{ item.tableName }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
              >{{ item.tableComment }}</span
            >
          </el-option>
        </el-select>

        <el-form-item label="字段称" prop="columnName">
          <el-input
            v-model="queryParams.columnName"
            placeholder="请输入字段名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="创建时间" style="width: 308px">
          <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button
            v-if="selection && handleOfSelectionName != ''"
            @click="handleOfSelectionEmits"
          >
            {{ handleOfSelectionName }}
          </el-button>
        </el-form-item>
      </el-form>
    </template>

    <template v-slot:expandColumn>
      <slot name="expandColumn"></slot>
    </template>

    <template v-slot:operationsColumn>
      <slot name="operationsColumn"></slot>
    </template>

    <template v-slot:footer>
      <pagination
        v-show="queryParams.total > 0"
        :total="queryParams.total"
        v-model:page="queryParams.current"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </template>
  </column-table>

  <!--底部卡槽-->
  <slot name="footer"></slot>
</template>

<script setup>
import { defineProps, watch, ref } from "vue";
import {
  listTableInfo,
  pageGenTableColumn,
} from "@/api/system/genTableColumn.js";
import ColumnTable from "@/components/SqlGen/Column/table.vue";
// 组件实例
const columnTableRef = ref(null);

const { proxy } = getCurrentInstance();
const { columns, submit, inline, selection, handleOfSelection } = defineProps({
  showColumns: {
    type: Array,
    default: [],
  },
  selection: {
    type: Boolean,
    default: false,
  },
  handleOfSelectionName: {
    type: String,
    default: "",
  },
});

watch(
  () => columns,
  (newValue) => {
    emit("update:columns", newValue);
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

//利用defineEmits方法返回函数触发自定义事件
//defineEmits方法不需要引入直接使用
let $emit = defineEmits(["handleOfSelection"]);
const handleOfSelectionEmits = () => {
  // debgger
  let multipleSelection1 = proxy.$refs["columnTableRef"].multipleSelection;
  $emit("handleOfSelection", multipleSelection1);
};

const dateRange = ref([]);
const multipleSelection = ref([]);
const tablesInfo = ref([]);

const data = reactive({
  queryParams: {
    current: 1,
    pageSize: 10,
    total: 0,
    columnName: undefined,
    columnComment: undefined,
    tableIds: undefined,
  },
  columnsData: [],
});

const { queryParams, columnsData } = toRefs(data);

function getList() {
  pageGenTableColumn(
    proxy.addDateRange(queryParams.value, dateRange.value)
  ).then((response) => {
    data.columnsData = response.data.records;
    data.queryParams.total = response.data.total;
  });
}

function doListTableInfo() {
  listTableInfo().then((res) => {
    // debgger
    tablesInfo.value = res.data;
  });
}

doListTableInfo();

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
}

function handleQuery() {
  getList();
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

getList();
</script>

<style setup>
.centered-98 {
  width: 98%;
  margin: 0 auto;
}

.centered-90 {
  width: 90%;
  margin: 0 auto;
}
</style>
