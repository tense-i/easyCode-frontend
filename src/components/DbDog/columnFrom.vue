<template xmlns:el-col="http://www.w3.org/1999/html">

    <el-form :model="column"
             ref="queryRef"
             :inline="inline"
             label-position="left"
             label-width="auto">
        <el-row :gutter="10">

            <el-col :span="12">
                <el-form-item label="字段名" prop="columnName">
                    <el-input
                            style="width: 100%"
                            v-model="column.columnName"
                            placeholder="请输入字段名称"
                            clearable

                    />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="字段类型" prop="columnType">
                    <el-input
                            v-model="column.columnType"
                            placeholder="请输入字段名称"
                            clearable

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
                                inactive-text="非必填"
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
                        :label="historyMockParams[column.mockType].label">
                    <el-input-number
                            v-model="historyMockParams[column.mockType].mockParams"
                            :placeholder="historyMockParams[column.mockType].placeholder"
                            clearable

                    />
                </el-form-item>

                <el-form-item
                        v-if="column.mockType === '固定'"
                        :label="historyMockParams[column.mockType].label">
                    <el-input
                            v-model="historyMockParams[column.mockType].mockParams"
                            :placeholder="historyMockParams[column.mockType].placeholder"
                            clearable/>
                </el-form-item>

                <el-form-item
                        v-if="column.mockType === '随机'"
                        :label="historyMockParams[column.mockType].label">
                    <el-select
                            v-model="historyMockParams[column.mockType].mockParams"
                            filterable
                            :placeholder="historyMockParams[column.mockType].placeholder">

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
                        :label="historyMockParams[column.mockType].label">
                    <el-input
                            v-model="historyMockParams[column.mockType].mockParams"
                            :placeholder="historyMockParams[column.mockType].placeholder"
                            clearable/>
                </el-form-item>

                <el-form-item
                        v-if="column.mockType === '词库'"
                        :label="historyMockParams[column.mockType].label">
                    <el-select
                            v-model="historyMockParams[column.mockType].mockParams"
                            filterable
                            :placeholder="historyMockParams[column.mockType].placeholder">

                        <template #header>
                            <el-row :gutter="10">
                                <el-col :span="16">
                                    <el-input
                                            v-model="querdyGenDictParams.name"
                                            style="width: 100%"
                                            placeholder="搜索词库名"
                                            clearable
                                            @keyup.enter="doListGenDictByPage"
                                    />
                                </el-col>
                                <el-col :span="4">
                                    <el-tooltip :content="querdyGenDictParams.shared?'共享词库':'由我创建'"
                                                placement="top">
                                        <el-switch
                                            v-model="querdyGenDictParams.shared"
                                            class="mb-2"
                                            @change="doListGenDictByPage"
                                        >
                                            <template #active-action>
                                                <span class="custom-active-action">T</span>
                                            </template>
                                            <template #inactive-action>
                                                <span class="custom-inactive-action">F</span>
                                            </template>
                                        </el-switch>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span=4>
                                    <el-button :icon="Search" circle @click="doListGenDictByPage"/>
                                </el-col>
                            </el-row>
                        </template>
                        <el-option
                                v-for="item in dictList"
                                :key="item.id"
                                :label="item.name+'('+item.id+')'"
                                :value="item.name+'('+item.id+')'"
                        />
                        <template #footer>
                            <el-pagination
                                    small
                                    background
                                    layout="prev, pager, next"
                                    :total="querdyGenDictParams.total"
                                    class="mt-4"
                                    @current-change="handleCurrentChange"
                            />
                        </template>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="column.mockType === '关联'">
                <el-form-item
                        v-if="column.mockType === '关联'"
                        :label="historyMockParams[column.mockType].label[0]">

                    <el-select
                            v-model="historyMockParams[column.mockType].mockParams[0]"
                            filterable
                            @change="changeGenTableList"
                            :placeholder="historyMockParams[column.mockType].placeholder[0]">

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
                        :label="historyMockParams[column.mockType].label[1]">

                    <el-select
                            v-model="historyMockParams[column.mockType].mockParams[1]"
                            filterable
                            :label="historyMockParams[column.mockType].label[1]">

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
                        :label="historyMockParams[column.mockType].label[2]">
                    <el-input
                            v-model="historyMockParams[column.mockType].mockParams[2]"
                            :placeholder="historyMockParams[column.mockType].placeholder[2]"
                            clearable/>
                </el-form-item>
            </el-col>


        </el-row>

        <!--        确认-->
        <el-form-item v-if="submit">
            <el-button type="primary" @click="onSubmit">Create</el-button>
            <el-button>Cancel</el-button>
        </el-form-item>

    </el-form>

