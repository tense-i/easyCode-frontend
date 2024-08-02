import request from '@/utils/request'


// 动态库
export function listDynamicDatabase(data, query) {
    return request({
        url: '/dbdog/dynamicData/list/database',
        method: 'post',
        params: query,
        data: data
    })
}

// 动态表
export function listDynamicTable(data, query) {
    return request({
        url: '/dbdog/dynamicData/list/table',
        method: 'post',
        params: query,
        data: data
    })
}


