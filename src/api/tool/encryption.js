import request from '@/utils/request'

// 加密
export function jasyptEncrypt(data) {
    return request({
        url: '/tool/enc/jasyptEncrypt',
        method: 'post',
        data: data
    })
}

// 解密
export function jasyptDecrypt(data) {
    return request({
        url: '/tool/enc/jasyptDecrypt',
        method: 'post',
        data: data
    })
}

