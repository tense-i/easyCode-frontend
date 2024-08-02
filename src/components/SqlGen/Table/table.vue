<template>


    <el-form v-if="isNull()" :model="queryParams" ref="queryRef" :inline="true">
        <el-form-item label="字段称" prop="tableName">
            <el-input
                    v-model="queryParams.searchName"
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
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
    </el-form>

  <!--    stripe斑马纹-->
    <el-table :data="isNull() ? columnsData : columns"
              stripe
              max-height="371"
              :row-key="getRowKeys"
    >

        <!--展开列卡槽-->
        <slot name="expandColumn"></slot>

        <el-table-column prop="tableName" label="表名" width="150" align="center"/>



        <el-table-column prop="tableComment" label="表描述" width="120" align="center"/>

        <!--操作卡槽-->
        <slot name="operationsColumn"></slot>



    </el-table>

    <pagination
            v-if="isNull()"
            v-show="queryParams.total>0"
            :total="queryParams.total"
            v-model:page="queryParams.current"
            v-model:limit="queryParams.pageSize"
            @pagination="handleQuery"
    />

  <!--底部卡槽-->
    <slot name="footer"></slot>
</template>

<script setup>


import {defineProps, watch, ref} from 'vue';
import {pageGenTableColumn} from "@/api/system/genTableColumn.js";
import ColumnFrom from "@/components/SqlGen/columnFrom.vue";

const {proxy} = getCurrentInstance();
const {columns, submit, inline} = defineProps({

    columns: {
        type: Array,
        default: undefined
    },
    submit: {
        type: Boolean,
        default: false
    },
    inline: {
        type: Boolean,
        default: false
    },
    edit: {
        tye: Boolean,
        default: false
    }
});

function getRowKeys(row) {
    return row.columnName;
}

const filterPk = (value, row) => {
    return row.isPk === value
}
const filterIncrement = (value, row) => {
    return row.isIncrement === value
}
const filterRequired = (value, row) => {
    return row.isRequired === value
}


watch(() => columns, (newValue) => {
    emit('update:columns', newValue);
});

watch(() => submit, (newValue) => {
    if (submit()) {
        emit('update:submit', newValue);
    }

});

const dateRange = ref([]);


const data = reactive({
    queryParams: {
        current: 1,
        pageSize: 10,
        total: 0,
        columnName: undefined,
        columnComment: undefined,
    },
    columnsData: []

});

const {
    queryParams, columnsData
} = toRefs(data);

function isNull() {

    return columns == null;
}


function doPageGenTableColumn() {

    pageGenTableColumn(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
        data.columnsData = response.data.records;
        data.queryParams.total = response.data.total;
    });
}

/** 重置按钮操作 */
function resetQuery() {
    dateRange.value = [];
    proxy.resetForm("queryRef");
}

function handleQuery() {

    doPageGenTableColumn();
}

doPageGenTableColumn()

function updateData(row, field) {
    // 在这里更新数据
}
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
