import request from '@/utils/request'



// 删除 配置信息
export function deleteVms(data) {
    return request({
        url: '/dbdog/vm/delete',
        method: 'delete',
        data:data
    })
}
