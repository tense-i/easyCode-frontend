import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";

// 查询字段列表
export function pageGenTableColumn(query) {
    return request({
        url: '/tool/genColumn/pageGenTableColumn',
        method: 'get',
        params: query
    })
}


// 分页我的资源
export function pageGenTable(query) {
    return request({
        url: '/tool/gen/pageGenTable',
        method: 'get',
        params: query
    })
}

// 分页共享资源
export function pageSharedGenTable(query) {
    return request({
        url: '/tool/genTable/shared/pageGenTable',
        method: 'get',
        params: query
    })
}

// 查询全部表信息
export function listTableInfo() {
    return request({
        url: '/tool/gen/listTableInfo',
        method: 'get'
    })
}

// 查询全部表信息
export function listDynamicColumn(dataSourceModel, query) {
    return request({
        url: '/dbdog/dynamicData/list/column',
        method: 'post',
        data: dataSourceModel,
        params: query,
    })
}


/**
 *  <p>保存字段</p>
 * <p>没有指定保存的表，则保存至用户的公共字段表</p>*/
export function importGenTableColumns(query, data) {
    return request({
        url: '/tool/genColumn/importGenTableColumns',
        method: 'post',
        data: data,
        params: query,
    })
}





