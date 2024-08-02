<template>

        <el-form :model="column" ref="queryRef" :inline="true" label-position="left">

            <el-form-item label="字段名" prop="columnName">
                <el-input
                        v-model="column.columnName"
                        placeholder="请输入字段名称"
                        clearable
                        style="width: 200px"
                        @keyup.enter="handleQuery"
                />
            </el-form-item>

            <el-form-item label="字段类型" prop="columnType">
                <el-input
                        v-model="column.columnType"
                        placeholder="请输入字段名称"
                        clearable
                        style="width: 200px"
                        @keyup.enter="handleQuery"
                />
            </el-form-item>

            <el-form-item label="默认值" prop="defaultValue">
                <el-input
                        v-model="column.defaultValue"
                        placeholder="要与字段类型匹配"
                        clearable
                        style="width: 200px"
                        @keyup.enter="handleQuery"
                />
            </el-form-item>

            <el-form-item label="字段备注" prop="comment">
                <el-input
                        v-model="column.comment"
                        placeholder="字段备注"
                        clearable
                        style="width: 200px"
                        @keyup.enter="handleQuery"
                />
            </el-form-item>

            <el-form-item label="非空" prop="isRequired">
                <el-switch
                        v-model="column.isRequired"
                        inline-prompt
                        active-text="是"
                        inactive-text="否"
                />
            </el-form-item>

            <el-form-item label="主键" prop="isPk">
                <el-switch
                        v-model="column.isPk"
                        inline-prompt
                        active-text="是"
                        inactive-text="否"
                />
            </el-form-item>

            <el-form-item label="自增" prop="isIncrement">
                <el-switch
                        v-model="column.isIncrement"
                        inline-prompt
                        active-text="是"
                        inactive-text="否"
                />
            </el-form-item>

            <el-form-item label="模拟类型" prop="mockType">
                <el-select
                        v-model="column.mockType"
                        filterable
                        placeholder="模拟类型"
                        style="width: 240px"
                >

                    <el-option
                            v-for="item in simulationTypeOptions1"
                            :key="item"
                            :label="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="固定值" prop="mockParams"
                          v-if="column.mockType === '固定'">
                <el-input
                        v-model="column.mockParam1"
                        placeholder="请输入固定值"
                        clearable
                        style="width: 200px"
                        @keyup.enter="handleQuery"
                />
            </el-form-item>

            <el-form-item label="随机规则" prop="mockParams"
                          v-if="column.mockType === '随机'">
                <el-select
                        v-model="column.mockParam1"
                        filterable
                        placeholder="模拟类型"
                        style="width: 240px"
                >

                    <el-option
                            v-for="item in simulationTypeOptions1"
                            :key="item"
                            :label="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="起始值" prop="mockParams"
                          v-if="column.mockType === '递增'">
                <el-input-number
                        v-model="p.mockParam1"
                        class="mx-4"
                        controls-position="right"
                        @change="handleChange"
                />
            </el-form-item>

            <el-form-item label="规则" prop="mockParams"
                          v-if="column.mockType === '规则'">
                <el-input
                        v-model="column.mockParam1"
                        placeholder="请输入正则表达式"
                        clearable
                        style="width: 200px"
                        @keyup.enter="handleQuery"
                />
            </el-form-item>

            <el-form-item label="词库" prop="mockParams"
                          v-if="column.mockType === '词库'">
                <el-select
                        v-model="column.mockParam1"
                        filterable
                        placeholder="模拟类型"
                        style="width: 240px"
                >

                    <el-option
                            v-for="item in simulationTypeOptions1"
                            :key="item"
                            :label="item"
                            :value="item"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="表名" prop="mockParams"
                          v-if="column.mockType === '关联'">
                <el-select
                        v-model="column.mockParam1"
                        filterable
                        placeholder="模拟类型"
                        style="width: 240px"
                >
                    <el-option
                            v-for="(item,index) in tableSchemaList"
                            :key="index"
                            :label="item.tableName"
                            :value="index"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="字段名" prop="mockParams"
                          v-if="column.mockType === '关联'&& tableSchemaList[column.mockParam1]">
                <el-select
                        v-model="column.mockParam2"
                        filterable
                        placeholder="模拟类型"
                        style="width: 240px"
                >

                    <el-option
                            v-for="(item,index) in tableSchemaList[column.mockParam1]['columns']"
                            :key="item"
                            :label="item.columnName"
                            :value="index"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="对应关系" prop="mockParams"
                          v-if="column.mockType === '关联'">
                <el-input
                        v-model="column.mockParam3"
                        placeholder="请输入正则表达式"
                        clearable
                        style="width: 200px"
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
        </el-form>

</template>

<script setup>


import { defineProps, watch, ref } from 'vue';

const {  column } = defineProps({
    visible: String,
    column: Array
});

watch(() => visible, (newValue) => {
    emit('update:visible', newValue);
});

watch(() => column, (newValue) => {
    emit('update:column', newValue);
});


</script>

<style>

</style>
