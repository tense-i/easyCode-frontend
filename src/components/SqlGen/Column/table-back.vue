<template>

    <el-table :data="columns">

        <!--操作卡槽-->
        <slot name="expandColumn"></slot>


        <el-table-column prop="columnName" label="字段名" width="150"/>
        <el-table-column prop="columnType" label="字段类型" width="120"/>


        <el-table-column
                label="字段名称"
                align="center"
                prop="columnName"
                :show-overflow-tooltip="true"
        />

        <el-table-column
                label="字段描述"
                align="center"
                prop="columnComment"
                :show-overflow-tooltip="true"
        />


        <el-table-column
                label="主键"
                width="100"
                :filters="[
                            { text: 'yes', value: '1' },
                            { text: 'no', value: '0' },
                          ]"
                :filter-method="filterTag"
                filter-placement="bottom-end"
        >
            <template #default="scope">
                <el-icon v-if="scope.row.isPk === '1'"><Select/></el-icon>
                <el-icon v-if="scope.row.isPk === '0'">
                    <CloseBold/>
                </el-icon>
            </template>
        </el-table-column>

        <el-table-column
                prop="自增"
                label="Tag"
                width="100"
                :filters="[
                            { text: 'yes', value: '1' },
                            { text: 'no', value: '0' },
                          ]"
                :filter-method="filterTag"
                filter-placement="bottom-end"
        >
            <template #default="scope">
                <el-icon v-if="scope.row.isIncrement === '1'"><Select/></el-icon>
                <el-icon v-if="scope.row.isIncrement === '0'">
                    <CloseBold/>
                </el-icon>
            </template>
        </el-table-column>

        <el-table-column
                label="必填"
                width="100"
                :filters="[
                            { text: 'yes', value: '1' },
                            { text: 'no', value: '0' },
                          ]"
                :filter-method="filterTag"
                filter-placement="bottom-end"
        >
            <template #default="scope">
                <el-icon v-if="scope.row.isRequired === '1'"><Select/></el-icon>
                <el-icon v-if="scope.row.isRequired === '0'">
                    <CloseBold/>
                </el-icon>
            </template>
        </el-table-column>


        <!--操作卡槽-->
        <slot name="operationsColumn"></slot>
    </el-table>

    <pagination
            v-show="pageGenTableColumnData.total>0"
            :total="pageGenTableColumnData.total"
            v-model:page="pageGenTableColumnQueryParams.current"
            v-model:limit="pageGenTableColumnQueryParams.pageSize"
            @pagination="handelPageGenTableColumn"
    />

</template>

<script setup>


import {defineProps, watch, ref} from 'vue';
import {pageGenTableColumn} from "@/api/system/genTableColumn.js";


const {columns, submit, inline} = defineProps({

    columns: Array,
    submit: {
        type: Boolean,
        default: false
    }, inline: {
        type: Boolean,
        default: false
    }
});


watch(() => columns, (newValue) => {
    emit('update:columns', newValue);
});

watch(() => submit, (newValue) => {
    if (submit()) {
        emit('update:submit', newValue);
    }

});


const data = reactive({
    queryParams: {
        current: 1,
        pageSize: 10,
        total: 0,
        columnName: undefined,
        columnComment: undefined,
    }

});


const {
    queryParams
} = toRefs(data);
function doPageGenTableColumn(){
    pageGenTableColumn(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
        data.pageGenTableColumnData.records = response.data.records;
        data.queryParams.total = response.data.total;
    });
}


function handelPageGenTableColumn() {


}

</script>

<style>

</style>
