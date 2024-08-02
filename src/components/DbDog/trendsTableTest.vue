<template>


    <div></div>
  <!--头部卡槽-->
    <slot name="header"></slot>


  <!--    stripe斑马纹-->
    <el-table :data="columns"

              :row-key="getRowKeys"
              @selection-change="handleSelectionChange"
              stripe
              :max-height="maxHeight">

        <el-table-column type="selection" v-if="selection"/>

        <!--展开列卡槽-->
        <slot name="expandColumn"></slot>


        <!--展示-->
        <template v-for="(item,index) in showColumns">

            <el-table-column
                    v-if="item.type === null || item.type === ''"
                    :prop="item.key"
                    :label="item.label"
                    align="center"/>
            <!--        输入-->
            <el-table-column :label="item.label"
                             v-if="item.type === 'input'">
                <template #default="scope">
                    <el-input v-model="scope.row[item.key]"></el-input>
                </template>
            </el-table-column>

            <!--        输入_数字-->
            <el-table-column :label="item.label"
                             v-if="item.type === 'input_number'">
                <template #default="scope">
                    <el-input-number
                            v-model="scope.row[item.key]"
                            :min="1">

                    </el-input-number>
                </template>
            </el-table-column>
            <!--check-->
            <el-table-column :label="item.label"
                             v-if="item.type === 'check'">
                <template #default="scope">
                    <el-checkbox
                            :true-label="item.check.true"
                            :false-label="item.check.false"
                            v-model="scope.row[item.key]">

                    </el-checkbox>
                </template>
            </el-table-column>
            <!--check-->
            <el-table-column :label="item.label"
                             v-if="item.type === 'select'">
                <template #default="scope">

                    <el-select v-model="scope.row[item.key]">
                        <template>

                        </template>
                        <el-option v-for="(p,index) in item.select" :key="item.value" :label="p.label"
                                   :value="p.value"/>
                    </el-select>

                </template>
            </el-table-column>
            <!--             yes Or no筛选-->
            <el-table-column
                    v-if="item.type != null && item.type === 'yes-no'"
                    :label="item.label"
                    align="center"
            >
                <template #default="scope">
                    <el-icon v-if="scope.row[item.key] === '1' || scope.row[item.key] === true"><Select/></el-icon>
                    <el-icon v-if="scope.row[item.key] === '0' || scope.row[item.key] === false">
                        <CloseBold/>
                    </el-icon>
                </template>
            </el-table-column>


        </template>

        <!--操作卡槽-->
        <slot name="operationsColumn"></slot>
    </el-table>

  <!--底部卡槽-->
    <slot name="footer"></slot>

  {{ multipleSelection }}
</template>

<script setup>


import {defineProps, watch, ref} from 'vue';
import {pageGenTableColumn} from "@/api/system/genTableColumn.js";
import ColumnFrom from "@/components/SqlGen/columnFrom.vue";

const {proxy} = getCurrentInstance();
const {columns, submit, inline, selection, rowKeyName} = defineProps({

    columns: {
        type: Array,
        default: undefined
    },
    showColumns: {
        type: Array,
        default: []
    },
    inline: {
        type: Boolean,
        default: false
    },
    selection: {
        type: Boolean,
        default: false
    },
    maxHeight: {
        type: Number,
        default: 371
    },
    rowKeyName: {
        type: String,
        default: null
    }
});


watch(() => columns, (newValue) => {
    emit('update:columns', newValue);
});


// 选中行
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {

    multipleSelection.value = val
}


const dateRange = ref([]);

const data = reactive({
    queryParams: {
        current: 1,
        pageSize: 10,
        total: 0,
        columnName: undefined,
        columnComment: undefined,
    },
    columnsData: [],
    expandedRowKeys: []

});


function getRowKeys(row) {
    let res;
    if (rowKeyName != null) {
        res = row[rowKeyName];
    } else {
        res = row;
    }
    return res;
}


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

// doPageGenTableColumn()

defineExpose({
    multipleSelection,
});

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
