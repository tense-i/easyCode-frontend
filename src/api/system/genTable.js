import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";




// 查询表列表
export function pageGenTable(query) {
    return request({
        url: '/tool/genTable/pageGenTable',
        method: 'get',
        params: query
    })
}

// 查询全部表信息
export function listGenTable() {
    return request({
        url: '/tool/genTable/listGenTable',
        method: 'get'
    })
}

// 动态表转为生成表
export function dynamicTableConvertGenTable(data) {
    return request({
        url: '/tool/genTable/dynamicTableConvertGenTable',
        method: 'post',
        data: data,
    })
}

// 导入表
export function importGenTables(data) {
    return request({
        url: '/tool/genTable/importGenTables',
        method: 'post',
        data: data
    })
}