</template>

<script setup>


import {defineProps, watch, ref} from 'vue';
import {listMyAddDictByPage, listSharedDictByPage} from "@/api/system/genDict.js";
import {Search} from "@element-plus/icons-vue";


const {column, submit, inline, genTableList, selfGenTable, historyMockParams} = defineProps({

    column: Array,
    genTableList: Array,
    selfGenTable: Object,
    submit: {
        type: Boolean,
        default: false
    }, inline: {
        type: Boolean,
        default: false
    },
    historyMockParams: {
        不模拟: {mockParams: '', placeholder: '不模拟', label: '不模拟'},
        递增: {mockParams: '', placeholder: '请输入起始值', label: '起始值'},
        固定: {mockParams: '', placeholder: '请输入固定值', label: '固定值'},
        随机: {mockParams: '', placeholder: '请选择随机规则', label: '随机'},
        规则: {mockParams: '', placeholder: '请输入正则表达式', label: '规则'},
        词库: {mockParams: '', placeholder: '请选择词库', label: '词库'},
        关联: {
            mockParams: ['', '', '',],
            placeholder: ['请选择关联表', '请选择关联字段', '数量关系'],
            label: ['关联表', '关联字段', '关联数量']
        },
    }
});


watch(() => column, (newValue) => {
    emit('update:column', newValue);
});

watch(() => submit, (newValue) => {
    if (submit()) {
        emit('update:submit', newValue);
    }

});


const mockTypeOptions = [
    "不模拟",
    "递增",
    "固定",
    "随机",
    "规则",
    "词库",
    "关联"
]


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
]

const selectColumns = ref([]);
const dictList = ref([]);

const data = reactive({
    querdyGenDictParams: {
        current: 1,
        pageSize: 10,
        total: 0,
        name: undefined,
        shared: false
    }


});


const {
    querdyGenDictParams,
} = toRefs(data);

// 排除字段本身所在表
function excludeSelfGenTable() {
    debugger
    return genTableList.filter(item => item.tableId !== selfGenTable.tableId);
}

// 选择表改变
function changeGenTableList() {
    debugger
    let genTableName = historyMockParams[column.mockType].mockParams[0];
    // 使用 find 方法找到元素
    const genTable = genTableList.find(element => element.tableName === genTableName);

    selectColumns.value = genTable.columns;
    historyMockParams[column.mockType].mockParams[1] = '';
}


column.mockParams = computed(() => {

    let res;
    if (column.mockType === '关联') {
        let tableName = historyMockParams[column.mockType].mockParams[0];
        let columnName = historyMockParams[column.mockType].mockParams[1];
        let n = historyMockParams[column.mockType].mockParams[2];
        res = tableName + "." + columnName + "(" + n + ")";
    } else {
        res = historyMockParams[column.mockType].mockParams;
    }
    return res;

});


// ---------------------------function------------------------------

// 分页生成词库资源列表
function doListGenDictByPage() {
    let shared = data.querdyGenDictParams.shared;
    if (!shared) {
        listMyAddDictByPage(data.querdyGenDictParams).then(res => {
            if (res.code === 200) {
                dictList.value = res.data.records;
                data.querdyGenDictParams.total = Number(res.data.total);
            }
        })
    } else {
        listSharedDictByPage(data.querdyGenDictParams).then(res => {
            if (res.code === 200) {
                dictList.value = res.data.records;
                data.querdyGenDictParams.total = Number(res.data.total);
            }
        })
    }
}


function handleCurrentChange(val) {
    data.querdyGenDictParams.current = val;
    doListGenDictByPage()
}

function onSubmit() {
    emit('update:submit', newValue);
}

doListGenDictByPage()

</script>

<style>

</style>
