<template>

  <!--头部卡槽-->
    <slot name="header"></slot>


  <!--    stripe斑马纹-->
    <el-table :data="columns"
              :row-key="getRowKeys"
              @selection-change="handleSelectionChangeEmits"
              stripe
              :max-height="maxHeight">

        <el-table-column type="selection" v-if="selection"/>
        <el-table-column type="index" v-if="index" width="50px"/>
        <slot name="index"></slot>
        <!--展开列卡槽-->
        <slot name="expandColumn"></slot>


        <!--展示-->
        <template v-for="(item,index) in showColumns">

            <el-table-column
                    v-if="item.type === null || item.type === ''"
                    :prop="item.key"
                    :label="item.label"
                    :show-overflow-tooltip="true"
                    align="center"/>
            <!--        输入-->
            <el-table-column :label="item.label"
                             v-if="item.type === 'input'">
                <template #default="scope">
                    <el-input v-model="scope.row[item.key]"
                              :rows="1"
                              clearable
                              :autosize="{ minRows: 1, maxRows: 3 }"
                              type="textarea">

                    </el-input>
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
                             width="50px"
                             v-if="item.type === 'check'">
                <template #default="scope">
                    <el-checkbox
                            :true-label="item.check.true"
                            :false-label="item.check.false"
                            v-model="scope.row[item.key]">
                    </el-checkbox>
                </template>
            </el-table-column>
            <!--check-no-->
            <el-table-column :label="item.label"
                             width="50px"
                             v-if="item.type === 'check-no'">
                <template #default="scope">
                    <el-checkbox
                            disabled
                            :true-label="item.check.true"
                            :false-label="item.check.false"
                            v-model="scope.row[item.key]">
                    </el-checkbox>
                </template>
            </el-table-column>
            <!--select-->
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
                    v-if="item.type != null && item.type === 'or'"
                    :label="item.label"
                    align="center"
            >
                <template #default="scope">
                    <el-icon v-if="scope.row[item.key] === item.or.true"><Select/></el-icon>
                    <el-icon v-if="scope.row[item.key] === item.or.true === false">
                        <CloseBold/>
                    </el-icon>
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
</template>

<script setup>


import {defineProps, watch, ref} from 'vue';


const {proxy} = getCurrentInstance();

// 选中行
const multipleSelection = ref([]);

function onChane() {
    $emit('update:test', '新的值')
}

// 父组件传递数据
const {columns, submit, inline, selection, rowKeyName, selectionRows} = defineProps({

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
    index: {
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
    },
    selectionRows: {
        type: Array,
        default: []
    },

});


watch(() => columns, (newValue) => {
    $emit('update:columns', newValue);
});


//利用defineEmits方法返回函数触发自定义事件
//defineEmits方法不需要引入直接使用
let $emit = defineEmits(['SelectionChange']);

// 选中行改变
const handleSelectionChangeEmits = (rows) => {

    multipleSelection.value = rows
    $emit('SelectionChange', rows)

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


// 根据指定属性名 指定表列的key
function getRowKeys(row) {

    let res;
    if (rowKeyName != null) {

        res = row[rowKeyName];
    } else {
        res = row;
    }
    console.log(res+"key")
    return res;
}

// 暴露选中数据
defineExpose({
    multipleSelection,
});

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
