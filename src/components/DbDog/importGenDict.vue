<template>
  <!-- 导入词库 -->

  <el-drawer
    v-if="witch === 'drawer'"
    :size="'45%'"
    title="导入词库"
    v-model="visible"
  >
    <el-form
      :model="queryParams"
      ref="queryRef1"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="配置名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入配置名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="notes">
        <el-input
          v-model="queryParams.notes"
          placeholder="请输入备注"
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
      <el-form-item v-if="localShared.show" style="width: 150px">
        <el-select
          v-model="localShared.value"
          @change="handleQuery"
          clearable
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in [
              { label: '我的创建', value: false },
              { label: '在线共享', value: true },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery(1)">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="importEmits">导入</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="queryPageData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template #default="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="配置名"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="备注"
        align="center"
        prop="notes"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="生成包路径"
        align="center"
        prop="packagePath"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="生成模块名"
        align="center"
        prop="moduleName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="160"
      />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        width="160"
      />
    </el-table>

    <pagination
      v-show="queryParams.total > 0"
      :total="queryParams.total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-drawer>

  <el-dialog
    v-if="witch === 'dialog'"
    title="导入词库"
    v-model="visible"
    width="800px"
    top="5vh"
    append-to-body
    draggable
  >
    <el-form
      :model="queryParams"
      ref="queryRef1"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="配置名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入配置名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="notes">
        <el-input
          v-model="queryParams.notes"
          placeholder="请输入备注"
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
      <el-form-item v-if="localShared.show" style="width: 150px">
        <el-select
          v-model="localShared.value"
          @change="handleQuery"
          clearable
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in [
              { label: '我的创建', value: false },
              { label: '在线共享', value: true },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery(1)">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="importEmits">导入</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="queryPageData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template #default="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="配置名"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="备注"
        align="center"
        prop="notes"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="生成包路径"
        align="center"
        prop="packagePath"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="生成模块名"
        align="center"
        prop="moduleName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="160"
      />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        width="160"
      />
    </el-table>

    <pagination
      v-show="queryParams.total > 0"
      :total="queryParams.total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-dialog>
</template>

<script setup>
import { pageGenConfig, pageSharedGenConfig } from "@/api/system/genConfig.js";
import { defineProps } from "vue";
import {
  listMyAddDictByPage,
  listSharedDictByPage,
} from "@/api/system/genDict.js";

const total = ref(0);
const visible = ref(false);
const tables = ref([]);

const { proxy } = getCurrentInstance();

const showSearch = ref(true);
const dateRange = ref([]);
const loading = ref(true);
const selectionValue = ref([]);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    notes: undefined,
  },
  queryPageData: [],
});

const { queryParams, queryPageData } = toRefs(data);

const { shared, witch } = defineProps({
  shared: {
    type: Object,
    default: {
      show: true,
      value: false,
    },
  },
  importBUtton: {
    type: Object,
    default: {
      name: "导入",
    },
  },
  witch: {
    type: String,
    default: "dialog",
  },
});

const localShared = ref(shared);

let $emit = defineEmits(["import"]);

// 对选择数据操作
const importEmits = () => {
  $emit("import", selectionValue.value);
};

/** 查询表集合 */
function getList() {
  // debgger
  loading.value = true;
  let shared = localShared.value.value;
  if (!shared) {
    listMyAddDictByPage(
      proxy.addDateRange(queryParams.value, dateRange.value)
    ).then((res) => {
      if (res.code === 200) {
        data.queryPageData = res.data.records;
        data.queryParams.total = Number(res.data.total);
        loading.value = false;
      }
    });
  } else {
    listSharedDictByPage(
      proxy.addDateRange(queryParams.value, dateRange.value)
    ).then((res) => {
      if (res.code === 200) {
        data.queryPageData = res.data.records;
        data.queryParams.total = Number(res.data.total);
        loading.value = false;
      }
    });
  }
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

// 重置按钮操作
function resetQuery(index) {
  proxy.resetForm("queryRef" + index);
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  selectionValue.value = selection;
}

// 展示
function show() {
  getList();
  visible.value = true;
}

defineExpose({
  show,
  selectionValue,
});
</script>
